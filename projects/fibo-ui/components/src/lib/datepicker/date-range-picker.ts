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
  CalendarDateRangeSelectionModel,
  ControlStatus,
  PrimitiveValueAccessor,
  DataList, DateRange,
  OverlayTrigger,
  Popover, OverlayTriggerClick
} from '@spacy-ui/components';
import {FormFieldOverlayTrigger} from '../form/form-field-overlay-trigger';
import {ResetControl} from '../form/reset-control';
import {FormField} from '../form/form-field/form-field';
import {FormFieldDirective} from '../form/form-field/form-field-directive';
import {FormFieldContent} from '../form/form-field/form-field-content';

@Component({
  selector: 'sui-date-range-picker',
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
      directive: FormFieldDirective,
      inputs: ['label', 'placeholder','fixedLabel'],
    }
  ],
  templateUrl: './date-range-picker.html',
})
export class DateRangePicker {
  formFieldControl = inject(FormFieldDirective)
  value = model<DateRange>({startDate: null, endDate: null});
  minDate = input<string|null>(null);
  maxDate = input<string|null>(null);
}
