import {ChangeDetectionStrategy, Component, TemplateRef, ViewChild, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Select} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-select-custom-template',
  imports: [CommonModule, ReactiveFormsModule, Select, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Custom template</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 p-8">
        <fibo-select
          [items]="users"
          [formControl]="userCtrl"
          [label]="'Select User'"
          [placeholder]="'Choose a user'"
          [valueProp]="'id'"
          [labelProp]="'name'"
          [itemTemplate]="userTemplate">
        </fibo-select>

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
      </div>
    </app-usage-demo>
  `,
})
export class CustomTemplateSelectExampleComponent {
  readonly users: User[] = [...usersChoices];
  readonly userCtrl = new FormControl<number | null>(1);

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/select/custom-template.html.md' },
    { name: 'ts', path: '/documentation/select/custom-template.ts.md' }
  ];
}


