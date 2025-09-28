```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Checkbox } from '@fibo-ui/components';

@Component({
  imports: [ReactiveFormsModule, Checkbox],
  template: 'form-control.html'
})
export class FormControlCheckboxComponent {
  readonly checkboxCtrl = new FormControl<boolean>(false);
}
```
