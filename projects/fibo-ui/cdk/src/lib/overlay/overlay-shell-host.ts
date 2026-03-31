import { DestroyRef, Directive, inject, input } from '@angular/core';
import { OverlayHandle, OVERLAY_HANDLE } from './overlay-handle';
import { OverlayStack } from './overlay-stack';

/**
 * Shared host directive for all overlay shell components.
 *
 * Responsibilities:
 * - Accepts the `OverlayHandle` as input
 * - Provides `OVERLAY_HANDLE` via DI (resolves to the input value)
 * - Calls `completeAfterClose` when the shell is destroyed
 */
@Directive({
  selector: '[overlayShellHost]',
  providers: [
    {
      provide: OVERLAY_HANDLE,
      useFactory: () => inject(OverlayShellHost).handle(),
    },
  ],
  host: {
    'style': 'z-index: 1000',
  },
})
export class OverlayShellHost {
  readonly handle = input.required<OverlayHandle>();
  private readonly overlayStack = inject(OverlayStack);

  constructor() {
    inject(DestroyRef).onDestroy(() =>
      this.overlayStack.completeAfterClose(this.handle().id),
    );
  }
}
