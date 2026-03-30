import {Directive, ElementRef, inject, input, TemplateRef} from '@angular/core';
import {TooltipService} from './tooltip-service';
import {Placement} from '@floating-ui/dom';

let nextId = 0;

@Directive({
  selector: '[fiboTooltip]',
  host: {
    '(mouseenter)': 'open()',
    '(mouseleave)': 'close()',
    '(focusin)': 'open()',
    '(focusout)': 'close()',
    '[attr.aria-describedby]': 'tooltipId',
  },
})
export class Tooltip {
  private element = inject(ElementRef).nativeElement;
  private tooltipService = inject(TooltipService);

  readonly tooltipId = `fibo-tooltip-${nextId++}`;

  content = input.required<string | TemplateRef<any>>({alias: 'fiboTooltip'});
  placement = input<Placement>('top');

  open() {
    this.tooltipService.open(this.content(), this.element, this.placement());
  }

  close() {
    this.tooltipService.close();
  }
}
