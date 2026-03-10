import { Component, input, model, signal } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import { SelectDate, Popover, PopoverTriggerClick, FocusTrap } from '@fibo-ui/cdk';
import { formErrorMessage } from '../form/form-error';
import { FormFieldControl } from '../form/form-field-control';
import { Calendar } from '../calendar/calendar';

@Component({
  selector: 'fibo-datepicker',
  imports: [FormFieldControl, Popover, PopoverTriggerClick, Calendar, SelectDate, FocusTrap],
  host: {
    class: 'block',
  },
  template: `
    <fibo-form-field-control
      fiboPopoverTriggerClick
      [delegatesFocus]="true"
      [content]="calendarTpl"
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
        [attr.data-error]="(invalid() && touched()) || null"
        (input)="onInput($event)"
        (blur)="onBlur()"
        class="text-field-input"
      />
    </fibo-form-field-control>
    @if (errorMessage(); as error) {
      <div class="form-field-error">{{ error }}</div>
    }

    <ng-template #calendarTpl let-trigger>
      <fibo-calendar
        fiboPopover
        fiboFocusTrap
        [restoreFocus]="false"
        fiboSelectDate
        role="dialog"
        [(value)]="value"
        (itemTriggered)="trigger.close()"
        class="popover-container"
      />
    </ng-template>
  `,
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
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);

  label = input<string>('');
  placeholder = input<string>('');
  iconStart = input<string>('');
  errorMessage = formErrorMessage(this.errors, this.invalid, this.touched);

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onBlur() {
    this.touched.set(true);
  }
}
