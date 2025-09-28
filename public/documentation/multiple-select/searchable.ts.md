```ts
import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MultipleSelect, MultipleSelectInput } from '@fibo-ui/components';
import { users } from './users';

@Component({
  imports: [ReactiveFormsModule, MultipleSelect, MultipleSelectInput],
  template: 'searchable.html'
})
export class SearchableMultipleSelectComponent {
  readonly usersCtrl = new FormControl<number[]>([]);
  readonly searchText = signal('');

  readonly items = users;

  readonly filteredItems = computed(() => {
    const searchText = this.searchText().toLowerCase();
    return this.items.filter((user) =>
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText)
    );
  });

  onValueChange(value: string) {
    this.searchText.set(value);
  }
}
```
