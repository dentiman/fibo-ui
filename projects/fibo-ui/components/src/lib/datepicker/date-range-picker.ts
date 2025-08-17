import {
  Component,
  computed,
  ElementRef,
  effect,
  inject,
  Input,
  input,
  model,
  OnInit,
  output,
  signal,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR, NgControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Calendar } from './calendar/calendar';

import {
  Popover, OverlayTriggerClick
} from '@fibo-ui/cdk';
import {FormFieldOverlayTrigger} from '@fibo-ui/cdk';
import {ResetControl} from '../form/reset-control';
import {FormField} from '../form/form-field/form-field';
import {FormFieldControl} from '@fibo-ui/cdk';
import {FormFieldContent} from '@fibo-ui/cdk';
import {CalendarDateRangeSelectionModel, DateRange} from './calendar/calendar-date-range-selection-model';

@Component({
  selector: 'fibo-date-range-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Popover,
    Calendar,
    CalendarDateRangeSelectionModel,
    FormFieldOverlayTrigger,
    ReactiveFormsModule,
    ResetControl,
    FormField,
    OverlayTriggerClick,
    FormFieldContent
  ],
  hostDirectives: [
    {
      directive: FormFieldControl,
      inputs: ['label', 'placeholder','fixedLabel'],
    }
  ],
  templateUrl: './date-range-picker.html',
})
export class DateRangePicker {
  formFieldControl = inject(FormFieldControl)
  value = model<DateRange>({startDate: null, endDate: null});
  minDate = input<string|null>(null);
  maxDate = input<string|null>(null);
}
