import { Component, computed, effect, ElementRef, inject, input, TemplateRef, viewChild } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {PopoverArrow, PopoverPosition} from '@fibo-ui/cdk';
import {TooltipService} from './tooltip-service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'fibo-tooltip-container',
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    PopoverPosition,
    PopoverArrow,
    CommonModule
  ],
  templateUrl: './tooltip-container.html',
})
export class TooltipContainer {
  tooltipService = inject(TooltipService);

  content = computed(() =>
    typeof this.tooltipService.tooltipRef()?.content === 'string'
      ? (this.tooltipService.tooltipRef()?.content as string)
      : null
  );
  templateRef = computed(() =>
    this.tooltipService.tooltipRef()?.content instanceof TemplateRef
      ? (this.tooltipService.tooltipRef()?.content as TemplateRef<any>)
      : null
  );

}
