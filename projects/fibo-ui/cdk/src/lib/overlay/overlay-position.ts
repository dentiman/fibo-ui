import { computed, Directive, effect, ElementRef, inject, input, signal } from '@angular/core';
import {
  arrow,
  autoUpdate,
  ComputePositionReturn,
  computePosition,
  flip,
  Middleware,
  offset,
  shift,
} from '@floating-ui/dom';
import { OverlayHandle } from './overlay-handle';

/**
 * Standalone positioning directive for connected-type overlays
 * (popover, menu, tooltip).
 *
 * Reads placement, offset, matchWidth and referenceElement from a single
 * `OverlayHandle` input and applies absolute positioning to the host.
 */
@Directive({
  selector: '[fiboOverlayPosition]',
  host: {
    'class': 'pointer-events-auto',
    '[style.position]': '"absolute"',
    '[style.left]': 'position()?.x + "px"',
    '[style.top]': 'position()?.y + "px"',
    '[style.width]': 'width() ? width() + "px" : null',
    '[style.opacity]': 'position() ? "1" : "0"',
  },
})
export class OverlayPosition {
  readonly handle = input.required<OverlayHandle>();
  private readonly elementRef = inject(ElementRef);
  private readonly positionSignal = signal<ComputePositionReturn | null>(null);
  private readonly arrowElement = signal<HTMLElement | null>(null);

  readonly position = this.positionSignal.asReadonly();

  readonly placement = computed(() => {
    const handle = this.handle();
    switch (handle.strategy.kind) {
      case 'connected':
      case 'menu':
        return handle.strategy.options.placement ?? (handle.strategy.kind === 'menu' ? 'right-start' : 'bottom');
      case 'tooltip':
        return handle.strategy.options.placement ?? 'top';
      default:
        return 'bottom';
    }
  });

  readonly matchWidth = computed(() => {
    const handle = this.handle();
    return handle.strategy.kind === 'connected' ? handle.strategy.options.matchWidth ?? false : false;
  });

  readonly offset = computed(() => {
    const handle = this.handle();
    switch (handle.strategy.kind) {
      case 'connected':
      case 'menu':
        return handle.strategy.options.offset ?? (handle.strategy.kind === 'menu' ? 1 : 5);
      case 'tooltip':
        return 5;
      default:
        return 5;
    }
  });

  readonly referenceElement = computed(() => this.handle().referenceElement ?? undefined);

  readonly middleware = computed<Middleware[]>(() => {
    const overlayOffset = this.offset();
    const middleware: Middleware[] = [offset(overlayOffset), shift(), flip()];
    const arrowElement = this.arrowElement();
    if (!arrowElement) {
      return middleware;
    }

    const arrowSize = arrowElement.offsetWidth || 0;
    const arrowOffset = arrowSize / 2;

    middleware.push(arrow({ element: arrowElement }), offset(arrowOffset + overlayOffset));
    return middleware;
  });

  readonly width = computed(() => {
    this.position();
    return this.matchWidth() ? this.referenceElement()?.offsetWidth : undefined;
  });

  registerArrowElement(element: HTMLElement | null): void {
    this.arrowElement.set(element);
  }

  constructor() {
    effect(onCleanup => {
      const reference = this.referenceElement();
      if (!reference) return;

      const floatingElement = this.elementRef.nativeElement as HTMLElement;
      const currentPlacement = this.placement();
      const middleware = this.middleware();

      const updatePosition = () => {
        computePosition(reference, floatingElement, {
          placement: currentPlacement,
          middleware,
        }).then(pos => this.positionSignal.set(pos));
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
}
