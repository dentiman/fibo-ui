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
                  class="w-full form-field-control flex items-center gap-2 text-left">
            <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
              <label class="form-field-label mt-1">User Role</label>
              @let role = user().role;
              <div class="text-sm" [class.from-field-placeholder]="!role">{{ role || 'Select Role' }}</div>
            </div>
            <lucide-icon name="chevron-down" size="16" class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>

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
