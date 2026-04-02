import { effect } from '@angular/core';
import type { EffectRef } from '@angular/core';
import type { OverlayHandle } from './overlay-handle';
import type { OverlayCloseContext, OverlayCloseReason } from './overlay-types';

/**
 * Guard that can prevent an overlay from closing.
 * Return `false` to block the close, `true` (or void) to allow it.
 */
export type OverlayCloseGuard = (reason: OverlayCloseReason, event?: Event) => boolean | void;

/**
 * Lifecycle API for one open overlay cycle.
 *
 * Passed to the `setup()` callback of `createOverlay()`.
 * Use it to register lifecycle hooks, focus policies, and close guards.
 * All registrations are scoped to the current open cycle and cleaned up on close.
 */
export interface OverlaySession {
  /** The handle for this open cycle. */
  handle: OverlayHandle;
  /** Explicitly request close (goes through guards). */
  requestClose: (reason: OverlayCloseReason, event?: Event) => void;
  /** Find which overlay container a DOM element belongs to (by `data-overlay-container-id`). */
  findOverlayContainerId: (target: EventTarget | null | undefined) => string | null;
  /** Check if a DOM element is inside this overlay or any of its child overlays. */
  isInOverlayBranch: (target: EventTarget | null | undefined) => boolean;
  /** Run after the overlay is rendered in DOM (next render cycle). */
  afterOpened: (handler: (overlay: OverlayHandle) => void) => void;
  /** Run after the overlay is fully closed and shell is destroyed. */
  afterClose: (handler: (overlay: OverlayHandle, reason: OverlayCloseReason) => void) => void;
  /** Run synchronously before close — DOM is still alive, `activeElement` is captured. */
  beforeClose: (
    handler: (
      ctx: OverlayCloseContext,
      overlay: OverlayHandle,
      reason: OverlayCloseReason,
    ) => void,
  ) => void;
  /** Register a guard that can block closing (return `false` to block). */
  canClose: (guard: OverlayCloseGuard) => void;
  /** Create an effect scoped to this cycle (auto-destroyed on close). */
  effect: (runner: Parameters<typeof effect>[0]) => EffectRef;
  /** Register a cleanup function (runs on close before DOM removal). */
  onCleanup: (cleanup: () => void) => void;
}

/** Internal entry for deferred afterClose handlers. */
export interface OverlayStackEntry {
  handle: OverlayHandle;
  reason: OverlayCloseReason;
  handlers: Array<(overlay: OverlayHandle, reason: OverlayCloseReason) => void>;
}
