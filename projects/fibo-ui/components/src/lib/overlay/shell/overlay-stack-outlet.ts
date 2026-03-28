import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { OverlayStack } from '@fibo-ui/cdk';
import { OverlayConnectedShellComponent } from './overlay-connected-shell.component';
import { OverlayModalShellComponent } from './overlay-modal-shell.component';
import { OverlayPlainShellComponent } from './overlay-plain-shell.component';

@Component({
  selector: 'fibo-overlay-stack-outlet',
  imports: [OverlayConnectedShellComponent, OverlayModalShellComponent, OverlayPlainShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './overlay-stack-outlet.html',
  host: {
    '(document:keydown.escape)': 'overlayStack.closeTopmost()',
  },
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class OverlayStackOutlet {
  readonly overlayStack = inject(OverlayStack);
}
