import {contentChild, Directive, effect, computed} from '@angular/core';
import {FIELD} from '@angular/forms/signals';

@Directive({
  selector: '[fiboFormField]',
  host: {
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-required]': 'required() || null',
    '[attr.data-error]': 'invalid() && touched() || null',
  }
})
export class FormFieldDirective {

  field = contentChild(FIELD);

  readonly required = computed(() => this.field()?.state().required() ?? true);

  readonly invalid = computed(() => this.field()?.state().invalid() ?? true);

  readonly touched = computed(() => this.field()?.state().touched() ?? false);

  readonly dirty = computed(() => this.field()?.state().dirty() ?? false);

  readonly disabled = computed(() => this.field()?.state().disabled() ?? false);

  readonly readonly = computed(() => this.field()?.state().readonly() ?? false);

  readonly pending = computed(() => this.field()?.state().pending() ?? false);

  readonly errors = computed(() => this.field()?.state().errors() ?? []);

}
