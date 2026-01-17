import { contentChild, Directive, computed } from '@angular/core';
import { FORM_FIELD, REQUIRED } from '@angular/forms/signals';

@Directive({
  selector: '[fiboFormField]',
  host: {
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-required]': 'required() || null',
    '[attr.data-error]': 'invalid() && touched() || null',
  }
})
export class FormFieldDirective {

  field = contentChild(FORM_FIELD);

  readonly required = computed(() => this.field()?.state().metadata(REQUIRED)?.() ?? true);

  readonly invalid = computed(() => this.field()?.state().invalid() ?? true);

  // touched is not explicitly in FieldState types currently, using unsafe cast
  readonly touched = computed(() => (this.field()?.state() as any)?.touched?.() ?? false);

  readonly dirty = computed(() => this.field()?.state().dirty() ?? false);

  readonly disabled = computed(() => (this.field()?.state().disabledReasons()?.length ?? 0) > 0);

  // readonly is not explicitly in FieldState types currently
  readonly readonly = computed(() => (this.field()?.state() as any)?.readonly?.() ?? false);

  readonly pending = computed(() => this.field()?.state().pending() ?? false);

  readonly errors = computed(() => this.field()?.state().errors() ?? []);
}
