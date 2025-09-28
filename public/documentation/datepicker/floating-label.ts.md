```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Datepicker } from '@fibo-ui/components';

@Component({
  imports: [ReactiveFormsModule, Datepicker],
  template: 'floating-label.html'
})
export class FloatingLabelDatepickerComponent {
  readonly dateCtrl = new FormControl<string>('2024-07-02');
}
```
