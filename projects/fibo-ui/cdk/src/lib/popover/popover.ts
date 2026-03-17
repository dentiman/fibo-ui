import {
  computed,
  contentChild,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import {
  arrow,
  autoUpdate,
  ComputePositionReturn,
  computePosition,
  flip,
  offset,
  Placement,
  shift,
} from '@floating-ui/dom';
import { PopoverArrow } from './popover-arrow';
import { OVERLAY_HANDLE } from '../overlay/overlay-handle';

@Directive({
  selector: '[fiboPopover]',
  exportAs: 'Popover',
  host: {
    '[style.position]': '"absolute"',
    '[style.left]': 'position() ? position()?.x + "px" : ""',
    '[style.top]': 'position() ? position()?.y + "px" : ""',
    '[style.width]': 'width() ? width() + "px" : ""',
    '[style.opacity]': 'position() ? "1" : "0"',
  },
})
export class Popover {
  private overlayHandle = inject(OVERLAY_HANDLE);
  referenceElement = input<HTMLElement>();
  matchWidth = input<boolean>(false);
  placement = model<Placement>('bottom');
  elementRef = inject(ElementRef);
  offset = input<number>(5);
  arrow = contentChild(PopoverArrow);
  private positionSignal = signal<ComputePositionReturn | null>(null);

  realReferenceElement = computed(() => {
    return this.referenceElement() ?? this.overlayHandle.referenceElement;
  });

  positionMiddleware = computed(() => {
    const middleware = [offset(this.offset()), shift(), flip()];
    if (this.arrow()) {
      const arrowSize = this.arrow()?.elementRef.nativeElement.offsetWidth || 0;
      const arrowOffset = arrowSize / 2;
      middleware.push(
        arrow({ element: this.arrow()?.elementRef.nativeElement }),
        offset(arrowOffset + this.offset()),
      );
    }
    return middleware;
  });

  position = this.positionSignal.asReadonly();

  width = computed(() => {
    this.position();
    return this.matchWidth() ? this.realReferenceElement()?.offsetWidth : undefined;
  });

  constructor() {
    effect(onCleanup => {
      const reference = this.realReferenceElement();
      if (!reference) {
        return;
      }

      const floatingElement = this.elementRef.nativeElement as HTMLElement;

      const updatePosition = () => {
        computePosition(reference, floatingElement, {
          placement: this.placement(),
          middleware: this.positionMiddleware(),
        }).then(position => {
          this.positionSignal.set(position);
        });
      };

      const cleanup = autoUpdate(reference, floatingElement, updatePosition, {
        ancestorScroll: true,
        ancestorResize: true,
        elementResize: true,
        layoutShift: true,
        animationFrame: false,
      });

      onCleanup(cleanup);
    });
  }

  close() {
    this.overlayHandle.close();
  }
}
