import { computed, DestroyRef, Directive, inject } from '@angular/core';
import { FieldShellHostDirective } from './field-shell-host';

let nextFieldLabelId = 0;

@Directive({
  selector: '[fiboFieldLabel]',
  standalone: true,
  host: {
    '[id]': 'labelId()',
    '[attr.for]': 'controlId()',
  },
})
export class FieldLabelDirective {
  private readonly host = inject(FieldShellHostDirective, { optional: true });
  private readonly fallbackId = `field-label-${nextFieldLabelId++}`;

  readonly labelId = computed(() => this.host?.idFor('label') ?? this.fallbackId);
  readonly controlId = computed(() => this.host?.idFor('control') ?? null);

  constructor() {
    if (this.host) {
      this.host.setHasLabel(true);
      inject(DestroyRef).onDestroy(() => this.host!.setHasLabel(false));
    }
  }
}
