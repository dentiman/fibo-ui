import { computed, Directive, ElementRef, inject } from '@angular/core';
import { FieldShellHost } from './field-shell-host';
import { FieldUiState } from './field-ui-state';

let nextFieldTargetId = 0;

@Directive({
  selector: '[fiboFieldTargetBase]',
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
export class FieldTarget {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly host = inject(FieldShellHost, { optional: true });
  private readonly fieldUiState = inject(FieldUiState, { optional: true });
  private readonly fallbackId = `field-target-${nextFieldTargetId++}`;

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

  element(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
