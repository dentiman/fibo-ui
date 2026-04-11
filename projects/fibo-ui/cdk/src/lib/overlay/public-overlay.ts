import { type Signal, inject } from '@angular/core';
import type { OverlayHandle } from './overlay-handle';
import type { PublicOverlayConfig } from './overlay-public-config';
import { OverlayStack } from './overlay-stack';

export * from './overlay-public-config';

// ─── Публічний API ─────────────────────────────────────────

export function createOverlay(
  factory: () => PublicOverlayConfig,
): Signal<OverlayHandle | null> {
  return inject(OverlayStack).createOverlay(factory);
}
