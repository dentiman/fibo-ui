import {computed, Directive, inject, input, linkedSignal, model, output, Signal} from '@angular/core';
import { InjectionToken } from '@angular/core';

export const SELECTION_MODEL = new InjectionToken<SelectionModel<any>>('SelectionModel');
export interface SelectionModel<T> {
  value: Signal<unknown>
  select(value: T): void
  isSelected(value: T): boolean
  lastSelection: Signal<T|null>
}

export type CompareFn<T> = (a: T, b: T) => boolean;

@Directive({
  selector: '[SingleSelectionModel],[SingleSelectionModelHost]',
  standalone: true,
  providers: [{ provide: SELECTION_MODEL, useExisting: SingleSelectionModel }]
})
export class SingleSelectionModel<T> implements SelectionModel<T> {

  value = model<T|null>(null,{ alias: 'SingleSelectionModel' })
  selectionChange = output<T>()
  compareFn = input<CompareFn<T>>((a: T, b: T) => a === b)

  select(value: T) {
    this.value.set(value)
  }
  isSelected(value: T): boolean {
    const selected = this.value()
    if (selected === null || selected === undefined) return false
    return this.compareFn()(selected, value)
  }
  lastSelection = computed(()=> this.value())
}

@Directive({
  selector: '[MultipleSelectionModel]',
  standalone: true,
  providers: [{ provide: SELECTION_MODEL, useExisting: MultipleSelectionModel }]
})
export class MultipleSelectionModel<T> implements SelectionModel<T> {
  value = model<T[]|null>(null,{ alias: 'MultipleSelectionModel' })
  compareFn = input<CompareFn<T>>((a: T, b: T) => a === b)

  select(value: T) {
    const selected = this.value()
    const compare = this.compareFn()
    if (Array.isArray(selected)) {
      // Check if value is already selected using compareFn
      const alreadySelected = selected.some(v => compare(v, value))
      if (alreadySelected) {
        this.value.set(selected.filter(v => !compare(v, value)))
      } else {
        this.value.set([...selected, value])
      }
    } else {
      this.value.set([value])
    }
  }
  isSelected(value: T): boolean {
    const selected = this.value()
    if (Array.isArray(selected)) {
      const compare = this.compareFn()
      return selected.some(v => compare(v, value))
    }
    return false

  }

  lastSelection = linkedSignal(() => {
    const values = this.value();
    if(!values) return null;
    return values.length > 0 ? values[values.length - 1] : null;
  })
}
