import { OverlayCloseContext, OverlaySession } from './overlay-session';
import { OverlayHandle } from './overlay-handle';

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
  const shouldRestore =
    !ctx.activeElement ||
    ctx.activeElement === document.body ||
    isInOverlayBranch(ctx.activeElement);

  if (shouldRestore) {
    overlay.referenceElement?.focus();
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
    const trigger = overlay.handle.referenceElement;
    if (!trigger) {
      return;
    }

    const handleFocusIn = (event: FocusEvent) => {
      const nextTarget = event.target as Node | null;
      if (!nextTarget) {
        return;
      }

      if (trigger.contains(nextTarget) || overlay.isInOverlayBranch(nextTarget)) {
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
    const trigger = overlay.handle.referenceElement;
    if (!trigger) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (trigger.contains(target) || overlay.isInOverlayBranch(target)) {
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
