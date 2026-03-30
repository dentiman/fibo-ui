import { Component, input, ViewEncapsulation } from '@angular/core';
import { type OverlayHandle, OverlayArrow, OverlayContainer, OverlayPosition, OverlayShellHost } from '@fibo-ui/cdk';
import { OverlayContent } from '../shell/overlay-content.component';

@Component({
  selector: 'fibo-overlay-tooltip-shell',
  imports: [OverlayContent, OverlayArrow],
  hostDirectives: [
    { directive: OverlayShellHost, inputs: ['handle'] },
    { directive: OverlayPosition, inputs: ['handle'] },
    OverlayContainer,
  ],
  template: `
    <fibo-overlay-content [handle]="handle()" />
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
}
