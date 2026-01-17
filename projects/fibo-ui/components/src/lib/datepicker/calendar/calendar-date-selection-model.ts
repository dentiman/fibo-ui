import {
  Directive,
  model,
  linkedSignal
} from '@angular/core';
import {parse, isEqual} from "date-fns";
import {SELECTION_MODEL, SelectionModel} from '@fibo-ui/cdk';

@Directive({
  selector: '[fiboCalendarDate]',
  standalone: true,
  providers: [
    {provide: SELECTION_MODEL, useExisting: CalendarDateSelectionModel}
  ]
})
export class CalendarDateSelectionModel implements SelectionModel<string> {
  private readonly dateFormat = 'yyyy-MM-dd';
  value = model<string | null>(null);

  select(value: string) {
    this.value.set(value);
  }

  isSelected(value: string): boolean {
    const current = this.value();
    if (!current) return false;

    const date = parse(value, this.dateFormat, new Date());
    const selectedDate = parse(current, this.dateFormat, new Date());

    return isEqual(date, selectedDate);
  }

  lastSelection = linkedSignal(() => this.value())
}
