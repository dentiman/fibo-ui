import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  Type,
  ViewEncapsulation,
  effect,
  inject,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { OverlayStack } from './overlay-stack';
import { OVERLAY_BACKDROP_SHELL } from './overlay-shell-tokens';
import type { OverlayHandle } from './overlay-handle';

@Component({
  selector: 'fibo-overlay-stack-outlet',
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @for (overlay of overlayStack.openOverlayList(); track overlay.id) {
      @if (needsBackdrop(overlay) && backdropShell) {
        <ng-container [ngComponentOutlet]="backdropShell" [ngComponentOutletInputs]="{ overlay: overlay }" />
      }
      <ng-container
        [ngComponentOutlet]="resolveShell(overlay)"
        [ngComponentOutletInputs]="{ overlay: overlay }"
      />
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class OverlayStackOutlet {
  readonly overlayStack = inject(OverlayStack);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  readonly backdropShell = inject(OVERLAY_BACKDROP_SHELL, { optional: true });

  constructor() {
    this.setupOutsideClickDispatcher();
  }

  resolveShell(overlay: OverlayHandle): Type<unknown> {
    return this.injector.get(overlay.behavior.shell);
  }

  needsBackdrop(overlay: OverlayHandle): boolean {
    return overlay.behavior.needsBackdrop ?? false;
  }

  private setupOutsideClickDispatcher(): void {
    let attached = false;

    const handler = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const overlays = this.overlayStack.openOverlayList();
      for (let i = overlays.length - 1; i >= 0; i--) {
        const overlay = overlays[i];

        // Click is inside this overlay's content or its reference element — stop
        if (this.isInsideOverlay(overlay, target)) break;

        if (overlay.behavior.closeOnOutsideClick) {
          overlay.close('outside-click');
        }

        // Click was on this overlay's own backdrop — stop propagating to parents
        if (this.isOnOwnBackdrop(overlay, target)) break;
      }
    };

    // Attach/detach the global click listener based on whether overlays are open.
    effect(() => {
      const hasOverlays = this.overlayStack.openOverlayList().length > 0;
      if (hasOverlays && !attached) {
        document.addEventListener('click', handler, true);
        attached = true;
      } else if (!hasOverlays && attached) {
        document.removeEventListener('click', handler, true);
        attached = false;
      }
    });

    this.destroyRef.onDestroy(() => {
      if (attached) {
        document.removeEventListener('click', handler, true);
        attached = false;
      }
    });
  }

  private isInsideOverlay(overlay: OverlayHandle, target: Node): boolean {
    const pos = overlay.position();
    if (pos.type === 'connected' && pos.referenceElement?.contains(target)) return true;
    return overlay.hostElement()?.contains(target) ?? false;
  }

  private isOnOwnBackdrop(overlay: OverlayHandle, target: Node): boolean {
    const element = target instanceof Element ? target : (target as Node).parentElement;
    return element?.closest(`[data-overlay-backdrop-id="${overlay.id}"]`) != null;
  }
}
