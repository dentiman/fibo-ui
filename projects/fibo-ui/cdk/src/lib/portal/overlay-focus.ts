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
