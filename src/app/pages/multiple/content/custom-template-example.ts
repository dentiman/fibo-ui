import {ChangeDetectionStrategy, Component, TemplateRef, ViewChild, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MultipleSelect} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-multiple-select-custom-template',
  imports: [CommonModule, ReactiveFormsModule, MultipleSelect, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Custom template</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-120 p-8">
        <fibo-multiple-select
          [items]="users"
          [formControl]="usersCtrl"
          [label]="'Select Users'"
          [placeholder]="'Choose users'"
          [valueProp]="'id'"
          [labelProp]="'name'"
          [itemTemplate]="userTemplate"
          [selectedItemTemplate]="selectedUserTemplate">
        </fibo-multiple-select>

        <ng-template #userTemplate let-user let-isSelected="isSelected">
          <div class="flex items-center gap-3">
            <img
              [src]="user.avatar"
              [alt]="user.name"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-medium truncate"
                    [class.text-white]="isSelected"
                    [class.text-gray-900]="!isSelected"
                    [class.dark:text-gray-100]="!isSelected">{{ user.name }}</span>
              <span class="text-xs truncate"
                    [class.text-primary-50]="isSelected"
                    [class.text-gray-500]="!isSelected"
                    [class.dark:text-gray-400]="!isSelected">
                {{ user.email }}
              </span>
            </div>
          </div>
        </ng-template>

        <ng-template #selectedUserTemplate let-user>
          <div class="flex items-center gap-1">
            <img
              [src]="user.avatar"
              [alt]="user.name"
              class="size-5 rounded-full object-cover"
            />
            <span class="text-xs font-medium text-foreground">{{ user.name }}</span>
          </div>
        </ng-template>
      </div>
    </app-usage-demo>
  `,
})
export class CustomTemplateMultipleSelectExampleComponent {
  readonly users: User[] = [...usersChoices];
  readonly usersCtrl = new FormControl<number[]>([1, 2]);

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/multiple-select/custom-template.html.md' },
    { name: 'ts', path: '/documentation/multiple-select/custom-template.ts.md' },
    { name: 'users.ts', path: '/documentation/select/users.ts.md' }
  ];
}
