```ts
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form, required} from '@angular/forms/signals';
import {FormField} from '@fibo-ui/components';
import {FiboInput} from '@fibo-ui/cdk';
import {FieldLabel} from '@fibo-ui/components';

@Component({
  selector: 'app-input-basic',
  imports: [CommonModule, Field, FormField, FiboInput, FieldLabel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'basic.html'
})
export class InputBasicExampleComponent {
  userModel = signal({
    username: ''
  });

  userForm = form(this.userModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required' });
  });
}
```
