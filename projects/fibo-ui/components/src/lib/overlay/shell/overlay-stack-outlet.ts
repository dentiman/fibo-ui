import {
  ChangeDetectionStrategy,
  Component,
  Type,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { OverlayStack } from '@fibo-ui/cdk';
import type { OverlayStrategyKind } from '@fibo-ui/cdk';
import { OverlayBackdropShellComponent } from './overlay-backdrop-shell.component';
import { OverlayConnectedShellComponent } from './overlay-connected-shell.component';
import { OverlayDrawerShellComponent } from './overlay-drawer-shell.component';
import { OverlayModalShellComponent } from './overlay-modal-shell.component';
import { OverlayPlainShellComponent } from './overlay-plain-shell.component';

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

  // TEMP: backdrop decision is keyed by strategy kinds (modal/drawer) for now.
  // This condition will be revisited when category model is refactored.
  needsBackdropShell(kind: OverlayStrategyKind): boolean {
    return kind === 'modal' || kind === 'drawer';
  }

  resolveShell(kind: OverlayStrategyKind): Type<unknown> {
    switch (kind) {
      case 'modal':
        return OverlayModalShellComponent;
      case 'drawer':
        return OverlayDrawerShellComponent;
      case 'connected':
      case 'menu':
      case 'tooltip':
        return OverlayConnectedShellComponent;
      default:
        return OverlayPlainShellComponent;
    }
  }
}
