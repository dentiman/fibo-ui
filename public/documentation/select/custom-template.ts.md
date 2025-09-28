```ts
import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { users } from './users';

@Component({
  template: 'custom-template-example.html'
})
export class CustomTemplateSelectExample {
  // Extended user data with avatar and email for custom template
  readonly users = users;

  readonly userCtrl = new FormControl<number | null>(null);
}
```

