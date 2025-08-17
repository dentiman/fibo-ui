import {Component, computed, Input, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { format, parse, isEqual, isAfter, isWithinInterval, isSameMonth, startOfDay, endOfDay } from 'date-fns';

@Component({
  selector: 'button[fiboCalendarRangeCell]',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="mx-auto flex h-5 w-5 items-center justify-center rounded-full "></div>`,
  host: {
    //  class: 'py-2 focus:z-10 mb-1',
    // '[class.bg-gray-100]': 'disabled() || false',
    // '[class.text-gray-400]': 'disabled() || false',
    // '[class.text-indigo-600]': 'isToday()',
    // '[class.text-gray-300]': '!isActiveMonth() && !disabled()',
    // '[class.text-gray-500]': '(isActiveMonth() && !disabled()) || isInRange() || false',
    // '[class.bg-indigo-600]': 'isSelected() && !isInRange() && !isStartOfRange() && !isEndOfRange() || false',
    // '[class.text-white]': 'isSelected() && !isInRange() && !isStartOfRange() && !isEndOfRange() || false',
    // '[class.rounded-md]': 'isSelected() && !isInRange() && !isStartOfRange() && !isEndOfRange() || false',
    // '[class.rounded-l-md]': 'isStartOfRange() || false',
    // '[class.rounded-r-md]': 'isEndOfRange() || isEndOfHoverRange() || false',
    // '[class.bg-indigo-300]': 'isEndOfRange() || isStartOfRange() || false',
    // '[class.bg-indigo-200]': 'isInRange() || false',
    // '[class.bg-gray-200]': 'isInHoverRange() || false',
    // '[attr.disabled]': 'disabled() || null',
    // '[attr.data-disabled]': 'disabled() || null',
    // '[attr.data-today]': 'isToday()',
    // '[attr.data-active-month]': 'isActiveMonth()',
    // '[attr.data-selected]': 'isSelected()',
    // '[attr.aria-selected]': 'isSelected()',
    // '[attr.type]': '"button"',
    // '(click)': 'select()',
    // '(mouseenter)': '_handleMouseenter()',
    // '(mouseleave)': '_handleMouseleave()'
  }
})
export class CalendarRangeCell {
  // date = input.required<string>()
  // minDate = input<string|null>(null)
  // maxDate = input<string|null>(null)
  // selectionModel = input.required<DateRangeSelectionModel>()
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
  // //  this.selectionModel()?.selectDate(this.date());
  // }
  //
  // isActiveMonth = computed(() => {
  //   const activeMonth = this.selectionModel()?.activeMonth;
  //   if (!activeMonth) return false;
  //   // Try to get a string representation of the active month for comparison
  //   // If activeMonth has a 'month' and 'year' property, use them
  //   // Otherwise, fallback to the original hasTheSameMonthAs if available
  //   if (typeof activeMonth === 'string') {
  //     const current = parse(this.date(), this.dateFormat, new Date());
  //     const compare = parse(activeMonth, this.dateFormat, new Date());
  //     return isSameMonth(current, compare);
  //   }
  //   if (activeMonth.month && activeMonth.year) {
  //     const current = parse(this.date(), this.dateFormat, new Date());
  //     // Unwrap signals if necessary
  //     const month = typeof activeMonth.month === 'function' ? activeMonth.month() : activeMonth.month;
  //     const year = typeof activeMonth.year === 'function' ? activeMonth.year() : activeMonth.year;
  //     return (
  //       current.getMonth() + 1 === month &&
  //       current.getFullYear() === year
  //     );
  //   }
  //   // fallback to hasTheSameMonthAs if available
  //   if (typeof activeMonth.hasTheSameMonthAs === 'function') {
  //     return activeMonth.hasTheSameMonthAs(this.date());
  //   }
  //   return false;
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
  //
  // // Range specific properties
  // startDate = computed(() => {
  //   return this.selectionModel()?.startDate();
  // })
  //
  // endDate = computed(() => {
  //   return this.selectionModel()?.endDate();
  // })
  //
  // hoverDate = computed(() => {
  //   return this.selectionModel()?.hoverDate();
  // })
  //
  // isInRange = computed(() => {
  //   const start = this.startDate();
  //   const end = this.endDate();
  //   if (!start || !end) return false;
  //   const current = parse(this.date(), this.dateFormat, new Date());
  //   const startParsed = parse(start, this.dateFormat, new Date());
  //   const endParsed = parse(end, this.dateFormat, new Date());
  //   return isWithinInterval(current, { start: startOfDay(startParsed), end: endOfDay(endParsed) });
  // })
  //
  // isInHoverRange = computed(() => {
  //   const start = this.startDate();
  //   const hover = this.hoverDate();
  //   const end = this.endDate();
  //   if (!start || !hover || end) return false;
  //   const current = parse(this.date(), this.dateFormat, new Date());
  //   const startParsed = parse(start, this.dateFormat, new Date());
  //   const hoverParsed = parse(hover, this.dateFormat, new Date());
  //   return isWithinInterval(current, { start: startOfDay(startParsed), end: endOfDay(hoverParsed) });
  // })
  //
  // isEndOfHoverRange = computed(() => {
  //   const start = this.startDate();
  //   const hover = this.hoverDate();
  //   const end = this.endDate();
  //   if (!start || !hover || end) return false;
  //   const current = parse(this.date(), this.dateFormat, new Date());
  //   const startParsed = parse(start, this.dateFormat, new Date());
  //   const hoverParsed = parse(hover, this.dateFormat, new Date());
  //   return isAfter(current, startParsed) && isEqual(current, hoverParsed);
  // })
  //
  // isStartOfRange = computed(() => {
  //   const start = this.startDate();
  //   if (!start) return false;
  //   return this.date() === start;
  // })
  //
  // isEndOfRange = computed(() => {
  //   const end = this.endDate();
  //   if (!end) return false;
  //   return this.date() === end;
  // })
  //
  // _handleMouseenter() {
  //   this.selectionModel()?.hoverDate.set(this.date());
  // }
  //
  // _handleMouseleave() {
  //   this.selectionModel()?.hoverDate.set(null);
  // }

}
