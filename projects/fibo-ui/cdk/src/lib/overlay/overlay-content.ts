import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, ViewEncapsulation, input } from '@angular/core';
import { type OverlayHandle } from './overlay-handle';

/**
 * Primitive component that renders the content of an overlay.
 *
 * Reads `content()` from the given `OverlayHandle` and renders it as either
 * a plain string or a `TemplateRef`. The template context `$implicit` is the
 * handle itself, allowing content templates to access the overlay handle.
 *
 * Used by all shell components as the single content-rendering primitive.
 */
@Component({
  selector: 'fibo-overlay-content',
  imports: [NgTemplateOutlet],
  template: `
    @let content = overlay().content();
    @if (content) {
      @if (isString(content)) {
        {{ content }}
      } @else {
        <ng-container *ngTemplateOutlet="content; context: { $implicit: overlay() }"></ng-container>
      }
    }
  `,
  host: { style: 'display: contents;' },
  encapsulation: ViewEncapsulation.None,
})
export class OverlayContent {
  readonly overlay = input.required<OverlayHandle>();

  protected isString(content: TemplateRef<any> | string): content is string {
    return typeof content === 'string';
  }
}
