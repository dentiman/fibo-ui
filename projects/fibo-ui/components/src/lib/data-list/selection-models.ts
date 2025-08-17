import {computed, Directive, inject, linkedSignal, model, output, Signal} from '@angular/core';
import { InjectionToken } from '@angular/core';

export const SELECTION_MODEL = new InjectionToken<SelectionModel<any>>('SelectionModel');
export interface SelectionModel<T> {
  value: Signal<unknown>
  select(value: T): void
  isSelected(value: T): boolean
  lastSelection: Signal<T|null>
}

@Directive({
  selector: '[SingleSelectionModel],[SingleSelectionModelHost]',
  standalone: true,
  providers: [{ provide: SELECTION_MODEL, useExisting: SingleSelectionModel }]
})
export class SingleSelectionModel<T> implements SelectionModel<T> {

  value = model<T|null>(null,{ alias: 'SingleSelectionModel' })
  selectionChange = output<T>()

  select(value: T) {
    this.value.set(value)
  }
  isSelected(value: T): boolean {
    return this.value() === value
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

  select(value: T) {
    const selected = this.value()
    if (Array.isArray(selected)) {
      //TODO: this works only for primitive values (string | number)
      if (selected.includes(value)) {
        this.value.set(selected.filter(v => v !== value))
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
      return selected.includes(value)
    }
    return false

  }

  lastSelection = linkedSignal(() => {
    const values = this.value();
    if(!values) return null;
    return values.length > 0 ? values[values.length - 1] : null;
  })
}
