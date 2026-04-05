import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import type { OverlayHandle, OverlayShell } from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-overlay-backdrop-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '',
  host: {
    'class': 'fixed inset-0 pointer-events-auto bg-black/30 dark:bg-black/50',
    'style': 'z-index: 1000',
    '[attr.data-overlay-backdrop-id]': 'overlay().id',
    'animate.enter': 'overlay-backdrop-enter',
    'animate.leave': 'overlay-backdrop-leave',
  },
  styles: `
    .overlay-backdrop-enter {
      animation: overlay-backdrop-enter 160ms ease-out;
    }

    .overlay-backdrop-leave {
      animation: overlay-backdrop-leave 160ms ease-in forwards;
    }

    @keyframes overlay-backdrop-enter {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes overlay-backdrop-leave {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
})
export class OverlayBackdropShellComponent implements OverlayShell {
  readonly overlay = input.required<OverlayHandle>();
}
