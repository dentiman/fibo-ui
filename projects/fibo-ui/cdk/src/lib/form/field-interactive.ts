import { computed, Directive, ElementRef, inject } from '@angular/core';
import { FieldTarget } from './field-target';
import { FieldShellHost, type FieldTargetRef } from './field-shell-host';
import { FieldUiState } from './field-ui-state';
import { FieldOverlay } from './field-overlay';

@Directive({
  selector: '[fiboFieldInteractive]',
  standalone: true,
  hostDirectives: [FieldTarget],
  host: {
    '[attr.tabindex]': 'tabindex()',
    '(keydown.enter)': 'activate($event)',
    '(keydown.space)': 'activate($event)',
  },
})
export class FieldInteractive implements FieldTargetRef {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly host = inject(FieldShellHost, { optional: true });
  private readonly fieldUiState = inject(FieldUiState, { optional: true });
  private readonly overlay = inject(FieldOverlay, { optional: true, self: true });

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
    this.overlay?.open();
  }

  activate(event: Event): void {
    if (this.element() instanceof HTMLButtonElement) return;
    event.preventDefault();
    this.overlay?.toggle();
  }
}
