import { computed, Signal } from '@angular/core';
import { ValidationError, WithOptionalField } from '@angular/forms/signals';

export function formErrorMessage(
  errors: Signal<readonly WithOptionalField<ValidationError>[]>,
  invalid: Signal<boolean>,
  touched: Signal<boolean>,
) {
  return computed(() => {
    if (invalid() && touched() && errors().length > 0) {
      return errors()[0].message;
    }
    return null;
  });
}
