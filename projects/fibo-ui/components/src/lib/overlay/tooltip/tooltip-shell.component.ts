import {
  Component,
  inject,
  Injector,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { type OverlayHandle, OverlayArrow, OverlayContainer, OverlayPosition, OverlayShellHost } from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-overlay-tooltip-shell',
  imports: [NgTemplateOutlet, OverlayArrow],
  hostDirectives: [
    { directive: OverlayShellHost, inputs: ['handle'] },
    { directive: OverlayPosition, inputs: ['handle'] },
    OverlayContainer,
  ],
  template: `
    @let content = handle().content;
    @if (content) {
      @if (isString(content)) {
        {{ content }}
      } @else {
        <ng-container *ngTemplateOutlet="asTemplateRef(content); injector: injector"></ng-container>
      }
    }
    <div fiboOverlayArrow class="fibo-overlay-arrow" aria-hidden="true"></div>
  `,
  host: {
    'class': 'tooltip-container',
    'role': 'tooltip',
    'animate.enter': 'tooltip-enter',
    'animate.leave': 'tooltip-leave',
  },
  styleUrl: './tooltip-shell.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TooltipShellComponent {
  readonly handle = input.required<OverlayHandle>();
  protected readonly injector = inject(Injector);

  protected isString(content: TemplateRef<any> | string): content is string {
    return typeof content === 'string';
  }

  protected asTemplateRef(content: TemplateRef<any> | string): TemplateRef<any> {
    return content as TemplateRef<any>;
  }
}
