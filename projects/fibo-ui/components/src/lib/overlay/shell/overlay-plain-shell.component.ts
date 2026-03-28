import { NgTemplateOutlet } from '@angular/common';
import { Component, Injector, ViewEncapsulation, inject, input } from '@angular/core';
import { type OverlayHandle, OverlayContainer, OverlayShellHost } from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-overlay-plain-shell',
  imports: [NgTemplateOutlet],
  hostDirectives: [
    {
      directive: OverlayShellHost,
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
    'style': 'display: contents;',
  },
  encapsulation: ViewEncapsulation.None,
})
export class OverlayPlainShellComponent {
  readonly handle = input.required<OverlayHandle>();
  readonly injector = inject(Injector);
}
