```ts
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MultipleSelect } from '@fibo-ui/components';
import { users } from './users';

@Component({
  imports: [ReactiveFormsModule, MultipleSelect],
  template: 'fixed-label.html'
})
export class FixedLabelMultipleSelectComponent {
  readonly items = [
    { value: 1, label: 'Scott Johnson' },
    { value: 2, label: 'Mike Smith' },
    { value: 3, label: 'Emma Davis' },
    { value: 4, label: 'John Wilson' },
    { value: 5, label: 'Lisa Thompson' },
    { value: 6, label: 'David Miller' },
    { value: 7, label: 'Anna Lee' },
    { value: 8, label: 'James Brown' },
    { value: 9, label: 'Maria Clark' },
    { value: 10, label: 'Robert Lewis' }
  ];

  readonly usersCtrl = new FormControl<number[]>([]);
}
```
