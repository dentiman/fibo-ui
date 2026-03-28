import { computed, Directive, effect, ElementRef, inject, input, signal } from '@angular/core';
import {
  autoUpdate,
  ComputePositionReturn,
  computePosition,
  flip,
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

  readonly width = computed(() => {
    this.position();
    return this.matchWidth() ? this.referenceElement()?.offsetWidth : undefined;
  });

  constructor() {
    effect(onCleanup => {
      const reference = this.referenceElement();
      if (!reference) return;

      const floatingElement = this.elementRef.nativeElement as HTMLElement;
      const currentPlacement = this.placement();
      const currentOffset = this.offset();

      const updatePosition = () => {
        computePosition(reference, floatingElement, {
          placement: currentPlacement,
          middleware: [offset(currentOffset), shift(), flip()],
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
