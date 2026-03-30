import { InjectionToken } from '@angular/core';
import type { TemplateRef } from '@angular/core';
import type { OverlayCloseReason } from './overlay-types';
import type { OverlayConfig } from './overlay-config';

// Runtime object for one currently open overlay.
export interface OverlayHandle {
  readonly id: string;
  readonly config: OverlayConfig;
  readonly zIndex: number;
  readonly content: TemplateRef<any> | string | undefined;
  readonly referenceElement: HTMLElement | null | undefined;
  readonly focusReturnTarget: HTMLElement | null | undefined;
  readonly closed: boolean;
  close(reason?: OverlayCloseReason): void;
}

export const OVERLAY_HANDLE = new InjectionToken<OverlayHandle>('OVERLAY_HANDLE');
