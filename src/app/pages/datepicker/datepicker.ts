import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignalFormsDatepickerExampleComponent} from './content/signal-forms-datepicker-example';
import {SignalFormsDateRangeExampleComponent} from './content/signal-forms-date-range-example';

@Component({
  selector: 'app-datepicker-page',
  standalone: true,
  imports: [
    CommonModule,
    SignalFormsDatepickerExampleComponent,
    SignalFormsDateRangeExampleComponent,
  ],
  templateUrl: './datepicker.html',
})
export class DatepickerPageComponent {

}
