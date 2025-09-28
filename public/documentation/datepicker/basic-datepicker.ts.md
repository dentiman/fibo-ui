```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Datepicker } from '@fibo-ui/components';

@Component({
  imports: [ReactiveFormsModule, Datepicker],
  template: 'basic-datepicker.html'
})
export class BasicDatepickerComponent {
  readonly dateCtrl = new FormControl<string>('2024-07-02');
}
```
