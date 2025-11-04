import {
  computed,
  contentChild,
  Directive, effect,
  ElementRef,
  inject,
  input, model, signal,
} from '@angular/core';
import {
  computePosition,
  flip,
  shift,
  arrow,
  ComputePositionReturn,
  offset, Placement,
} from '@floating-ui/dom';
import { PopoverArrow} from './popover-arrow';
import {
  from,
  fromEvent,
  Observable,
  switchMap,
  merge,
  debounceTime, tap,
} from 'rxjs';
import {PopoverTrigger} from './popover-trigger';

export function fromResizeObserver(
  element: Element
): Observable<ResizeObserverEntry[]> {
  return new Observable((subscriber) => {
    const resizeObserver = new ResizeObserver((entries) => {
      subscriber.next(entries);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  });
}

@Directive({
  selector: '[fiboPopoverPosition]',
  exportAs: 'PopoverPosition',
  standalone: true,
  host: {
    '[style.position]': '"absolute"',
    '[style.left]': 'position() ? position()?.x+"px": ""',
    '[style.top]': 'position() ? position()?.y+"px": ""',
    '[style.width]': 'width() ? width()+"px": ""',
     '[style.opacity]': 'position() ? "1": "0"',
  },
})
export class PopoverPosition {
  referenceElement = input<HTMLElement>()
  popoverTrigger = input<PopoverTrigger>()

  realReferenceElement = computed(()=>{
    if (this.referenceElement()) return this.referenceElement();
    return this.popoverTrigger()?.element
  })

  popoverFullWidth = input<boolean>(false)
  placement = model<Placement>('bottom');
  elementRef  = inject(ElementRef);
  offset = input<number>(5);
  private positionSignal = signal<ComputePositionReturn | null>(null);

  constructor() {
    effect(() => {
      const reference = this.realReferenceElement();
      if (!reference) return;

      const allEvents = merge(
        fromResizeObserver(reference),
        fromResizeObserver(this.elementRef.nativeElement),
        fromEvent(window, 'resize', { passive: true }),
      ).pipe(
        debounceTime(10),
        switchMap(() => from(
          computePosition(
            reference,
            this.elementRef.nativeElement,
            {
              // strategy: 'fixed',
              placement: this.placement(),
              middleware: this.positionMiddleware(),
            }
          )
        ))
      );

      const subscription = allEvents.subscribe(position => {
        this.positionSignal.set(position);
      });

      // Initial position calculation
      computePosition(
        reference,
        this.elementRef.nativeElement,
        {
          // strategy: 'fixed',
          placement: this.placement(),
          middleware: this.positionMiddleware(),
        }
      ).then(position => {
        this.positionSignal.set(position);
      });

      return () => subscription.unsubscribe();
    });
  }

  arrow = contentChild(PopoverArrow);

  positionMiddleware = computed(() => {
    const middleware = [
      offset(this.offset()),
      shift(),
      flip()
    ];
    if (this.arrow()) {
      // Calculate arrow offset: half the arrow's width to account for the arrow pointing outward
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
    return this.popoverFullWidth()
      ? this.realReferenceElement()?.offsetWidth
      : undefined;
  });
}
