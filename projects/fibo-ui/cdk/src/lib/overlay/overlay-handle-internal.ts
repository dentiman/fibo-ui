import { TemplateRef, signal } from '@angular/core';
import type { Signal } from '@angular/core';
import type { OverlayCloseReason } from './overlay-types';
import type { OverlayHandle } from './overlay-handle';
import type { OverlayBehaviorConfig, OverlayPositionConfig } from './overlay-config';

let nextOverlayId = 1;

export function createOverlayHandle(
  behavior: OverlayBehaviorConfig,
  position: Signal<OverlayPositionConfig>,
  content: Signal<TemplateRef<any> | string | undefined>,
  requestClose: (reason: OverlayCloseReason) => void,
): OverlayHandle {
  return {
    id: `overlay-${nextOverlayId++}`,
    behavior,
    position,
    content,
    hostElement: signal<HTMLElement | null>(null),
    close(reason?: OverlayCloseReason) {
      requestClose(reason ?? 'programmatic');
    },
  };
}
