import {
  forwardRef,
  inject,
  InjectionToken,
  type ExistingProvider,
  type Signal,
  type Type,
  type WritableSignal,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

export interface ComboboxControl<TValue, TItem = TValue> extends FormValueControl<TValue> {
  expanded: WritableSignal<boolean>;
  options: Signal<readonly TItem[]>;
  query: WritableSignal<string>;
}

export const FIBO_COMBOBOX_CONTROL = new InjectionToken<ComboboxControl<unknown>>(
  'FIBO_COMBOBOX_CONTROL',
);

export function provideComboboxControl<TValue, TItem = TValue>(
  type: () => Type<ComboboxControl<TValue, TItem>>,
): ExistingProvider {
  return {
    provide: FIBO_COMBOBOX_CONTROL,
    useExisting: forwardRef(type),
  };
}

export function injectComboboxControl<TValue, TItem = TValue>(): ComboboxControl<TValue, TItem> {
  return inject(FIBO_COMBOBOX_CONTROL) as ComboboxControl<TValue, TItem>;
}
