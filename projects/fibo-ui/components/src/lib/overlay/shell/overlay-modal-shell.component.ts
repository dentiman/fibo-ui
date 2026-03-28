import { NgTemplateOutlet } from '@angular/common';
import { Component, Injector, ViewEncapsulation, inject, input } from '@angular/core';
import { type OverlayHandle, OverlayContainer, OverlayShellHost, OverlayPanel } from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-overlay-modal-shell',
  imports: [NgTemplateOutlet, OverlayContainer, OverlayPanel],
  hostDirectives: [
    {
      directive: OverlayShellHost,
      inputs: ['handle'],
    },
  ],
  template: `
    <div class="overlay-modal-shell-backdrop fixed inset-0 pointer-events-auto bg-black/30 dark:bg-black/50"></div>

    <div class="fixed inset-0 flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div
        fiboOverlayContainer
        class="overlay-modal-shell-panel pointer-events-auto relative overflow-hidden rounded-lg bg-background px-4 pt-5 pb-4 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:outline dark:-outline-offset-1 dark:outline-white/8"
      >
        @if (handle().templateRef) {
          <ng-container *ngTemplateOutlet="handle().templateRef; injector: injector"></ng-container>
        }
      </div>
    </div>
  `,
  host: {
    'class': 'fixed inset-0 pointer-events-none',
    'animate.enter': 'overlay-modal-enter',
    'animate.leave': 'overlay-modal-leave',
  },
  styles: `
    .overlay-modal-enter {
      animation: overlay-modal-enter 160ms ease-out;
    }

    .overlay-modal-leave {
      animation: overlay-modal-leave 160ms ease-in forwards;
    }

    @keyframes overlay-modal-enter {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes overlay-modal-leave {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    .overlay-modal-enter .overlay-modal-shell-panel {
      animation: overlay-modal-panel-enter 160ms ease-out;
    }

    .overlay-modal-leave .overlay-modal-shell-panel {
      animation: overlay-modal-panel-leave 160ms ease-in forwards;
    }

    @keyframes overlay-modal-panel-enter {
      from { transform: scale(0.95) translateY(8px); }
      to { transform: scale(1) translateY(0); }
    }

    @keyframes overlay-modal-panel-leave {
      from { transform: scale(1) translateY(0); }
      to { transform: scale(0.95) translateY(8px); }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class OverlayModalShellComponent {
  readonly handle = input.required<OverlayHandle>();
  readonly injector = inject(Injector);
}
