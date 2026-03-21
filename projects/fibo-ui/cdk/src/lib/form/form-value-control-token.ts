import { forwardRef, inject, InjectionToken, type ExistingProvider, type Type } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

export const FIBO_FORM_VALUE_CONTROL = new InjectionToken<FormValueControl<unknown>>(
  'FIBO_FORM_VALUE_CONTROL',
);

export function provideFormValueControl<T>(
  type: () => Type<FormValueControl<T>>,
): ExistingProvider {
  return {
    provide: FIBO_FORM_VALUE_CONTROL,
    useExisting: forwardRef(type),
  };
}

export function injectFormValueControl<T>(): FormValueControl<T> {
  return inject(FIBO_FORM_VALUE_CONTROL) as FormValueControl<T>;
}
