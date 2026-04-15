import { computed, Directive, ElementRef, inject, input } from '@angular/core';
import { type FieldTargetRef, FieldShellHost } from './field-shell-host';
import { FieldUiState } from './field-ui-state';

let nextFieldTargetId = 0;

@Directive({
  selector: '[fiboFieldTarget]',
  standalone: true,
  host: {
    'data-field-target': 'true',
    '[id]': 'controlId()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-invalid]': 'ariaInvalid()',
    '[attr.aria-readonly]': 'ariaReadonly()',
  },
})
export class FieldTarget implements FieldTargetRef {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly host = inject(FieldShellHost, { optional: true });
  private readonly fieldUiState = inject(FieldUiState, { optional: true });
  private readonly fallbackId = `field-target-${nextFieldTargetId++}`;

  readonly fieldTargetMode = input<'focus' | 'click'>('focus');

  readonly controlId = computed(() => this.host?.idFor('control') ?? this.fallbackId);

  readonly ariaLabelledBy = computed(() =>
    this.host?.hasLabel() ? this.host.idFor('label') : null,
  );

  readonly ariaDescribedBy = computed(() => {
    if (!this.host) return null;
    if (this.fieldUiState?.errorMessage()) return this.host.idFor('error');
    return null;
  });

  readonly ariaInvalid = computed(() => this.fieldUiState?.invalid() || null);
  readonly ariaReadonly = computed(() => this.fieldUiState?.readonly() || null);

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
