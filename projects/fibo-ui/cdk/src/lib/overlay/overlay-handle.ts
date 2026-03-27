import { InjectionToken } from '@angular/core';
import type { Signal, TemplateRef } from '@angular/core';
import type { OverlayCloseReason } from './overlay-types';
import type { OverlayStrategy } from './overlay-strategy';

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
  readonly interactionRoot: HTMLElement | null | undefined;
  readonly focusReturnTarget: HTMLElement | null | undefined;
  readonly strategy: OverlayStrategy;
  readonly closed: boolean;
  close(reason?: OverlayCloseReason): void;
}

export const OVERLAY_HANDLE = new InjectionToken<OverlayHandle>('OVERLAY_HANDLE');
