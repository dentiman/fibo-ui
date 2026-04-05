import { computed, signal } from '@angular/core';
import type { Signal, TemplateRef, WritableSignal } from '@angular/core';
import type { OverlayHandle } from './overlay-handle';
import type { OverlaySession } from './overlay-session';
import type { OverlayBehaviorConfig, OverlayPositionConfig } from './overlay-config';
import { createOverlay } from './overlay-stack';

export interface SingletonOverlay {
  /** Bind to the `<ng-template>` in the host component via `viewChild`. */
  readonly templateRef: WritableSignal<TemplateRef<any> | null>;
  /** Source of truth for open/closed state. */
  readonly isOpen: WritableSignal<boolean>;
  /** Current overlay handle, or `null` when closed. */
  readonly handle: Signal<OverlayHandle | null>;
}

/**
 * Reduces the `templateRef / isOpen / createOverlay` boilerplate
 * common to service-driven overlays (ConfirmationService, Notifier, etc.).
 *
 * Content is derived from `templateRef` — open is deferred until the template
 * is available. Position and behavior are provided by the caller.
 *
 * Must be called in an injection context (field initializer or constructor).
 *
 * @example
 * readonly overlay = createSingletonOverlay(
 *   dialogBehavior(),
 *   signal({ type: 'global' }),
 *   session => {
 *     trapOverlayFocus(session, { guard: true });
 *     restoreTriggerFocusOnClose(session, () => this.config()?.referenceElement ?? null);
 *   },
 * );
 */
export function createSingletonOverlay(
  behavior: OverlayBehaviorConfig,
  position: Signal<OverlayPositionConfig>,
  setup?: (session: OverlaySession) => void,
): SingletonOverlay {
  const templateRef = signal<TemplateRef<any> | null>(null);
  const isOpen = signal(false);
  const content = computed(() => templateRef() ?? null);
  const overlay = createOverlay(isOpen, behavior, position, content, setup);
  return { templateRef, isOpen, handle: overlay };
}
