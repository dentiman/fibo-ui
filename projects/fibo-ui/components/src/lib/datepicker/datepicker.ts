import {Component, computed, ElementRef, inject, Input, input, model, output, signal, viewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule} from '@angular/forms';
import { Calendar } from './calendar/calendar';
import {DataList, PopoverTriggerClick, Popover, PortalTemplateDirective} from '@fibo-ui/cdk';
import {PrimitiveValueAccessor} from '@fibo-ui/cdk';
import {CalendarDateSelectionModel} from './calendar/calendar-date-selection-model';
import {FormField} from '../form/form-field/form-field';
import {FormFieldControl} from '@fibo-ui/cdk';
import {FiboInput} from '@fibo-ui/cdk';

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
    PopoverTriggerClick,
    FiboInput,
    PortalTemplateDirective
  ],
  hostDirectives: [
    {
      directive: FormFieldControl,
      inputs: ['label', ' placeholder','fixedLabel', 'appearance', 'controlClass', 'resetCallback' ],
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
  placeholder = computed(() => this.formFieldControl.placeholder()?? 'YYYY-MM-DD');

}
