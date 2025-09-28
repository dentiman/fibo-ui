```ts
import { Component, TemplateRef, ViewChild, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MultipleSelect } from '@fibo-ui/components';
import { users } from './users';

@Component({
  imports: [ReactiveFormsModule, MultipleSelect],
  template: 'custom-template.html'
})
export class CustomTemplateMultipleSelectComponent {
  readonly users = users;
  readonly usersCtrl = new FormControl<number[]>([1, 2]);
}
```
