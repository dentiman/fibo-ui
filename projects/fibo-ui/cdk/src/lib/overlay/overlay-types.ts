export interface OverlayCloseContext {
  activeElement: HTMLElement | null;
}

export type OverlayCloseReason =
  | 'programmatic'
  | 'escape'
  | 'focusout'
  | 'outside-click'
  | 'backdrop'
  | 'blur'
  | 'state'
  | 'destroy';
