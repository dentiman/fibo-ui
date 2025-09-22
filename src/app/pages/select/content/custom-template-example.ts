import {ChangeDetectionStrategy, Component, TemplateRef, ViewChild, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Select} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';

@Component({
  selector: 'app-select-custom-template',
  imports: [CommonModule, ReactiveFormsModule, Select],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="block mt-2"> Custom Template for Select item</span>
    <fibo-select
      [items]="users"
      [formControl]="userCtrl"
      [label]="'Select User'"
      [placeholder]="'Choose a user'"
      [valueProp]="'value'"
      [labelProp]="'label'"
      [itemTemplate]="userTemplate">
    </fibo-select>

    <ng-template #userTemplate let-user let-isSelected="isSelected">
      <div class="flex items-center gap-3">
        <img
          [src]="user.avatar"
          [alt]="user.username"
          class="w-8 h-8 rounded-full object-cover"
        />
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-medium truncate"
                [class.text-white]="isSelected"
                [class.text-gray-900]="!isSelected"
                [class.dark:text-gray-100]="!isSelected">{{ user.username }}</span>
          <span class="text-xs truncate"
                [class.text-primary-50]="isSelected"
                [class.text-gray-500]="!isSelected"
                [class.dark:text-gray-400]="!isSelected">
            {{ user.email }}
          </span>
        </div>
      </div>
    </ng-template>
  `,
})
export class CustomTemplateSelectExampleComponent {
  readonly users: User[] = [...usersChoices];
  readonly userCtrl = new FormControl<number | null>(null);
}


