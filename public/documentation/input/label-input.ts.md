```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Input } from '@fibo-ui/components';

@Component({
  imports: [ReactiveFormsModule, Input],
  template: 'styles-states.html'
})
export class StylesStatesInputComponent {
  readonly floatingLabelCtrl = new FormControl('');
  readonly fixedLabelCtrl = new FormControl('');
  readonly disabledCtrl = new FormControl('Disabled value');
  readonly errorCtrl = new FormControl('', [Validators.required]);
  
  readonly floatingLabelCtrl2 = new FormControl('');
  readonly fixedLabelCtrl2 = new FormControl('');
  readonly disabledCtrl2 = new FormControl('Disabled value');
  readonly errorCtrl2 = new FormControl('', [Validators.required]);
}
```
