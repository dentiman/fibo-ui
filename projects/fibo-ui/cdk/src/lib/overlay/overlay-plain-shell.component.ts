import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, Injector, ViewEncapsulation, inject } from '@angular/core';
import { OverlayHandle, OVERLAY_HANDLE } from './overlay-handle';

@Component({
  selector: 'fibo-overlay-plain-shell',
  imports: [CommonModule, NgTemplateOutlet],
  template: `
    @if (handle.templateRef) {
      <ng-container *ngTemplateOutlet="handle.templateRef; injector: injector"></ng-container>
    }
  `,
  host: {
    class: 'pointer-events-auto',
  },
  encapsulation: ViewEncapsulation.None,
})
export class OverlayPlainShellComponent {
  readonly handle = inject<OverlayHandle>(OVERLAY_HANDLE);
  readonly injector = inject(Injector);
}
