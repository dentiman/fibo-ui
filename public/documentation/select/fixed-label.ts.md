```ts
import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  template: 'fixed-label-example.html'
})
export class FixedLabelSelectExample {
  // Default select items properties: value, label
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

  readonly userCtrl = new FormControl<number | null>(null);
}
```

