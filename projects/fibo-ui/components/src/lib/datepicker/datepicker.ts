import {Component, computed, ElementRef, inject, Input, input, model, output, signal, viewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule} from '@angular/forms';
import { Calendar } from './calendar/calendar';
import {DataList, OverlayTriggerClick, PrimitiveValueAccessor, Popover} from '@fibo-ui/components';
import {CalendarDateSelectionModel} from './calendar/calendar-date-selection-model';
import {FormField} from '../form/form-field/form-field';
import {FormFieldControl} from '../form/form-field/form-field-control';
import {FormFieldContent} from '../form/form-field/form-field-content';

@Component({
  selector: 'fibo-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Popover,
    Calendar,
    CalendarDateSelectionModel,
    ReactiveFormsModule,
    FormField,
    OverlayTriggerClick,
    FormFieldContent
  ],
  hostDirectives: [
    {
      directive: FormFieldControl,
      inputs: ['label', ' placeholder','fixedLabel' ],
    }
  ],
  templateUrl: './datepicker.html',
})
export class Datepicker  {
  formFieldControl = inject(FormFieldControl)
  value = this.formFieldControl.cva.value;
  minDate = input<string|null>(null);
  maxDate = input<string|null>(null);
  dateChange = output();

}
