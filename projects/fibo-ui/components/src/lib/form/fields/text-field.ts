import { Component, input, model, signal } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';

@Component({
  selector: 'fibo-text-field',
  template: `
    <div
        class="text-field-control group "
        [attr.aria-disabled]="disabled() || null"
        [attr.aria-required]="required() || null"
        [attr.data-error]="invalid() && touched() || null"
        [class.disabled]="disabled()"
    >
      <div class="flex flex-col justify-center">
        @if (label()) {
        <label [for]="id()" class="form-field-label">{{ label() }}</label>
        }
        <input
        [id]="id()"
        [type]="type()"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.data-error]="invalid() && touched() || null"
        (input)="onInput($event)"
        (blur)="onBlur()"
        class="text-field-input"
        />
      </div>
    </div>
  `
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
  errors = input<readonly WithOptionalField<ValidationError>[]>([])

  label = input<string>('');
  placeholder = input<string>('');

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onBlur() {
    this.touched.set(true);
  }
}
