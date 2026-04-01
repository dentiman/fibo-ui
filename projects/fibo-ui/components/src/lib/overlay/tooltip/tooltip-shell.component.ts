import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { type OverlayHandle, OverlayArrow, OverlayContainer, OverlayPosition } from '@fibo-ui/cdk';
import { OverlayContent } from '../shell/overlay-content.component';
import { TooltipService } from './tooltip-service';

@Component({
  selector: 'fibo-overlay-tooltip-shell',
  imports: [OverlayContent, OverlayArrow],
  hostDirectives: [
    { directive: OverlayContainer, inputs: ['handle'] },
    { directive: OverlayPosition, inputs: ['handle'] },
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
    '(mouseenter)': 'tooltipService.keepOpen()',
    '(mouseleave)': 'tooltipService.close()',
  },
  styleUrl: './tooltip-shell.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TooltipShellComponent {
  readonly handle = input.required<OverlayHandle>();
  protected readonly tooltipService = inject(TooltipService);
}
