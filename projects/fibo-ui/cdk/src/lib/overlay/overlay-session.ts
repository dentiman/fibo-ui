import { effect } from '@angular/core';
import type { EffectRef, Signal, TemplateRef } from '@angular/core';
import type { OverlayHandle } from './overlay-handle';
import type { OverlayCloseContext, OverlayCloseReason } from './overlay-types';

// Declarative render inputs for one overlay cycle.
export interface OverlayRenderConfig {
  templateRef?: TemplateRef<any>;
  referenceElement?: HTMLElement | null;
  interactionRoot?: HTMLElement | null;
  focusReturnTarget?: HTMLElement | null;
}

/**
 * Guard that can prevent an overlay from closing.
 * Return `false` to block the close, `true` (or void) to allow it.
 */
export type OverlayCloseGuard = (reason: OverlayCloseReason, event?: Event) => boolean | void;

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
  canClose: (guard: OverlayCloseGuard) => void;
  effect: (runner: Parameters<typeof effect>[0]) => EffectRef;
  onCleanup: (cleanup: () => void) => void;
}

export interface OverlayStackEntry {
  handle: OverlayHandle;
  reason: OverlayCloseReason;
  handlers: Array<(overlay: OverlayHandle, reason: OverlayCloseReason) => void>;
}

export type OverlayRenderConfigSignal = Signal<OverlayRenderConfig>;
