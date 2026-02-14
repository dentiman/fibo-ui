import {
  inject,
  Directive,
  model,
  linkedSignal
} from '@angular/core';
import { SELECTION_MODEL, SelectionModel } from '../data-list/selection-models';
import { DATE_ADAPTER } from './date-adapter';

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

@Directive({
  selector: '[fiboSelectDateRange]',
  standalone: true,
  providers: [
    {provide: SELECTION_MODEL, useExisting: SelectDateRange}
  ]
})
export class SelectDateRange implements SelectionModel<string> {
  private readonly dateFormat = 'yyyy-MM-dd';
  private readonly dateAdapter = inject(DATE_ADAPTER);
  value = model<DateRange>({
    startDate: null,
    endDate: null
  });

  select(value: string) {
    const currentValue = this.value();
    const startDate = currentValue.startDate;
    const endDate = currentValue.endDate;

    if (startDate && (endDate === null || endDate === undefined) && this.firstIsMoreOrEqualThenSecond(value, startDate)) {
      this.value.set({startDate, endDate: value});
    } else if (startDate && (endDate === null || endDate === undefined) && this.firstIsMoreOrEqualThenSecond(startDate, value)) {
      this.value.set({startDate: value, endDate});
    } else {
      this.value.set({startDate: value, endDate: null});
    }
  }

  isSelected(value: string): boolean {
    const current = this.value();
    if (!current.startDate) return false;

    const date = this.dateAdapter.parse(value, this.dateFormat, this.dateAdapter.now());
    const startDate = this.dateAdapter.parse(current.startDate, this.dateFormat, this.dateAdapter.now());

    if (this.dateAdapter.isEqual(date, startDate)) return true;

    if (current.endDate) {
      const endDate = this.dateAdapter.parse(current.endDate, this.dateFormat, this.dateAdapter.now());
      return this.dateAdapter.isEqual(date, endDate) || (
        this.dateAdapter.isAfter(date, startDate) && this.dateAdapter.isBefore(date, endDate)
      );
    }

    return false;
  }

  lastSelection = linkedSignal(() => {
    const selectionState = this.value();
    return selectionState.endDate || selectionState.startDate ||
      this.dateAdapter.format(this.dateAdapter.now(), this.dateFormat);
  })

  private firstIsMoreOrEqualThenSecond(first: string, second: string): boolean {
    const firstDate = this.dateAdapter.parse(first, this.dateFormat, this.dateAdapter.now());
    const secondDate = this.dateAdapter.parse(second, this.dateFormat, this.dateAdapter.now());
    return this.dateAdapter.isAfter(firstDate, secondDate) || this.dateAdapter.isEqual(firstDate, secondDate);
  }
}
