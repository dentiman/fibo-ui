```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserSelect } from '../user-select';
import { users } from './users';

@Component({
  selector: 'app-custom-component-example',
  imports: [CommonModule, ReactiveFormsModule, UserSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'usage.html',
})
export class CustomComponentExampleComponent {
  readonly users = users;
  readonly userCtrl = new FormControl<number | null>(null);
}
```
