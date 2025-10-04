import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MultipleSelect, MultipleSelectInput} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-multiple-select-searchable',
  imports: [CommonModule, ReactiveFormsModule, MultipleSelect, MultipleSelectInput, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Searchable multiple select</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-90 p-8">
        <fibo-multiple-select
          [items]="filteredItems()"
          [label]="'Users'"
          [formControl]="usersCtrl">
          <input
            type="text"
            fiboMultipleSelectInput
            [placeholder]="'Search users...'"
            (valueChange)="onValueChange($event)">
        </fibo-multiple-select>
      </div>
    </app-usage-demo>
  `,
})
export class SearchableMultipleSelectExampleComponent {
  readonly usersCtrl = new FormControl<number[]>([]);
  readonly searchText = signal('');

  readonly items = signal<User[]>([...usersChoices]);

  readonly filteredItems = computed(() => {
    const searchText = this.searchText().toLowerCase();
    return this.items().filter((user: User) =>
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText)
    );
  });

  onValueChange(value: string) {
    this.searchText.set(value);
  }

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/multiple-select/searchable.html.md' },
    { name: 'ts', path: '/documentation/multiple-select/searchable.ts.md' }
  ];
}
