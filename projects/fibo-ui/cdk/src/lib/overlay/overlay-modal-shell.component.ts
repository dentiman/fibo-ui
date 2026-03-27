import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, Injector, ViewEncapsulation, inject } from '@angular/core';
import { OverlayHandle, OVERLAY_HANDLE } from './overlay-handle';
import { OverlayStack } from './overlay-stack';
import { OverlayPanel } from './overlay-panel';

let scrollLockCount = 0;
let scrollLockSavedY = 0;
let scrollLockSavedX = 0;

function lockScroll(): void {
  scrollLockCount += 1;
  if (scrollLockCount > 1) {
    return;
  }

  scrollLockSavedY = window.scrollY;
  scrollLockSavedX = window.scrollX;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const html = document.documentElement;

  html.style.position = 'fixed';
  html.style.top = `-${scrollLockSavedY}px`;
  html.style.left = `-${scrollLockSavedX}px`;
  html.style.width = '100%';
  html.style.overflow = 'hidden';
  html.style.overscrollBehavior = 'none';
  document.body.style.touchAction = 'none';
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function unlockScroll(): void {
  if (scrollLockCount === 0) {
    return;
  }

  scrollLockCount -= 1;
  if (scrollLockCount > 0) {
    return;
  }

  const html = document.documentElement;
  html.style.position = '';
  html.style.top = '';
  html.style.left = '';
  html.style.width = '';
  html.style.overflow = '';
  html.style.overscrollBehavior = '';
  document.body.style.touchAction = '';
  document.body.style.paddingRight = '';
  window.scrollTo(scrollLockSavedX, scrollLockSavedY);
}

@Component({
  selector: 'fibo-overlay-modal-shell',
  imports: [CommonModule, NgTemplateOutlet, OverlayPanel],
  template: `
    <div
      class="overlay-modal-shell fixed inset-0 pointer-events-none"
      [attr.data-overlay-container-id]="handle.id"
      [style.z-index]="handle.zIndex"
      animate.enter="overlay-modal-enter"
      animate.leave="overlay-modal-leave"
      (animationend)="onAnimationEnd($event)"
    >
      <div
        class="overlay-modal-shell-backdrop fixed inset-0 pointer-events-auto bg-black/30 dark:bg-black/50"
        (click)="onBackdropClick($event)"
      ></div>

      <div class="fixed inset-0 flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          fiboOverlayPanel
          class="overlay-modal-shell-panel pointer-events-auto relative overflow-hidden rounded-lg bg-background px-4 pt-5 pb-4 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:outline dark:-outline-offset-1 dark:outline-white/8"
        >
        @if (handle.templateRef) {
          <ng-container *ngTemplateOutlet="handle.templateRef; injector: injector"></ng-container>
        }
        </div>
      </div>
    </div>
  `,
  host: {
    style: 'display: contents;',
  },
  styles: `
    .overlay-modal-enter {
      animation: overlay-modal-enter 160ms ease-out;
    }

    .overlay-modal-leave {
      animation: overlay-modal-leave 160ms ease-in forwards;
    }

    @keyframes overlay-modal-enter {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes overlay-modal-leave {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class OverlayModalShellComponent {
  readonly handle = inject<OverlayHandle>(OVERLAY_HANDLE);
  readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlayStack = inject(OverlayStack);

  constructor() {
    if (this.handle.strategy.kind === 'modal' && this.handle.strategy.options.blockScroll !== false) {
      lockScroll();
      this.destroyRef.onDestroy(() => unlockScroll());
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.handle.strategy.kind !== 'modal') {
      return;
    }

    if (!this.handle.strategy.options.backdropClosable) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.handle.close('backdrop');
  }

  onAnimationEnd(event: AnimationEvent): void {
    if (event.target !== event.currentTarget || event.animationName !== 'overlay-modal-leave') {
      return;
    }

    this.overlayStack.completeAfterClose(this.handle.id);
  }
}
