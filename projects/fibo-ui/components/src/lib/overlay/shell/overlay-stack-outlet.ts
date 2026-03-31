import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Type,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { type OverlayHandle, OverlayStack } from '@fibo-ui/cdk';
import { OverlayBackdropShellComponent } from './overlay-backdrop-shell.component';

@Component({
  selector: 'fibo-overlay-stack-outlet',
  imports: [NgComponentOutlet, OverlayBackdropShellComponent],
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
  private readonly injector = inject(Injector);

  resolveShell(handle: OverlayHandle): Type<unknown> {
    return this.injector.get(handle.behavior.shell);
  }

  needsBackdrop(handle: OverlayHandle): boolean {
    return handle.behavior.needsBackdrop ?? false;
  }
}
