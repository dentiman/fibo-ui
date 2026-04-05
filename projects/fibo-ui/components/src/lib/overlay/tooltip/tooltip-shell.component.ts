import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { type OverlayHandle, type OverlayShell, OverlayArrow, OverlayContainer, OverlayContent, OverlayPosition } from '@fibo-ui/cdk';
import { TooltipService } from './tooltip-service';

@Component({
  selector: 'fibo-overlay-tooltip-shell',
  imports: [OverlayContent, OverlayArrow],
  hostDirectives: [
    { directive: OverlayContainer, inputs: ['overlay'] },
    { directive: OverlayPosition, inputs: ['overlay'] },
  ],
  template: `
    <fibo-overlay-content [overlay]="overlay()" />
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
export class TooltipShellComponent implements OverlayShell {
  readonly overlay = input.required<OverlayHandle>();
  protected readonly tooltipService = inject(TooltipService);
}
