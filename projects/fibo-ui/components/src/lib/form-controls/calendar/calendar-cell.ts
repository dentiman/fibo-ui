import {Component, computed, Input, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { format, parse, isEqual, isAfter } from 'date-fns';

@Component({
  selector: 'button[fiboCalendarCell]',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="mx-auto flex h-5 w-5 items-center justify-center rounded-full "></div>`,
  host: {
    // '[class.py-2]': 'true',
    // '[class.focus:z-10]': 'true',
    // '[class.mb-1]': 'true',
    // '[class.bg-gray-100]': 'disabled() || false',
    // '[class.text-gray-400]': 'disabled() || false',
    // '[class.text-indigo-600]': 'isToday()',
    // '[class.text-gray-300]': '!isActiveMonth() && !disabled()',
    // '[class.text-gray-500]': 'isActiveMonth() && !isSelected() && !disabled()',
    // '[class.bg-indigo-600]': 'isSelected() || false',
    // '[class.text-white]': 'isSelected() || false',
    // '[class.rounded-md]': 'isSelected() || false',
    // '[attr.disabled]': 'disabled() || null',
    // '[attr.data-disabled]': 'disabled() || null',
    // '[attr.data-today]': 'isToday()',
    // '[attr.data-active-month]': 'isActiveMonth()',
    // '[attr.data-selected]': 'isSelected()',
    // '[attr.aria-selected]': 'isSelected()',
    // '[attr.type]': '"button"',
    // '(click)': 'select()'
  }
})
export class CalendarCell {
  // date = input.required<string>()
  // minDate = input<string|null>(null)
  // maxDate = input<string|null>(null)
  // selectionModel = input.required<DateSelectionModel>()
  //
  // private readonly dateFormat = 'yyyy-MM-dd'
  //
  // day = computed((): number => {
  //   return parse(this.date(), this.dateFormat, new Date()).getDate();
  // })
  //
  // dayLabel = computed(() => {
  //   return this.day();
  // })
  //
  // select() {
  //   this.selectionModel()?.selectDate(this.date());
  // }
  //
  // isActiveMonth = computed(() => {
  //   return this.selectionModel()?.activeMonth.hasTheSameMonthAs(this.date());
  // })
  //
  // isSelected = computed(() => {
  //   const selected = this.selectionModel()?.selectedDate();
  //   return selected && isEqual(parse(this.date(), this.dateFormat, new Date()), parse(selected, this.dateFormat, new Date()));
  // })
  //
  // disabled = computed(() => {
  //   const minDate = this.minDate();
  //   const maxDate = this.maxDate();
  //   const currentDate = parse(this.date(), this.dateFormat, new Date());
  //   if (minDate) {
  //     const parsedMinDate = parse(minDate, this.dateFormat, new Date());
  //     if (isAfter(parsedMinDate, currentDate)) return true;
  //   }
  //   if (maxDate) {
  //     const parsedMaxDate = parse(maxDate, this.dateFormat, new Date());
  //     if (isAfter(currentDate, parsedMaxDate)) return true;
  //   }
  //   return false;
  // })
  //
  // isToday = computed(() => {
  //   const today = format(new Date(), this.dateFormat);
  //   return this.date() === today;
  // })

}
