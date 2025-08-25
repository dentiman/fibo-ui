import {computed, Directive, effect, ElementRef, inject, model,} from '@angular/core';
import {PopoverPosition} from "./popover-position";

@Directive({
  selector: '[PopoverArrow]',
  standalone: true,
  host: {
    '[attr.data-placement]' : 'placement()',
    '[style]': 'style()',
  }
})
export class PopoverArrow {
  elementRef = inject(ElementRef<HTMLElement>);

  popoverPosition = inject(PopoverPosition).position;

  placement = computed(() => { return this.popoverPosition()?.placement.split("-")[0] });

  style = computed(() => {
    const position = this.popoverPosition();
    if(!position) return {};
      const side = position.placement.split("-")[0];
      const staticSide = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
      }[side];

      const arrowPosition = position.middlewareData.arrow;
      if(!arrowPosition) return {};


    return {
        left: arrowPosition.x != null ? `${arrowPosition.x}px` : "",
        top: arrowPosition.y != null ? `${arrowPosition.y}px` : "",
      // @ts-ignore
        [staticSide]: `${-( this.elementRef.nativeElement.offsetWidth/2+1) }px`,
      }
    });

}
