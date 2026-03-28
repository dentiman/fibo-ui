import type { DestroyRef } from '@angular/core';
import type { OverlayCloseContext } from './overlay-types';
import type { OverlaySession } from './overlay-session';
import type { OverlayCategory, OverlayHandle } from './overlay-handle';

// --- Scroll Lock ---

let scrollLockCount = 0;
let scrollLockSavedY = 0;
let scrollLockSavedX = 0;

function lockScroll(): void {
  scrollLockCount += 1;
  if (scrollLockCount > 1) return;

  scrollLockSavedY = window.scrollY;
  scrollLockSavedX = window.scrollX;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const html = document.documentElement;

  html.style.position = 'fixed';
  html.style.top = `-${scrollLockSavedY}px`;
  html.style.left = `-${scrollLockSavedX}px`;
  html.style.width = '100%';
  html.style.overflow = 'hidden';
  html.style.overscrollBehavior = 'none';
  document.body.style.touchAction = 'none';
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function unlockScroll(): void {
  if (scrollLockCount === 0) return;

  scrollLockCount -= 1;
  if (scrollLockCount > 0) return;

  const html = document.documentElement;
  html.style.position = '';
  html.style.top = '';
  html.style.left = '';
  html.style.width = '';
  html.style.overflow = '';
  html.style.overscrollBehavior = '';
  document.body.style.touchAction = '';
  document.body.style.paddingRight = '';
  window.scrollTo(scrollLockSavedX, scrollLockSavedY);
}

/**
 * Blocks document scroll while the overlay is open.
 * Supports nested scroll locks via reference counting.
 */
export function blockScroll(destroyRef: DestroyRef): void {
  lockScroll();
  destroyRef.onDestroy(() => unlockScroll());
}

const TABBABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const DEFAULT_FOCUS_INITIAL_SELECTOR = '[fiboFocusInitial]';
const DEFAULT_FOCUS_ROOT_SELECTOR = '[data-dialog-panel]';
const MODAL_FOCUS_CATEGORIES: ReadonlySet<OverlayCategory> = new Set(['dialog', 'confirmation']);

export interface TrapOverlayFocusOptions {
  guard?: boolean;
  autoFocus?: boolean;
  loopTab?: boolean;
  preventScroll?: boolean;
  initialSelector?: string;
  rootSelector?: string;
}

/**
 * Restores focus back to the trigger element after an overlay finishes closing.
 * Focus is restored only when the user has not already moved focus to another
 * meaningful destination outside the closing overlay container.
 */
export function restoreTriggerFocus(
  ctx: OverlayCloseContext,
  overlay: OverlayHandle,
  isInOverlayBranch: (target: EventTarget | null | undefined) => boolean = target =>
    isElementInsideOverlayContainer(target, overlay.id),
): void {
  const focusTarget =
    overlay.focusReturnTarget ?? overlay.interactionRoot ?? overlay.referenceElement;
  const shouldRestore =
    !ctx.activeElement ||
    ctx.activeElement === document.body ||
    isInOverlayBranch(ctx.activeElement);

  if (shouldRestore) {
    focusTarget?.focus();
  }
}

/**
 * Connects a close policy that returns focus to the trigger before the overlay
 * switches to the closed state.
 */
export function restoreTriggerFocusOnClose(overlay: OverlaySession): void {
  overlay.beforeClose((ctx, handle) =>
    restoreTriggerFocus(ctx, handle, target => overlay.isInOverlayBranch(target)),
  );
}

function getOverlayContainerElement(overlayId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-overlay-container-id="${overlayId}"]`);
}

function getOverlayFocusRoot(overlayId: string, rootSelector: string): HTMLElement | null {
  const container = getOverlayContainerElement(overlayId);
  if (!container) {
    return null;
  }

  return container.querySelector<HTMLElement>(rootSelector) ?? container;
}

function getTabbableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(el => {
    if (el.hasAttribute('disabled')) {
      return false;
    }

    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }

    return el.getClientRects().length > 0;
  });
}

function focusElement(element: HTMLElement, preventScroll: boolean): void {
  element.focus({ preventScroll });
}

function focusOverlayEntryTarget(
  overlayId: string,
  options: Required<Pick<TrapOverlayFocusOptions, 'preventScroll' | 'initialSelector' | 'rootSelector'>>,
): void {
  const root = getOverlayFocusRoot(overlayId, options.rootSelector);
  if (!root) {
    return;
  }

  const marked = root.querySelector<HTMLElement>(options.initialSelector);
  const firstFocusable = getTabbableElements(root)[0];
  const target = marked ?? firstFocusable ?? root;

  if (target === root && !root.hasAttribute('tabindex')) {
    root.tabIndex = -1;
  }

  focusElement(target, options.preventScroll);
}

function focusOverlayFallbackTarget(
  overlayId: string,
  options: Required<Pick<TrapOverlayFocusOptions, 'preventScroll' | 'rootSelector'>>,
): void {
  const root = getOverlayFocusRoot(overlayId, options.rootSelector);
  if (!root) {
    return;
  }

  const firstFocusable = getTabbableElements(root)[0] ?? root;
  if (firstFocusable === root && !root.hasAttribute('tabindex')) {
    root.tabIndex = -1;
  }

  focusElement(firstFocusable, options.preventScroll);
}

/**
 * Unified overlay focus policy:
 * - autofocuses on open
 * - keeps Tab/Shift+Tab navigation cyclic inside current overlay container
 * - optionally guards focus escape for modal categories
 *
 * Guard is enabled automatically for modal categories (dialog, confirmation).
 */
export function trapOverlayFocus(
  overlay: OverlaySession,
  options: TrapOverlayFocusOptions = {},
): void {
  const autoFocus = options.autoFocus ?? true;
  const loopTab = options.loopTab ?? true;
  const preventScroll = options.preventScroll ?? true;
  const initialSelector = options.initialSelector ?? DEFAULT_FOCUS_INITIAL_SELECTOR;
  const rootSelector = options.rootSelector ?? DEFAULT_FOCUS_ROOT_SELECTOR;
  const guard = options.guard ?? MODAL_FOCUS_CATEGORIES.has(overlay.handle.category);

  if (autoFocus) {
    overlay.afterOpened(() => {
      focusOverlayEntryTarget(overlay.handle.id, {
        preventScroll,
        initialSelector,
        rootSelector,
      });
    });
  }

  if (loopTab) {
    const effectRef = overlay.effect(onCleanup => {
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') {
          return;
        }

        const targetOverlayId = overlay.findOverlayContainerId(event.target);
        if (targetOverlayId !== overlay.handle.id) {
          return;
        }

        const root = getOverlayFocusRoot(overlay.handle.id, rootSelector);
        if (!root) {
          return;
        }

        const focusable = getTabbableElements(root);
        if (focusable.length === 0) {
          event.preventDefault();
          focusOverlayFallbackTarget(overlay.handle.id, { preventScroll, rootSelector });
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        const isInTabOrder = !!active && focusable.includes(active);

        if (event.shiftKey) {
          if (active === first || !isInTabOrder) {
            event.preventDefault();
            focusElement(last, preventScroll);
          }
          return;
        }

        if (active === last || !isInTabOrder) {
          event.preventDefault();
          focusElement(first, preventScroll);
        }
      };

      document.addEventListener('keydown', handleKeydown, true);
      onCleanup(() => document.removeEventListener('keydown', handleKeydown, true));
    });

    overlay.onCleanup(() => effectRef.destroy());
  }

  if (guard) {
    const effectRef = overlay.effect(onCleanup => {
      const handleFocusIn = (event: FocusEvent) => {
        if (overlay.isInOverlayBranch(event.target)) {
          return;
        }

        focusOverlayFallbackTarget(overlay.handle.id, { preventScroll, rootSelector });
      };

      document.addEventListener('focusin', handleFocusIn, true);
      onCleanup(() => document.removeEventListener('focusin', handleFocusIn, true));
    });

    overlay.onCleanup(() => effectRef.destroy());
  }
}

export function isElementInsideOverlayContainer(
  target: EventTarget | null | undefined,
  overlayId: string | null | undefined,
): boolean {
  if (!(target instanceof Element) || !overlayId) {
    return false;
  }

  return !!target.closest(`[data-overlay-container-id="${overlayId}"]`);
}

