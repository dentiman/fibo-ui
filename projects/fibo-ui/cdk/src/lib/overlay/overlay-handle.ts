import { InjectionToken, WritableSignal } from '@angular/core';
import type { Signal, TemplateRef } from '@angular/core';
import type { OverlayCloseReason } from './overlay-types';
import type { OverlayBehaviorConfig, OverlayPositionConfig } from './overlay-config';

// Runtime object for one currently open overlay.
export interface OverlayHandle {
  readonly id: string;
  readonly behavior: OverlayBehaviorConfig;
  readonly position: Signal<OverlayPositionConfig>;
  readonly content: Signal<TemplateRef<any> | string | undefined>;
  /** Host element of the overlay shell, set by OverlayContainer on init. */
  readonly hostElement: WritableSignal<HTMLElement | null>;
  close(reason?: OverlayCloseReason): void;
}

export const OVERLAY_HANDLE = new InjectionToken<OverlayHandle>('OVERLAY_HANDLE');
