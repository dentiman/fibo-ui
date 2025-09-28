```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Input } from '@fibo-ui/components';

@Component({
  imports: [ReactiveFormsModule, Input],
  template: 'basic-input.html'
})
export class BasicInputComponent {
  readonly inputCtrl = new FormControl('');
}
```
