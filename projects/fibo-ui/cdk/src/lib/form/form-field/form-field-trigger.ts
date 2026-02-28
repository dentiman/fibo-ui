import { Directive, input, inject, model } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import { PopoverTrigger } from '../../popover/popover-trigger';

@Directive({
  selector: 'button[fiboFormFieldTrigger]',
  hostDirectives: [{
    directive: PopoverTrigger,
    inputs: ['content'],
  }],
  standalone: true,
  host: {
    'type': 'button',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-required]': 'required() || null',
    '[attr.data-error]': 'invalid() && touched() || null',
    '[style.pointer-events]': "disabled() ? 'none' : 'auto'",
    '[disabled]': "disabled() || null",
    '(keydown.enter)': 'popoverTrigger.open()',
    '(keydown.escape)': 'popoverTrigger.close()',
    '(click)': "popoverTrigger.toggle()"
  }
})
export class FormFieldTrigger implements FormValueControl<any> {

  popoverTrigger = inject(PopoverTrigger);
  value = model<unknown>()
  required = input(false)
  disabled = input(false)
  touched = input(false)
  invalid = input(false)
  dirty = input(false)
  errors = input<readonly WithOptionalField<ValidationError>[]>([])

}
