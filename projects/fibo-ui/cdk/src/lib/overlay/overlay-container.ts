import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OVERLAY_HANDLE, OverlayHandle } from './overlay-handle';
import { OverlayStack } from './overlay-stack';
import { Popover } from '../popover/popover';

// DOM container responsible for rendering the current overlay stack.
@Component({
  selector: 'fibo-cdk-overlay-container',
  imports: [CommonModule, Popover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './overlay-container.html',
  host: {
    '(document:keydown.escape)': 'overlayStack.closeTopmost()',
  },
  styles: `
    .overlay-leave {
      animation: overlay-fade-out 200ms ease-in forwards;
    }

    @keyframes overlay-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
})
export class OverlayContainerComponent {
  readonly overlayStack = inject(OverlayStack);
  private readonly parentInjector = inject(Injector);
  private readonly injectorCache = new Map<string, Injector>();

  constructor() {
    effect(() => {
      const activeOverlayIds = new Set(
        this.overlayStack.openOverlayList().map(overlay => overlay.id),
      );

      for (const id of this.injectorCache.keys()) {
        if (!activeOverlayIds.has(id)) {
          this.injectorCache.delete(id);
        }
      }
    });
  }

  overlayInjector(handle: OverlayHandle): Injector {
    let injector = this.injectorCache.get(handle.id);
    if (!injector) {
      injector = Injector.create({
        providers: [{ provide: OVERLAY_HANDLE, useValue: handle }],
        parent: this.parentInjector,
      });
      this.injectorCache.set(handle.id, injector);
    }

    return injector;
  }

  handleOverlayAnimationEnd(overlayId: string, event: AnimationEvent): void {
    if (event.target !== event.currentTarget || event.animationName !== 'overlay-fade-out') {
      return;
    }

    this.overlayStack.completeAfterClose(overlayId);
  }
}
