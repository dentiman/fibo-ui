import { computed, Signal } from '@angular/core';
import { FieldTree, ValidationError, WithOptionalField } from '@angular/forms/signals';

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

export function fieldErrorMessage<TValue>(field: FieldTree<TValue>) {
  return computed(() => {
    const state = field();
    const touched = (state as any).touched?.() ?? false;
    const errors = state.errors();

    if (state.invalid() && touched && errors.length > 0) {
      return errors[0].message;
    }

    return null;
  });
}
