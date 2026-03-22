import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[fiboFieldTarget]',
  standalone: true,
  host: {
    'data-field-interactive': 'true',
  },
})
export class FieldTargetDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly fieldTargetMode = input<'focus' | 'click'>('focus');

  element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  focus(options?: FocusOptions): void {
    this.element().focus(options);
  }

  focusReturnTarget(): HTMLElement | null {
    return this.element();
  }

  activateFromShell(): void {
    const element = this.element();

    this.focus();
    if (this.fieldTargetMode() === 'click' && !this.isDisabled(element)) {
      element.click();
    }
  }

  private isDisabled(element: HTMLElement): boolean {
    if ('disabled' in element) {
      return Boolean((element as HTMLButtonElement | HTMLInputElement).disabled);
    }

    return element.getAttribute('aria-disabled') === 'true';
  }
}
