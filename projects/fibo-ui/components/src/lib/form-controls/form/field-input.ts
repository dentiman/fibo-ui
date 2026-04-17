import { Directive, ElementRef, inject } from '@angular/core';
import { FieldTarget } from './field-target';
import { FieldShellHost, type FieldTargetRef } from './field-shell-host';
import { FieldOverlay } from './field-overlay';

@Directive({
  selector: '[fiboFieldInput]',
  standalone: true,
  hostDirectives: [FieldTarget],
  host: {
    class: 'fibo-field-input',
  },
})
export class FieldInput implements FieldTargetRef {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly host = inject(FieldShellHost, { optional: true });
  private readonly overlay = inject(FieldOverlay, { optional: true, self: true });

  constructor() {
    this.host?.registerInteractive(this);
  }

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
    this.focus();
    this.overlay?.open();
  }
}
