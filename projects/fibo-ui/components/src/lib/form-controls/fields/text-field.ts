import { Component, input, model, signal } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import { provideFormValueControl } from '@fibo-ui/cdk';
import { formErrorMessage } from '../form/form-error';
import { FormFieldControl } from '../form/form-field-control';

@Component({
  selector: 'fibo-text-field',
  standalone: true,
  imports: [FormFieldControl],
  host: {
    class: 'block',
  },
  providers: [provideFormValueControl(() => TextField)],
  template: `
    <fibo-form-field-control
      [id]="id()"
      [label]="label()"
      [iconStart]="iconStart()"
      [iconEnd]="iconEnd()"
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
        [type]="type()"
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
  `,
})
export class TextField implements FormValueControl<string> {
  static nextId = 0;
  id = signal(`fibo-text-field-${TextField.nextId++}`);

  value = model<string>('');
  type = input<string>('text');

  required = input(false);
  disabled = input(false);
  touched = model(false);
  invalid = input(false);
  dirty = input(false);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);

  label = input<string>('');
  placeholder = input<string>('');
  iconStart = input<string>('');
  iconEnd = input<string>('');
  errorMessage = formErrorMessage(this.errors, this.invalid, this.touched);

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onBlur() {
    this.touched.set(true);
  }
}
