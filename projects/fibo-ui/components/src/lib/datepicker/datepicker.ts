import {Component, computed, ElementRef, inject, Input, input, model, output, signal, viewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule} from '@angular/forms';
import { Calendar } from './calendar/calendar';
import {DataList, OverlayTriggerClick, PrimitiveValueAccessor, Popover} from '@spacy-ui/components';
import {CalendarDateSelectionModel} from './calendar/calendar-date-selection-model';
import {FormField} from '../form/form-field/form-field';
import {FormFieldDirective} from '../form/form-field/form-field-directive';
import {FormFieldContent} from '../form/form-field/form-field-content';

@Component({
  selector: 'sui-datepicker',
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
      directive: FormFieldDirective,
      inputs: ['label', ' placeholder','fixedLabel' ],
    }
  ],
  templateUrl: './datepicker.html',
})
export class Datepicker  {
  formFieldControl = inject(FormFieldDirective)
  value = this.formFieldControl.cva.value;
  minDate = input<string|null>(null);
  maxDate = input<string|null>(null);
  dateChange = output();

}
