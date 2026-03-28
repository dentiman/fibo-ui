import { NgTemplateOutlet } from '@angular/common';
import { Component, Injector, ViewEncapsulation, inject, input } from '@angular/core';
import { type OverlayHandle, OverlayContainer, OverlayShellHost, OverlayPosition } from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-overlay-connected-shell',
  imports: [NgTemplateOutlet],
  hostDirectives: [
    {
      directive: OverlayShellHost,
      inputs: ['handle'],
    },
    {
      directive: OverlayPosition,
      inputs: ['handle'],
    },
    OverlayContainer,
  ],
  template: `
    @if (handle().templateRef) {
      <ng-container *ngTemplateOutlet="handle().templateRef; injector: injector"></ng-container>
    }
  `,
  host: {
    'class': 'popover-container',
    'animate.enter': 'overlay-connected-enter',
    'animate.leave': 'overlay-connected-leave',
  },
  styles: `
    .overlay-connected-enter {
      animation: overlay-connected-enter 120ms ease-out;
    }

    .overlay-connected-leave {
      animation: overlay-connected-leave 120ms ease-in forwards;
    }

    @keyframes overlay-connected-enter {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes overlay-connected-leave {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.98); }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class OverlayConnectedShellComponent {
  readonly handle = input.required<OverlayHandle>();
  readonly injector = inject(Injector);
}
