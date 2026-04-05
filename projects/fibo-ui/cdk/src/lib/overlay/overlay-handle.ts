import { InjectionToken, WritableSignal } from '@angular/core';
import type { InputSignal, Signal, TemplateRef } from '@angular/core';
import type { OverlayCloseReason } from './overlay-types';
import type { OverlayBehaviorConfig, OverlayPositionConfig } from './overlay-config';

/**
 * Public runtime object representing one open overlay.
 *
 * Created by `OverlayStack` when an overlay opens, destroyed when it closes.
 * Passed as input to shell components and available via `OVERLAY_HANDLE` DI token.
 *
 * Consumers use `close()` to request closing; the actual close is
 * gated by guards registered through `OverlaySession.canClose()`.
 */
export interface OverlayHandle {
  /** Unique identifier, also used as `data-overlay-container-id` in DOM. */
  readonly id: string;
  /** Behavior policy: which shell, which close triggers, backdrop, etc. */
  readonly behavior: OverlayBehaviorConfig;
  /** Reactive position config — can change dynamically (e.g. reference element swap). */
  readonly position: Signal<OverlayPositionConfig>;
  /** Reactive content — TemplateRef, string, or undefined while loading. */
  readonly content: Signal<TemplateRef<any> | string | undefined>;
  /** Shell host element in DOM. Set by `OverlayContainer` on init, `null` before render. */
  readonly hostElement: WritableSignal<HTMLElement | null>;
  /** Request to close this overlay. No-op if already closed or blocked by a guard. */
  close(reason?: OverlayCloseReason): void;
}

/** DI token to inject the current overlay's handle from within shell content. */
export const OVERLAY_HANDLE = new InjectionToken<OverlayHandle>('OVERLAY_HANDLE');

/**
 * Contract that every overlay shell component must satisfy.
 *
 * `OverlayStackOutlet` renders shell components dynamically via `NgComponentOutlet`
 * and passes a single input `overlay` of type `OverlayHandle`.
 * Any custom shell component registered via shell tokens must implement this interface.
 *
 * @example
 * ```ts
 * export class MyCustomShellComponent implements OverlayShell {
 *   readonly overlay = input.required<OverlayHandle>();
 * }
 * ```
 */
export interface OverlayShell {
  readonly overlay: InputSignal<OverlayHandle>;
}
