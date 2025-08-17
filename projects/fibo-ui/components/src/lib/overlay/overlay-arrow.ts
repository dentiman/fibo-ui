import {computed, Directive, effect, ElementRef, inject, model,} from '@angular/core';
import {OverlayPosition} from "./overlay-position";

@Directive({
  selector: '[OverlayArrow]',
  standalone: true,
  host: {
    '[attr.data-placement]' : 'placement()',
    '[style]': 'style()',
  }
})
export class OverlayArrow {
  elementRef = inject(ElementRef<HTMLElement>);

  overlayPosition = inject(OverlayPosition).position;

  placement = computed(() => { return this.overlayPosition()?.placement.split("-")[0] });

  style = computed(() => {
    const position = this.overlayPosition();
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
