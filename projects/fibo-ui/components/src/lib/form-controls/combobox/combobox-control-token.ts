import {
  forwardRef,
  inject,
  InjectionToken,
  type ModelSignal,
  type Provider,
  type Signal,
  type Type,
  type WritableSignal,
} from '@angular/core';
import { ComboboxInternal } from './combobox-internal-token';

export interface ComboboxControl<TValue, TItem = TValue> {
  value: ModelSignal<TValue>;
  expanded: WritableSignal<boolean>;
  options: Signal<readonly TItem[]>;
  query: WritableSignal<string>;
}

export const FIBO_COMBOBOX_CONTROL = new InjectionToken<ComboboxControl<unknown>>(
  'FIBO_COMBOBOX_CONTROL',
);

export function provideComboboxControl<TValue, TItem = TValue>(
  type: () => Type<ComboboxControl<TValue, TItem>>,
): Provider[] {
  return [
    { provide: FIBO_COMBOBOX_CONTROL, useExisting: forwardRef(type) },
    ComboboxInternal,
  ];
}

export function injectComboboxControl<TValue, TItem = TValue>(): ComboboxControl<TValue, TItem> {
  return inject(FIBO_COMBOBOX_CONTROL) as ComboboxControl<TValue, TItem>;
}
