import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {UserSelect} from '../user-select';
import {User, usersChoices} from '../../../common/form-data-example';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-select-custom-component',
  imports: [CommonModule, ReactiveFormsModule, UserSelect, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Custom component</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70">
        <app-user-select
          [users]="users"
          [formControl]="userCtrl"
          [label]="'Select User'"
          [placeholder]="'Choose a user'">
        </app-user-select>
      </div>
    </app-usage-demo>
  `,
})
export class CustomComponentSelectExampleComponent {
  readonly users: User[] = [...usersChoices];
  readonly userCtrl = new FormControl<number | null>(null);

  readonly codeBlocks = [
    { name: 'user-select.html', path: '/documentation/select/custom-component.html.md' },
    { name: 'user-select.ts', path: '/documentation/select/custom-component.ts.md' },
    { name: 'usage.html', path: '/documentation/select/custom-component-usage.html.md' },
    { name: 'usage.ts', path: '/documentation/select/custom-component-usage.ts.md' },
    { name: 'users.ts', path: '/documentation/select/users.ts.md' }
  ];
}


