import {Component, inject} from '@angular/core';
import {FormFieldDirective} from '../form/form-field/form-field-directive';
import {FormField, FormFieldContent, OverlayTriggerClick} from '@spacy-ui/components';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'sui-input',
  imports: [
    FormField,
    FormFieldContent,
    ReactiveFormsModule
  ],
  templateUrl: './input.html',
  hostDirectives: [
    {
      directive: FormFieldDirective,
      inputs: ['label', 'placeholder','fixedLabel'],
    }
  ],
})
export class Input {
  formFieldControl = inject<FormFieldDirective<string|number|null>>(FormFieldDirective)
  value =  this.formFieldControl.cva.value;

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value.set(inputValue);
    this.formFieldControl.cva.onChange(inputValue);
  }
}
