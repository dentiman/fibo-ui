import {Component, inject} from '@angular/core';
import {FormFieldControl} from '@fibo-ui/cdk';
import {FormFieldContent} from '@fibo-ui/cdk';
import {ReactiveFormsModule} from '@angular/forms';
import {FormField} from '../form/form-field/form-field';

@Component({
  selector: 'fibo-input',
  imports: [
    FormField,
    FormFieldContent,
    ReactiveFormsModule
  ],
  templateUrl: './input.html',
  styles: `
  `,
  hostDirectives: [
    {
      directive: FormFieldControl,
      inputs: ['label', 'placeholder','fixedLabel', 'appearance', 'controlClass'],
    }
  ],
})
export class Input {
  formFieldControl = inject<FormFieldControl<string|number|null>>(FormFieldControl)
  value =  this.formFieldControl.cva.value;

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value.set(inputValue);
    this.formFieldControl.cva.onChange(inputValue);
  }
}
