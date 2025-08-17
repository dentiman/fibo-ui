import {
  Directive,
  Signal,
  signal,
  WritableSignal,
  InjectionToken,
  effect, model, linkedSignal
} from '@angular/core';
import {parse, isValid, isEqual} from "date-fns";
import {SELECTION_MODEL, SelectionModel} from '../../data-list/selection-models';

@Directive({
  selector: '[suiCalendarDateSelectionModel]',
  standalone: true,
  providers: [
    {provide: SELECTION_MODEL, useExisting: CalendarDateSelectionModel}
  ]
})
export class CalendarDateSelectionModel implements SelectionModel<string> {
  private readonly dateFormat = 'yyyy-MM-dd';
  readonly valueSignal = model<string | null>(null, {alias: 'suiCalendarDateSelectionModel'});

  get value(): Signal<string | null> {
    return this.valueSignal.asReadonly();
  }

  select(value: string) {
    this.valueSignal.set(value);
    this.lastSelection.set(value);
  }

  isSelected(value: string): boolean {
    const current = this.valueSignal();
    if (!current) return false;

    const date = parse(value, this.dateFormat, new Date());
    const selectedDate = parse(current, this.dateFormat, new Date());

    return isEqual(date, selectedDate);
  }

  lastSelection = linkedSignal(() => this.value())
}
