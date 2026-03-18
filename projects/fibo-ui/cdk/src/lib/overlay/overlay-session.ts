import { EffectRef, Signal, TemplateRef, effect } from '@angular/core';
import { OverlayCategory, OverlayHandle } from './overlay-handle';

// Close-time interaction state passed into lifecycle hooks.
export interface OverlayCloseContext {
  activeElement: HTMLElement | null;
}

// Declarative render inputs for one overlay cycle.
export interface OverlayRenderConfig {
  templateRef?: TemplateRef<any>;
  referenceElement?: HTMLElement | null;
  category: OverlayCategory;
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

// Lifecycle API exposed to behavior policies for one open cycle.
export interface OverlaySession {
  handle: OverlayHandle;
  requestClose: (reason: OverlayCloseReason, event?: Event) => void;
  findOverlayContainerId: (target: EventTarget | null | undefined) => string | null;
  isInOverlayBranch: (target: EventTarget | null | undefined) => boolean;
  afterOpened: (handler: (overlay: OverlayHandle) => void) => void;
  afterClose: (handler: (overlay: OverlayHandle, reason: OverlayCloseReason) => void) => void;
  beforeClose: (
    handler: (
      ctx: OverlayCloseContext,
      overlay: OverlayHandle,
      reason: OverlayCloseReason,
    ) => void,
  ) => void;
  effect: (runner: Parameters<typeof effect>[0]) => EffectRef;
  onCleanup: (cleanup: () => void) => void;
}

export interface OverlayStackEntry {
  handle: OverlayHandle;
  reason: OverlayCloseReason;
  handlers: Array<(overlay: OverlayHandle, reason: OverlayCloseReason) => void>;
}

export type OverlayRenderConfigSignal = Signal<OverlayRenderConfig>;
