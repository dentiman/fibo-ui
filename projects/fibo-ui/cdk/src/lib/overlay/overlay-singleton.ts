import { computed, signal } from '@angular/core';
import type { Signal, TemplateRef, WritableSignal } from '@angular/core';
import type { OverlayConfig } from './overlay-config';
import type { OverlayHandle } from './overlay-handle';
import type { OverlaySession } from './overlay-session';
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
 * Reduces the `containerTemplateRef / isOpen / overlayConfig / createOverlay` boilerplate
 * common to service-driven overlays (ConfirmationService, TooltipService, Notifier, etc.).
 *
 * `configFn` runs inside a `computed` — it can read other signals reactively.
 * Return `null` to defer opening until required data is available.
 *
 * Must be called in an injection context (field initializer or constructor).
 *
 * @example
 * readonly overlay = createSingletonOverlay(templateRef =>
 *   dialogConfig({ templateRef, referenceElement: this.config()?.referenceElement ?? null }),
 *   session => { session.afterClose(() => this.cleanup()); },
 * );
 */
export function createSingletonOverlay(
  configFn: (templateRef: TemplateRef<any>) => OverlayConfig | null,
  setup?: (session: OverlaySession) => void,
): SingletonOverlay {
  const templateRef = signal<TemplateRef<any> | null>(null);
  const isOpen = signal(false);
  const overlayConfig = computed(() => {
    const tpl = templateRef();
    if (!tpl) return null;
    return configFn(tpl);
  });
  const handle = createOverlay(isOpen, overlayConfig, setup);
  return { templateRef, isOpen, handle };
}
