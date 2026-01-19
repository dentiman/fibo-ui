import { Component, input, model, signal } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import { Popover, PopoverTriggerClick, PortalContent } from '@fibo-ui/cdk';
import { FormFieldControl } from '../form-field-control';
import { Calendar } from '../../calendar/calendar';
import { CalendarDateSelectionModel } from '../../calendar/calendar-date-selection-model';

@Component({
    selector: 'fibo-datepicker',
    standalone: true,
    imports: [
        FormFieldControl,
        Popover,
        PortalContent,
        PopoverTriggerClick,
        Calendar,
        CalendarDateSelectionModel
    ],
    host: {
        'class': 'block'
    },
    template: `
    <fibo-form-field-control
      fiboPopoverTriggerClick
      [id]="id()"
      [label]="label()"
      [iconStart]="iconStart()"
      [iconEnd]="'calendar-days'"
      [required]="required()"
      [disabled]="disabled()"
      [invalid]="invalid()"
      [touched]="touched()"
      [errors]="errors()"
      [clearValue]="''"
      [(value)]="value"
    >
      <input
        [id]="id()"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.data-error]="invalid() && touched() || null"
        (input)="onInput($event)"
        (blur)="onBlur()"
        class="text-field-input"
      />

      <fibo-calendar *fiboPortalContent="let trigger"
                     fiboPopover [trigger]="trigger"
                     fiboCalendarDate [(value)]="value"
                     (optionTriggered)="trigger.close()"
                     class="popover-container"/>
    </fibo-form-field-control>

    @if (invalid() && touched() && errors().length > 0) {
      <div class="form-field-error mr-3">
        {{ errors()[0].message }}
      </div>
    }
  `
})
export class DatePickerField implements FormValueControl<string> {
    static nextId = 0;
    id = signal(`fibo-datepicker-field-${DatePickerField.nextId++}`);

    value = model<string>('');

    required = input(false);
    disabled = input(false);
    touched = model(false);
    invalid = input(false);
    dirty = input(false);
    errors = input<readonly WithOptionalField<ValidationError>[]>([])

    label = input<string>('');
    placeholder = input<string>('');
    iconStart = input<string>('');

    onInput(event: Event) {
        const target = event.target as HTMLInputElement;
        this.value.set(target.value);
    }

    onBlur() {
        this.touched.set(true);
    }
}
