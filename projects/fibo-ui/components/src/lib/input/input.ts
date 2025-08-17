import {Component, inject} from '@angular/core';
import {FormFieldControl} from '../form/form-field/form-field-control';
import {FormField, FormFieldContent, OverlayTriggerClick} from '@fibo-ui/components';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'fibo-input',
  imports: [
    FormField,
    FormFieldContent,
    ReactiveFormsModule
  ],
  templateUrl: './input.html',
  hostDirectives: [
    {
      directive: FormFieldControl,
      inputs: ['label', 'placeholder','fixedLabel'],
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
