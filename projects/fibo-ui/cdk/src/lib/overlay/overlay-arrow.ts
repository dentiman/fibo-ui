import { computed, DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { OverlayPosition } from './overlay-position';

@Directive({
  selector: '[fiboOverlayArrow]',
  host: {
    '[attr.data-placement]': 'placement()',
    '[style]': 'style()',
  },
})
export class OverlayArrow {
  readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlayPosition = inject(OverlayPosition);

  readonly placement = computed(() => this.overlayPosition.position()?.placement.split('-')[0]);

  readonly style = computed(() => {
    const position = this.overlayPosition.position();
    if (!position) return {};

    const side = position.placement.split('-')[0];
    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[side];

    const arrowPosition = position.middlewareData.arrow;
    if (!arrowPosition) return {};

    const arrowElement = this.elementRef.nativeElement;
    const arrowSize = arrowElement.offsetWidth || 0;

    const styles: Record<string, string> = {
      left:
        arrowPosition.x != null && arrowPosition.centerOffset === 0 ? `${arrowPosition.x}px` : '',
      top:
        arrowPosition.y != null && arrowPosition.centerOffset === 0 ? `${arrowPosition.y}px` : '',
    };

    if (staticSide) {
      styles[staticSide] = `${-arrowSize / 2}px`;
    }

    return styles;
  });

  constructor() {
    this.overlayPosition.registerArrowElement(this.elementRef.nativeElement);
    this.destroyRef.onDestroy(() => this.overlayPosition.registerArrowElement(null));
  }
}
