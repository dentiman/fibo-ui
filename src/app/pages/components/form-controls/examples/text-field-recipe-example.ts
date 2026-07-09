import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TextField } from '@fibo-ui/components';

@Component({
  selector: 'text-field-recipe-example',
  imports: [FormField, TextField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-70 p-8">
      <fibo-text-field
        [formField]="form.name"
        label="Name"
        iconStart="user"
        placeholder="Type something"
      />
    </div>
  `,
})
export class TextFieldRecipeExample {
  readonly model = signal({ name: '' });
  readonly form = form(this.model);
}
