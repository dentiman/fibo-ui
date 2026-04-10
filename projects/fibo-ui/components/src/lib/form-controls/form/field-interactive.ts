import { computed, Directive, ElementRef, inject, input } from '@angular/core';
import { FIELD_INTERACTIVE, FieldContainerDirective, FieldInteractiveRef } from './field-container';
import { FormUiState } from './form-ui-state';

let nextFieldInteractiveId = 0;

@Directive({
  selector: '[fiboFieldInteractive]',
  standalone: true,
  providers: [{ provide: FIELD_INTERACTIVE, useExisting: FieldInteractiveDirective }],
  host: {
    'data-field-interactive': 'true',
    '[id]': 'controlId()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
  },
})
export class FieldInteractiveDirective implements FieldInteractiveRef {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly container = inject(FieldContainerDirective, { optional: true });
  private readonly formUiState = inject(FormUiState, { optional: true });
  private readonly fallbackId = `field-interactive-${nextFieldInteractiveId++}`;

  readonly fieldInteractiveMode = input<'focus' | 'click'>('focus');

  readonly controlId = computed(() => this.container?.idFor('control') ?? this.fallbackId);

  readonly ariaLabelledBy = computed(() =>
    this.container?.hasLabel() ? this.container.idFor('label') : null,
  );

  readonly ariaDescribedBy = computed(() => {
    if (!this.container) return null;
    if (this.formUiState?.errorMessage()) return this.container.idFor('error');
    return null;
  });

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
    if (this.fieldInteractiveMode() === 'click' && !this.isDisabled(element)) {
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
