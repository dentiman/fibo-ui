import {Component, input} from '@angular/core';
import {FormErrorPipe} from './form-error-pipes';

@Component({
  selector: 'fibo-form-field-errors',
  standalone: true,
  imports: [FormErrorPipe],
  template: `
    @if (control()?.cva?.hasError()) {
      @let errors = control().cva.ngControl?.control | formError;
      @for (error of errors; track error) {
        <div class="w-full text-red-400 text-xs pl-3">
          {{ error }}
        </div>
      }
    }
  `
})
export class FormFieldErrors {
  control = input<any>();
}
