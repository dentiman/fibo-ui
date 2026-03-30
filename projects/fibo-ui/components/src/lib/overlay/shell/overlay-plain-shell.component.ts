import { NgTemplateOutlet } from '@angular/common';
import { Component, Injector, TemplateRef, ViewEncapsulation, inject, input } from '@angular/core';
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
    @let content = handle().content;
    @if (content) {
      @if (isString(content)) {
        {{ content }}
      } @else {
        <ng-container *ngTemplateOutlet="$any(content); injector: injector"></ng-container>
      }
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

  protected isString(content: TemplateRef<any> | string): content is string {
    return typeof content === 'string';
  }
}
