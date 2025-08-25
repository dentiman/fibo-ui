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
  arrow,
  ComputePositionReturn,
  offset, Placement,
} from '@floating-ui/dom';
import { PopoverArrow} from './popover-arrow';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectResize } from 'ngxtension/resize';
import {
  from,
  fromEvent,
  Observable,
  startWith,
  switchMap,
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

  fullPopoverWidth = input<boolean>(false)
  placement = model<Placement>('bottom');
  elementRef  = inject(ElementRef);
  offset = input<number>(5);
  private positionSignal = signal<ComputePositionReturn | null>(null);

  constructor() {
    effect(() => {
      const reference = this.realReferenceElement();
      if (!reference) return;

      const subscription = fromResizeObserver(reference).pipe(
        switchMap(() =>
          from(
            computePosition(
              reference,
              this.elementRef.nativeElement,
              {
                placement: this.placement(),
                middleware: this.positionMiddleware(),
              }
            )
          )
        )
      ).subscribe(position => {
        this.positionSignal.set(position);
      });

      return () => subscription.unsubscribe();
    });
  }

  arrow = contentChild(PopoverArrow);

  positionMiddleware = computed(() => {
    const middleware = [offset(this.offset()), flip()];
    if (this.arrow()) {
      const floatingOffset =
        Math.sqrt(2 * this.arrow()?.elementRef.nativeElement.offsetWidth ** 2) / 2;
      middleware.push(
        offset(floatingOffset + this.offset()),
        arrow({ element: this.arrow()?.elementRef.nativeElement })
      );
    }
    return middleware;
  });

  position = this.positionSignal.asReadonly();

  width = computed(() => {
    this.position();
    return this.fullPopoverWidth()
      ? this.realReferenceElement()?.offsetWidth
      : undefined;
  });
}
