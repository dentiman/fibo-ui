import {Component, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Calendar, Datepicker, DateRangePicker, MultipleSelect} from '@fibo-ui/components';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Calendar,
    Datepicker,
    DateRangePicker,
    MultipleSelect
  ],
  template: `
    <div class="w-70 relative  space-y-2">
      <span  class="block text-sm/6 font-medium text-gray-900">With placeholder</span>
      <fibo-datepicker [formControl]="date"></fibo-datepicker>


      <span  class="block text-sm/6 font-medium text-gray-900 mt-2">Floating label</span>
      <fibo-datepicker [formControl]="date" [label]="'Start Date'"></fibo-datepicker>


      <fibo-date-range-picker [label]="'Conform Dates'" [(value)]="range"></fibo-date-range-picker>
      <fibo-date-range-picker  [(value)]="range"></fibo-date-range-picker>
    </div>
  `,
})
export class DatepickerPageComponent {
  date = new FormControl<string>('2024-07-02');
  startDate = new FormControl<string>('2024-07-02');
  endDate = new FormControl<string>('2024-07-12');

  range = signal({startDate: '2024-07-02', endDate: '2024-07-06'});


}
