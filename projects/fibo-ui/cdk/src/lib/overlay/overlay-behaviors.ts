import { OverlayCloseContext, OverlaySession } from './overlay-session';
import { OverlayHandle } from './overlay-handle';

const TABBABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

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

/**
 * Closes the current overlay when focus leaves both the trigger element and the
 * rendered overlay container.
 */
export function closeOnFocusLeave(overlay: OverlaySession): void {
  const effectRef = overlay.effect(onCleanup => {
    const interactionRoot = overlay.handle.interactionRoot ?? overlay.handle.referenceElement;
    if (!interactionRoot) {
      return;
    }

    const handleFocusIn = (event: FocusEvent) => {
      const nextTarget = event.target as Node | null;
      if (!nextTarget) {
        return;
      }

      if (interactionRoot.contains(nextTarget) || overlay.isInOverlayBranch(nextTarget)) {
        return;
      }

      overlay.requestClose('focusout', event);
    };

    document.addEventListener('focusin', handleFocusIn, true);
    onCleanup(() => document.removeEventListener('focusin', handleFocusIn, true));
  });

  overlay.onCleanup(() => effectRef.destroy());
}

/**
 * Closes the current overlay when the user clicks outside both the trigger and
 * the rendered overlay container.
 */
export function closeOnOutsideClick(overlay: OverlaySession): void {
  const effectRef = overlay.effect(onCleanup => {
    const interactionRoot = overlay.handle.interactionRoot ?? overlay.handle.referenceElement;
    if (!interactionRoot) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (interactionRoot.contains(target) || overlay.isInOverlayBranch(target)) {
        return;
      }

      overlay.requestClose('outside-click', event);
    };

    document.addEventListener('click', handleClick, true);
    onCleanup(() => document.removeEventListener('click', handleClick, true));
  });

  overlay.onCleanup(() => effectRef.destroy());
}

/**
 * Closes a modal overlay when the click lands on its backdrop area, while
 * leaving clicks inside the marked dialog panel untouched.
 */
export function closeOnBackdropClick(overlay: OverlaySession): void {
  const effectRef = overlay.effect(onCleanup => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const overlayContainer = target.closest(
        `[data-overlay-container-id="${overlay.handle.id}"]`,
      );
      if (!overlayContainer) {
        return;
      }

      if (target.closest('[data-dialog-panel]')) {
        return;
      }

      overlay.requestClose('backdrop', event);
    };

    document.addEventListener('click', handleClick, true);
    onCleanup(() => document.removeEventListener('click', handleClick, true));
  });

  overlay.onCleanup(() => effectRef.destroy());
}

/**
 * Shared scroll lock state. Only the first caller locks;
 * only the last caller restores. Nested dialogs are safe.
 */
let scrollLockCount = 0;
let scrollLockSavedY = 0;
let scrollLockSavedX = 0;

function acquireScrollLock(): void {
  scrollLockCount++;
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
    html.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function releaseScrollLock(): void {
  if (scrollLockCount === 0) return;
  scrollLockCount--;
  if (scrollLockCount > 0) return;

  const html = document.documentElement;
  html.style.position = '';
  html.style.top = '';
  html.style.left = '';
  html.style.width = '';
  html.style.overflow = '';
  html.style.overscrollBehavior = '';
  html.style.paddingRight = '';
  document.body.style.touchAction = '';
  window.scrollTo(scrollLockSavedX, scrollLockSavedY);
}

/**
 * Blocks document scroll while the overlay is open.
 * Preserves scroll position and compensates scrollbar width to prevent layout shift.
 * Supports nesting: multiple overlays can request blockScroll simultaneously.
 */
export function blockScroll(overlay: OverlaySession): void {
  let acquired = false;

  overlay.afterOpened(() => {
    acquireScrollLock();
    acquired = true;
  });

  const release = () => {
    if (acquired) {
      releaseScrollLock();
      acquired = false;
    }
  };

  overlay.beforeClose(release);
  overlay.onCleanup(release);
}

/**
 * Closes the overlay when the user scrolls outside the overlay container.
 * Useful for tooltips that lose context when the trigger scrolls away.
 */
export function closeOnScroll(overlay: OverlaySession): void {
  const effectRef = overlay.effect(onCleanup => {
    const handleScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && isElementInsideOverlayContainer(target, overlay.handle.id)) {
        return;
      }
      overlay.requestClose('blur', event);
    };

    document.addEventListener('scroll', handleScroll, true);
    onCleanup(() => document.removeEventListener('scroll', handleScroll, true));
  });

  overlay.onCleanup(() => effectRef.destroy());
}

/**
 * Guards focus inside a modal overlay by redirecting any focus that escapes
 * back to the first focusable element in the overlay panel.
 *
 * Unlike FocusTrap's guardFocus, this check is overlay-aware: focus inside
 * descendant overlays (e.g. a datepicker calendar opened from within a dialog)
 * is correctly treated as "still inside" and is never redirected.
 */
export function guardModalFocus(overlay: OverlaySession): void {
  const effectRef = overlay.effect(onCleanup => {
    const handleFocusIn = (event: FocusEvent) => {
      if (overlay.isInOverlayBranch(event.target)) return;

      const container = document.querySelector<HTMLElement>(
        `[data-overlay-container-id="${overlay.handle.id}"]`,
      );
      if (!container) return;

      const panel = container.querySelector<HTMLElement>('[data-dialog-panel]');
      const root = panel ?? container;
      const firstFocusable = root.querySelector<HTMLElement>(TABBABLE_SELECTOR);
      (firstFocusable ?? root).focus();
    };

    document.addEventListener('focusin', handleFocusIn, true);
    onCleanup(() => document.removeEventListener('focusin', handleFocusIn, true));
  });

  overlay.onCleanup(() => effectRef.destroy());
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

export function isFocusInsideTriggerOrOverlay(
  target: EventTarget | null | undefined,
  trigger: Node,
  overlayId: string | null | undefined,
): boolean {
  if (!(target instanceof Node)) {
    return false;
  }

  return trigger.contains(target) || isElementInsideOverlayContainer(target, overlayId);
}
