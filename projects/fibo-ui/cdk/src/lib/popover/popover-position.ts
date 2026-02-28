import {
  computed,
  contentChild,
  Directive, effect,
  ElementRef,
  inject,
  input, model, signal,
} from '@angular/core';
import {
  autoUpdate,
  computePosition,
  flip,
  shift,
  arrow,
  ComputePositionReturn,
  offset, Placement,
} from '@floating-ui/dom';
import { PopoverArrow } from './popover-arrow';
import { OVERLAY_REF } from '../portal/overlay-registry';

@Directive({
  selector: '[fiboPopoverPosition]',
  exportAs: 'PopoverPosition',
  host: {
    '[style.position]': '"absolute"',
    '[style.left]': 'position() ? position()?.x + "px" : ""',
    '[style.top]': 'position() ? position()?.y + "px" : ""',
    '[style.width]': 'width() ? width() + "px" : ""',
    '[style.opacity]': 'position() ? "1" : "0"',
  },
})
export class PopoverPosition {
  referenceElement = input<HTMLElement>();
  private overlayRef = inject(OVERLAY_REF, { optional: true });

  realReferenceElement = computed(() => {
    return this.referenceElement() ?? this.overlayRef?.referenceElement;
  });

  matchWidth = input<boolean>(false);
  placement = model<Placement>('bottom');
  elementRef = inject(ElementRef);
  offset = input<number>(5);
  private positionSignal = signal<ComputePositionReturn | null>(null);

  arrow = contentChild(PopoverArrow);

  positionMiddleware = computed(() => {
    const middleware = [offset(this.offset()), shift(), flip()];
    if (this.arrow()) {
      const arrowSize = this.arrow()?.elementRef.nativeElement.offsetWidth || 0;
      const arrowOffset = arrowSize / 2;
      middleware.push(
        arrow({ element: this.arrow()?.elementRef.nativeElement }),
        offset(arrowOffset + this.offset())
      );
    }
    return middleware;
  });

  position = this.positionSignal.asReadonly();

  width = computed(() => {
    this.position();
    return this.matchWidth()
      ? this.realReferenceElement()?.offsetWidth
      : undefined;
  });

  constructor() {
    effect((onCleanup) => {
      const reference = this.realReferenceElement();
      if (!reference) return;

      const floatingEl = this.elementRef.nativeElement as HTMLElement;

      const updatePosition = () => {
        computePosition(reference, floatingEl, {
          placement: this.placement(),
          middleware: this.positionMiddleware(),
        }).then((position) => {
          this.positionSignal.set(position);
        });
      };

      const cleanup = autoUpdate(reference, floatingEl, updatePosition, {
        ancestorScroll: true,
        ancestorResize: true,
        elementResize: true,
        layoutShift: true,
        animationFrame: false,
      });

      onCleanup(cleanup);
    });
  }
}
