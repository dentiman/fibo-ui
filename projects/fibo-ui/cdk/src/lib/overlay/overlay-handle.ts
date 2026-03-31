import { InjectionToken } from '@angular/core';
import type { Signal, TemplateRef } from '@angular/core';
import type { OverlayCloseReason } from './overlay-types';
import type { OverlayBehaviorConfig, OverlayPositionConfig } from './overlay-config';

// Runtime object for one currently open overlay.
export interface OverlayHandle {
  readonly id: string;
  readonly behavior: OverlayBehaviorConfig;
  readonly position: Signal<OverlayPositionConfig>;
  readonly content: Signal<TemplateRef<any> | string | undefined>;
  readonly zIndex: number;
  readonly closed: boolean;
  close(reason?: OverlayCloseReason): void;
}

export const OVERLAY_HANDLE = new InjectionToken<OverlayHandle>('OVERLAY_HANDLE');
