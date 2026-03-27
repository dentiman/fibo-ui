import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, Injector, ViewEncapsulation, computed, inject } from '@angular/core';
import { OverlayHandle, OVERLAY_HANDLE } from './overlay-handle';
import { OverlayStack } from './overlay-stack';
import { Popover } from '../popover/popover';

@Component({
  selector: 'fibo-overlay-connected-shell',
  imports: [CommonModule, NgTemplateOutlet, Popover],
  template: `
    <div
      fiboPopover
      class="overlay-connected-shell popover-container pointer-events-auto"
      [attr.data-overlay-container-id]="handle.id"
      [style.z-index]="handle.zIndex"
      [referenceElement]="referenceElement()"
      [placement]="placement()"
      [matchWidth]="matchWidth()"
      [offset]="offset()"
      animate.enter="overlay-connected-enter"
      animate.leave="overlay-connected-leave"
      (animationend)="onAnimationEnd($event)"
    >
      @if (handle.templateRef) {
        <ng-container *ngTemplateOutlet="handle.templateRef; injector: injector"></ng-container>
      }
    </div>
  `,
  host: {
    style: 'display: contents;',
  },
  styles: `
    .overlay-connected-enter {
      animation: overlay-connected-enter 120ms ease-out;
    }

    .overlay-connected-leave {
      animation: overlay-connected-leave 120ms ease-in forwards;
    }

    @keyframes overlay-connected-enter {
      from {
        opacity: 0;
        transform: scale(0.98);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes overlay-connected-leave {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.98);
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class OverlayConnectedShellComponent {
  readonly handle = inject<OverlayHandle>(OVERLAY_HANDLE);
  readonly injector = inject(Injector);
  private readonly overlayStack = inject(OverlayStack);

  readonly referenceElement = computed(() => this.handle.referenceElement ?? undefined);
  readonly placement = computed(() => {
    switch (this.handle.strategy.kind) {
      case 'connected':
      case 'menu':
        return this.handle.strategy.options.placement ?? (this.handle.strategy.kind === 'menu' ? 'right-start' : 'bottom');
      case 'tooltip':
        return this.handle.strategy.options.placement ?? 'top';
      default:
        return 'bottom';
    }
  });
  readonly matchWidth = computed(() =>
    this.handle.strategy.kind === 'connected' ? this.handle.strategy.options.matchWidth ?? false : false,
  );
  readonly offset = computed(() => {
    switch (this.handle.strategy.kind) {
      case 'connected':
      case 'menu':
        return this.handle.strategy.options.offset ?? (this.handle.strategy.kind === 'menu' ? 1 : 5);
      case 'tooltip':
        return 5;
      default:
        return 5;
    }
  });

  onAnimationEnd(event: AnimationEvent): void {
    if (event.target !== event.currentTarget || event.animationName !== 'overlay-connected-leave') {
      return;
    }

    this.overlayStack.completeAfterClose(this.handle.id);
  }
}
