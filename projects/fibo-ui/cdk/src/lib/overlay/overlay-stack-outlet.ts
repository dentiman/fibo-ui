import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Type,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { OverlayStack } from './overlay-stack';
import { OVERLAY_BACKDROP_SHELL } from './overlay-shell-tokens';
import type { OverlayHandle } from './overlay-handle';

@Component({
  selector: 'fibo-overlay-stack-outlet',
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @for (overlay of overlayStack.openOverlayList(); track overlay.id) {
      @if (needsBackdrop(overlay) && backdropShell) {
        <ng-container [ngComponentOutlet]="backdropShell" [ngComponentOutletInputs]="{ handle: overlay }" />
      }
      <ng-container
        [ngComponentOutlet]="resolveShell(overlay)"
        [ngComponentOutletInputs]="{ handle: overlay }"
      />
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class OverlayStackOutlet {
  readonly overlayStack = inject(OverlayStack);
  private readonly injector = inject(Injector);
  readonly backdropShell = inject(OVERLAY_BACKDROP_SHELL, { optional: true });

  resolveShell(handle: OverlayHandle): Type<unknown> {
    return this.injector.get(handle.behavior.shell);
  }

  needsBackdrop(handle: OverlayHandle): boolean {
    return handle.behavior.needsBackdrop ?? false;
  }
}
