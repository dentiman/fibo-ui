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
    if (!position) return {};

    const side = position.placement.split("-")[0];
    const staticSide = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right"
    }[side];

    const arrowPosition = position.middlewareData.arrow;
    if (!arrowPosition) return {};

    // Get arrow element dimensions
    const arrowElement = this.elementRef.nativeElement;
    const arrowSize = arrowElement.offsetWidth || 0;

    const styles: Record<string, string> = {
      left: arrowPosition.x != null && arrowPosition.centerOffset === 0 ? `${arrowPosition.x}px` : "",
      top: arrowPosition.y != null && arrowPosition.centerOffset === 0 ? `${arrowPosition.y}px` : "",
    };

    if (staticSide) {
      styles[staticSide] = `${-arrowSize / 2}px`;
    }

    return styles;
  });

}
