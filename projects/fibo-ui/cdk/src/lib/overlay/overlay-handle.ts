import { InjectionToken, Signal, TemplateRef } from '@angular/core';
import type { OverlayCloseReason } from './overlay-session';

export type OverlayCategory =
  | 'popover'
  | 'menu'
  | 'dialog'
  | 'tooltip'
  | 'confirmation'
  | 'notification';

// Runtime object for one currently open overlay.
export interface OverlayHandle {
  readonly id: string;
  readonly category: OverlayCategory;
  readonly zIndex: number;
  readonly firstInCategory: Signal<boolean>;
  readonly templateRef: TemplateRef<any> | undefined;
  readonly referenceElement: HTMLElement | null | undefined;
  readonly closed: boolean;
  close(reason?: OverlayCloseReason): void;
}

export const OVERLAY_HANDLE = new InjectionToken<OverlayHandle>('OVERLAY_HANDLE');
