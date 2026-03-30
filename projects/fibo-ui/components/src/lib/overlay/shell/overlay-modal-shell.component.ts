import { Component, ViewEncapsulation, input } from '@angular/core';
import { type OverlayHandle, OverlayContainer, OverlayPanel, OverlayShellHost } from '@fibo-ui/cdk';
import { OverlayContent } from './overlay-content.component';

@Component({
  selector: 'fibo-overlay-modal-shell',
  imports: [OverlayContent],
  hostDirectives: [
    { directive: OverlayShellHost, inputs: ['handle'] },
    OverlayContainer,
    OverlayPanel,
  ],
  template: `<fibo-overlay-content [handle]="handle()" />`,
  host: {
    'class':
      'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto w-[calc(100%-2rem)] overflow-hidden rounded-lg bg-background px-4 pt-5 pb-4 text-left shadow-xl sm:max-w-lg sm:p-6 dark:outline dark:-outline-offset-1 dark:outline-white/8',
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
      from { opacity: 0; scale: 0.95; }
      to { opacity: 1; scale: 1; }
    }

    @keyframes overlay-modal-leave {
      from { opacity: 1; scale: 1; }
      to { opacity: 0; scale: 0.95; }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class OverlayModalShellComponent {
  readonly handle = input.required<OverlayHandle>();
}
