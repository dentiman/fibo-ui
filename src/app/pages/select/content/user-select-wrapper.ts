import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {UserSelectComponent} from '../user-select';
import {User, usersChoices} from '../../../common/form-data-example';

@Component({
  selector: 'app-select-custom-component',
  imports: [CommonModule, ReactiveFormsModule, UserSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="block mt-2">Custom component</span>
    <app-user-select
      [users]="users"
      [formControl]="userCtrl"
      [label]="'Select User'"
      [placeholder]="'Choose a user'">
    </app-user-select>
  `,
})
export class CustomComponentSelectExampleComponent {
  readonly users: User[] = [...usersChoices];
  readonly userCtrl = new FormControl<number | null>(null);
}


