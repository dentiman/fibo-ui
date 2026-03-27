import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, Injector, ViewEncapsulation, inject } from '@angular/core';
import { OverlayHandle, OVERLAY_HANDLE } from './overlay-handle';
import { OverlayPanel } from './overlay-panel';

@Component({
  selector: 'fibo-overlay-modal-shell',
  imports: [CommonModule, NgTemplateOutlet, OverlayPanel],
  template: `
    <div class="overlay-modal-shell pointer-events-auto">
      <div class="overlay-modal-shell-backdrop"></div>

      <div fiboOverlayPanel class="overlay-modal-shell-panel">
        @if (handle.templateRef) {
          <ng-container *ngTemplateOutlet="handle.templateRef; injector: injector"></ng-container>
        }
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class OverlayModalShellComponent {
  readonly handle = inject<OverlayHandle>(OVERLAY_HANDLE);
  readonly injector = inject(Injector);
}
