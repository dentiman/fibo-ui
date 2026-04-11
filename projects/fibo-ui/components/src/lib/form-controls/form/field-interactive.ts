import { computed, Directive, ElementRef, inject, input } from '@angular/core';
import { type FieldInteractiveRef, FieldShellHostDirective } from './field-shell-host';
import { FormUiState } from './form-ui-state';

let nextFieldInteractiveId = 0;

@Directive({
  selector: '[fiboFieldInteractive]',
  standalone: true,
  host: {
    'data-field-interactive': 'true',
    '[id]': 'controlId()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-invalid]': 'ariaInvalid()',
    '[attr.aria-readonly]': 'ariaReadonly()',
  },
})
export class FieldInteractiveDirective implements FieldInteractiveRef {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly host = inject(FieldShellHostDirective, { optional: true });
  private readonly formUiState = inject(FormUiState, { optional: true });
  private readonly fallbackId = `field-interactive-${nextFieldInteractiveId++}`;

  readonly fieldInteractiveMode = input<'focus' | 'click'>('focus');

  readonly controlId = computed(() => this.host?.idFor('control') ?? this.fallbackId);

  readonly ariaLabelledBy = computed(() =>
    this.host?.hasLabel() ? this.host.idFor('label') : null,
  );

  readonly ariaDescribedBy = computed(() => {
    if (!this.host) return null;
    if (this.formUiState?.errorMessage()) return this.host.idFor('error');
    return null;
  });

  readonly ariaInvalid = computed(() => this.formUiState?.invalid() || null);
  readonly ariaReadonly = computed(() => this.formUiState?.readonly() || null);

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
