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
import type { ConnectedPosition, CoordinatePosition } from './overlay-config';

/**
 * Standalone positioning directive for connected-type overlays
 * (popover, menu, tooltip, context menu).
 *
 * Reads placement, offset, matchWidth and referenceElement from a single
 * `OverlayHandle` input and applies absolute positioning to the host.
 *
 * Supports `connected` and `coordinate` position types.
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

  private readonly positionConfig = computed(() => {
    const pos = this.handle().config.position;
    return pos.type === 'connected' || pos.type === 'coordinate'
      ? (pos as ConnectedPosition | CoordinatePosition)
      : null;
  });

  readonly placement = computed(() => {
    const pos = this.positionConfig();
    return pos?.placement ?? 'bottom';
  });

  readonly matchWidth = computed(() => {
    const pos = this.positionConfig();
    return pos?.type === 'connected' ? pos.matchWidth ?? false : false;
  });

  readonly offset = computed(() => {
    const pos = this.positionConfig();
    return pos?.type === 'connected' ? pos.offset ?? 5 : 5;
  });

  readonly referenceElement = computed<HTMLElement | { getBoundingClientRect(): DOMRect } | undefined>(() => {
    const pos = this.positionConfig();
    if (pos?.type === 'coordinate') {
      const { x, y } = pos;
      return {
        getBoundingClientRect: () => DOMRect.fromRect({ x, y, width: 0, height: 0 }),
      };
    }
    return this.handle().referenceElement ?? undefined;
  });

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
    return this.matchWidth() ? (this.handle().referenceElement?.offsetWidth) : undefined;
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
        computePosition(reference as HTMLElement, floatingElement, {
          placement: currentPlacement,
          middleware,
        }).then(pos => this.positionSignal.set(pos));
      };

      const cleanup = autoUpdate(reference as HTMLElement, floatingElement, updatePosition, {
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
