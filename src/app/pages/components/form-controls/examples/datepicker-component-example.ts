import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { DatePickerField } from '@fibo-ui/components';

@Component({
  selector: 'datepicker-component-example',
  imports: [DatePickerField, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-datepicker
        [formField]="userForm.birthDate"
        label="Birth Date"
        placeholder="YYYY-MM-DD"
      />
    </div>
  `,
})
export class DatepickerComponentExample {
  readonly userModel = signal({ birthDate: '' });
  readonly userForm = form(this.userModel);
}
