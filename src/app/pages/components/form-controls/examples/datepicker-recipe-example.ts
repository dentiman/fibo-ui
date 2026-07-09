import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { DatePickerField } from '@fibo-ui/components';

@Component({
  selector: 'datepicker-recipe-example',
  imports: [DatePickerField, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-datepicker
        [formField]="form.birthDate"
        label="Birth Date"
        placeholder="YYYY-MM-DD"
      />
    </div>
  `,
})
export class DatepickerRecipeExample {
  readonly model = signal({ birthDate: '' });
  readonly form = form(this.model);
}
