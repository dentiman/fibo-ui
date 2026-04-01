import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, ViewEncapsulation, input } from '@angular/core';
import { type OverlayHandle } from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-overlay-content',
  imports: [NgTemplateOutlet],
  template: `
    @let content = handle().content();
    @if (content) {
      @if (isString(content)) {
        {{ content }}
      } @else {
        <ng-container *ngTemplateOutlet="content; context: { $implicit: close }"></ng-container>
      }
    }
  `,
  host: { style: 'display: contents;' },
  encapsulation: ViewEncapsulation.None,
})
export class OverlayContent {
  readonly handle = input.required<OverlayHandle>();

  protected readonly close = () => this.handle().close();

  protected isString(content: TemplateRef<any> | string): content is string {
    return typeof content === 'string';
  }
}
