import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicDatepickerExampleComponent} from './content/basic-datepicker-example';
import {FloatingLabelDatepickerExampleComponent} from './content/floating-label-example';
import {DateRangePickerExampleComponent} from './content/date-range-picker-example';

@Component({
  selector: 'app-datepicker-page',
  standalone: true,
  imports: [
    CommonModule,
    BasicDatepickerExampleComponent,
    FloatingLabelDatepickerExampleComponent,
    DateRangePickerExampleComponent,
  ],
  templateUrl: './datepicker.html',
})
export class DatepickerPageComponent {

}
