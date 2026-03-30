import { Component, ViewEncapsulation, input } from '@angular/core';
import { type OverlayHandle, OverlayContainer, OverlayPanel, OverlayShellHost } from '@fibo-ui/cdk';
import { OverlayContent } from './overlay-content.component';

@Component({
  selector: 'fibo-overlay-drawer-shell',
  imports: [OverlayContent],
  hostDirectives: [
    { directive: OverlayShellHost, inputs: ['handle'] },
    OverlayContainer,
    OverlayPanel,
  ],
  template: `<fibo-overlay-content [handle]="handle()" />`,
  host: {
    'class':
      'fixed inset-y-0 right-0 pointer-events-auto w-full max-w-md overflow-y-auto bg-background shadow-xl focus:outline-none dark:outline dark:-outline-offset-1 dark:outline-white/8',
    'animate.enter': 'overlay-drawer-enter',
    'animate.leave': 'overlay-drawer-leave',
  },
  styles: `
    .overlay-drawer-enter {
      animation: overlay-drawer-enter 200ms ease-out;
    }

    .overlay-drawer-leave {
      animation: overlay-drawer-leave 150ms ease-in forwards;
    }

    @keyframes overlay-drawer-enter {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    @keyframes overlay-drawer-leave {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class OverlayDrawerShellComponent {
  readonly handle = input.required<OverlayHandle>();
}
