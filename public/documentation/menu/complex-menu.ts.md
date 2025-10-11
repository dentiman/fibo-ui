```ts
import { Component, computed } from '@angular/core';

@Component({
  template: 'menu-page.html'
})
export class ComplexMenuExample {
  // Provided via component in real usage
  readonly items = computed(() => []);
}
```


