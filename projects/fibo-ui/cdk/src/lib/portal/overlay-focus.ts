import {
  OverlayCloseContext,
  OverlayRef,
  OverlaySetupContext,
} from './overlay-registry';

/**
 * Restores focus to the trigger element when an overlay closes.
 * Focus is restored only if it's currently on `document.body` (nowhere)
 * or inside the closing overlay portal. If the user already clicked
 * outside the portal, focus stays on the new element.
 */
export function restoreOverlayFocus(
  ctx: OverlayCloseContext,
  overlay: OverlayRef
): void {
  const shouldRestore =
    !ctx.activeElement ||
    ctx.activeElement === document.body ||
    isElementInOverlayPortal(ctx.activeElement, overlay.id);

  if (shouldRestore) {
    overlay.referenceElement?.focus();
  }
}

export function restoreFocusOnBeforeClose(overlay: OverlaySetupContext): void {
  overlay.beforeClose((ctx, ref) => restoreOverlayFocus(ctx, ref));
}

export function closeOnFocusOutFromOverlay(overlay: OverlaySetupContext): void {
  const ref = overlay.effect(onCleanup => {
    const host = overlay.ref.referenceElement;
    if (!host) {
      return;
    }

    const handleFocusOut = (event: FocusEvent) => {
      const relatedTarget = event.relatedTarget as Node | null;
      if (!relatedTarget) {
        return;
      }

      if (isFocusInsideHostOrOverlay(relatedTarget, host, overlay.ref.id)) {
        return;
      }

      overlay.requestClose('focusout', event);
    };

    host.addEventListener('focusout', handleFocusOut);
    onCleanup(() => host.removeEventListener('focusout', handleFocusOut));
  });

  overlay.onCleanup(() => ref.destroy());
}

export function closeOnClickOutside(overlay: OverlaySetupContext): void {
  const ref = overlay.effect(onCleanup => {
    const host = overlay.ref.referenceElement;
    if (!host) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (host.contains(target) || isElementInOverlayPortal(target, overlay.ref.id)) {
        return;
      }

      overlay.requestClose('outside-click', event);
    };

    document.addEventListener('click', handleClick, true);
    onCleanup(() => document.removeEventListener('click', handleClick, true));
  });

  overlay.onCleanup(() => ref.destroy());
}

export function isElementInOverlayPortal(
  target: EventTarget | null | undefined,
  portalId: string | null | undefined,
): boolean {
  if (!(target instanceof Element) || !portalId) {
    return false;
  }

  return !!target.closest(`[data-portal-id="${portalId}"]`);
}

export function isFocusInsideHostOrOverlay(
  target: EventTarget | null | undefined,
  host: Node,
  portalId: string | null | undefined,
): boolean {
  if (!(target instanceof Node)) {
    return false;
  }

  return host.contains(target) || isElementInOverlayPortal(target, portalId);
}
