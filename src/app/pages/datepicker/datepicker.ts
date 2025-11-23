import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatepickerExampleComponent} from './content/datepicker-example';
import {DateRangeExampleComponent} from './content/date-range-example';

@Component({
  selector: 'app-datepicker-page',
  standalone: true,
  imports: [
    CommonModule,
    DatepickerExampleComponent,
    DateRangeExampleComponent,
  ],
  templateUrl: './datepicker.html',
})
export class DatepickerPageComponent {

}
