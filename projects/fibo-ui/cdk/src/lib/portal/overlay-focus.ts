import { OverlayCloseContext, OverlayRef } from './overlay-registry';

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
