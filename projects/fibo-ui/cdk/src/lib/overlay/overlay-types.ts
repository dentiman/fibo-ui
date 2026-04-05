/** Snapshot of focus state captured just before an overlay closes. */
export interface OverlayCloseContext {
  activeElement: HTMLElement | null;
}

/**
 * Why an overlay was closed.
 *
 * - `programmatic` — `overlay.close()` called without a specific reason
 * - `escape` — user pressed Escape
 * - `focusout` — focus moved outside the overlay (closeOnFocusLeave)
 * - `outside-click` — click outside the overlay content
 * - `blur` — scroll outside the overlay (closeOnScroll)
 * - `state` — `isOpen` signal set to false externally
 * - `destroy` — host component destroyed
 */
export type OverlayCloseReason =
  | 'programmatic'
  | 'escape'
  | 'focusout'
  | 'outside-click'
  | 'blur'
  | 'state'
  | 'destroy';
