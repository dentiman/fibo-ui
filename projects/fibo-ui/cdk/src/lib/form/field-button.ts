import { computed, Directive, ElementRef, inject } from '@angular/core';
import { FieldTarget } from './field-target';
import { FieldShellHost, type FieldTargetRef } from './field-shell-host';
import { FieldUiState } from './field-ui-state';

@Directive({
  selector: '[fiboFieldButton]',
  standalone: true,
  hostDirectives: [FieldTarget],
  host: {
    '[attr.tabindex]': 'tabindex()',
    '(keydown.enter)': 'activate($event)',
    '(keydown.space)': 'activate($event)',
  },
})
export class FieldButton implements FieldTargetRef {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly host = inject(FieldShellHost, { optional: true });
  private readonly fieldUiState = inject(FieldUiState, { optional: true });

  readonly tabindex = computed(() => (this.fieldUiState?.disabled() ? -1 : 0));

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
    this.element().click();
  }

  activate(event: Event): void {
    if (this.element() instanceof HTMLButtonElement) return;
    event.preventDefault();
    this.element().click();
  }
}
