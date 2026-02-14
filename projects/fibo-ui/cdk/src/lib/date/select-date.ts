import {
  inject,
  Directive,
  model,
  linkedSignal
} from '@angular/core';
import { SELECTION_MODEL, SelectionModel } from '../data-list/selection-models';
import { DATE_ADAPTER } from './date-adapter';

@Directive({
  selector: '[fiboSelectDate]',
  standalone: true,
  providers: [
    {provide: SELECTION_MODEL, useExisting: SelectDate}
  ]
})
export class SelectDate implements SelectionModel<string> {
  private readonly dateFormat = 'yyyy-MM-dd';
  private readonly dateAdapter = inject(DATE_ADAPTER);
  value = model<string | null>(null);

  select(value: string) {
    this.value.set(value);
  }

  isSelected(value: string): boolean {
    const current = this.value();
    if (!current) return false;

    const date = this.dateAdapter.parse(value, this.dateFormat, this.dateAdapter.now());
    const selectedDate = this.dateAdapter.parse(current, this.dateFormat, this.dateAdapter.now());

    return this.dateAdapter.isEqual(date, selectedDate);
  }

  lastSelection = linkedSignal(() => this.value())
}
