import {
  Directive,
  model,
  linkedSignal
} from '@angular/core';
import {parse, isEqual, isAfter, isBefore, format} from "date-fns";
import {SELECTION_MODEL, SelectionModel} from '@fibo-ui/cdk';

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

@Directive({
  selector: '[fiboCalendarDateRange]',
  standalone: true,
  providers: [
    {provide: SELECTION_MODEL, useExisting: CalendarDateRangeSelectionModel}
  ]
})
export class CalendarDateRangeSelectionModel implements SelectionModel<string> {
  private readonly dateFormat = 'yyyy-MM-dd';
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

    const date = parse(value, this.dateFormat, new Date());
    const startDate = parse(current.startDate, this.dateFormat, new Date());

    if (isEqual(date, startDate)) return true;

    if (current.endDate) {
      const endDate = parse(current.endDate, this.dateFormat, new Date());
      return isEqual(date, endDate) || (isAfter(date, startDate) && isBefore(date, endDate));
    }

    return false;
  }

  lastSelection = linkedSignal(() => {
    const selectionState = this.value();
    return selectionState.endDate || selectionState.startDate || format(new Date(), this.dateFormat);
  })

  private firstIsMoreOrEqualThenSecond(first: string, second: string): boolean {
    const firstDate = parse(first, this.dateFormat, new Date());
    const secondDate = parse(second, this.dateFormat, new Date());
    return isAfter(firstDate, secondDate) || isEqual(firstDate, secondDate);
  }
}
