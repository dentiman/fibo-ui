import { computed, Directive, inject } from '@angular/core';
import { FIELD_LABEL, FieldContainerDirective } from './field-container';

let nextFieldLabelId = 0;

@Directive({
  selector: '[fiboFieldLabel]',
  standalone: true,
  providers: [{ provide: FIELD_LABEL, useExisting: FieldLabelDirective }],
  host: {
    '[id]': 'labelId()',
    '[attr.for]': 'controlId()',
  },
})
export class FieldLabelDirective {
  private readonly container = inject(FieldContainerDirective, { optional: true });
  private readonly fallbackId = `field-label-${nextFieldLabelId++}`;

  readonly labelId = computed(() => this.container?.idFor('label') ?? this.fallbackId);
  readonly controlId = computed(() => this.container?.idFor('control') ?? null);
}
