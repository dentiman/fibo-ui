import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form } from '@angular/forms/signals';
import {
  DataList,
  Option,
  Popover,
  PortalContent,
  SelectOne,
  FormFieldTrigger
} from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';
import { UsageDemo } from '../../common/usage-demo';

interface UserModel {
  role: string;
}

@Component({
  selector: 'app-select-page',
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    FormFieldTrigger,
    DataList,
    Popover,
    PortalContent,
    SelectOne,
    Option,
    LucideAngularModule,
    UsageDemo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 flex flex-col space-y-12">
      <h2 class="text-foreground">Basic select</h2>
      <app-usage-demo [codeBlocks]="codeBlocks">
        <div class="mx-auto w-90 p-8">
          <button type="button" fiboFormFieldTrigger [formField]="userForm.role"
                  class="w-full group fibo-form-field px-3 py-1 flex flex-col justify-center relative text-left">
            <label class="block text-xs fibo-form-field-label">User Role</label>
            @let role = user().role;
            <div class="text-sm" [class.from-field-placeholder]="!role">{{ role || 'Select Role' }}</div>
            <div class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2">
              <lucide-icon name="chevron-down" size="16" class="text-foreground-tertiary"></lucide-icon>
            </div>

            <div *fiboPortalContent="let trigger"
                 fiboPopover [trigger]="trigger" [matchWidth]="true"
                 fiboDataList (optionTriggered)="trigger.close()"
                 fiboSelectOne [(value)]="userForm.role().value"
                 class="popover-container">
                @for (role of userRoles; track role) {
                  <a fiboOption [value]="role" class="datalist-item">
                    <span class="block truncate font-normal">{{ role }}</span>
                  </a>
                }
            </div>
          </button>
        </div>
      </app-usage-demo>
    </div>
  `
})
export class SelectPageComponent {
  readonly user = signal<UserModel>({
    role: ''
  });

  readonly userForm = form(this.user);

  readonly userRoles = ['admin', 'user', 'guest'];

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/select/basic-select.html.md' },
    { name: 'ts', path: '/documentation/select/basic-select.ts.md' }
  ];
}
