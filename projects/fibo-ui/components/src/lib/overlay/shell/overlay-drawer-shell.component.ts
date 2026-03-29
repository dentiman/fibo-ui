import { NgTemplateOutlet } from '@angular/common';
import { Component, Injector, ViewEncapsulation, inject, input } from '@angular/core';
import { type OverlayHandle, OverlayContainer, OverlayPanel, OverlayShellHost } from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-overlay-drawer-shell',
  imports: [NgTemplateOutlet, OverlayContainer, OverlayPanel],
  hostDirectives: [
    {
      directive: OverlayShellHost,
      inputs: ['handle'],
    },
  ],
  template: `
    <div
      fiboOverlayContainer
      fiboOverlayPanel
      class="overlay-drawer-shell-panel pointer-events-auto w-screen max-w-md overflow-y-auto bg-background shadow-xl focus:outline-none dark:outline dark:-outline-offset-1 dark:outline-white/8"
    >
      @if (handle().templateRef) {
        <ng-container *ngTemplateOutlet="handle().templateRef; injector: injector"></ng-container>
      }
    </div>
  `,
  host: {
    'class': 'fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none',
    'animate.enter': 'overlay-drawer-enter',
    'animate.leave': 'overlay-drawer-leave',
  },
  styles: `
    .overlay-drawer-enter {
      animation: overlay-drawer-host-enter 200ms ease-out;
    }

    .overlay-drawer-leave {
      animation: overlay-drawer-host-leave 150ms ease-in forwards;
    }

    .overlay-drawer-enter .overlay-drawer-shell-panel {
      animation: overlay-drawer-slide-in 200ms ease-out;
    }

    .overlay-drawer-leave .overlay-drawer-shell-panel {
      animation: overlay-drawer-slide-out 150ms ease-in forwards;
    }

    @keyframes overlay-drawer-host-enter {
      from { opacity: 1; }
      to { opacity: 1; }
    }

    @keyframes overlay-drawer-host-leave {
      from { opacity: 1; }
      to { opacity: 1; }
    }

    @keyframes overlay-drawer-slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    @keyframes overlay-drawer-slide-out {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class OverlayDrawerShellComponent {
  readonly handle = input.required<OverlayHandle>();
  readonly injector = inject(Injector);
}
