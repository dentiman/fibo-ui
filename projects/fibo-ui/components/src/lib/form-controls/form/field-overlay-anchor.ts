import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[fiboFieldOverlayAnchor]',
  standalone: true,
  exportAs: 'FieldOverlayAnchor',
})
export class FieldOverlayAnchorDirective {
  readonly elementRef = inject(ElementRef<HTMLElement>);

  element(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
