import {Directive, ElementRef, inject, input, TemplateRef} from '@angular/core';
import {TooltipService} from './tooltip-service';
import {Placement} from '@floating-ui/dom';


@Directive({
  selector: '[fiboTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'open()',
    '(mouseleave)': 'close()',
  },
})
export class Tooltip {

  element = inject(ElementRef).nativeElement;

  tooltipService = inject(TooltipService)

  content = input.required<string | TemplateRef<any>>({ alias: 'fiboTooltip' });

  placement = input<Placement>('top');

  open() {
   this.tooltipService.open(this.content(), this.element,this.placement())
  }

  close() {
    this.tooltipService.close()
  }
}
