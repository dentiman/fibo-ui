import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import {
  DataList,
  DataListKeyboardBridge,
  DataListItem,
  Popover,
  KeyboardTarget,
  SelectOne,
  FormFieldTrigger,
} from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';

interface UserModel {
  role: string;
}

@Component({
  selector: 'select-basic-example',
  imports: [
    FormField,
    FormFieldTrigger,
    DataList,
    DataListKeyboardBridge,
    KeyboardTarget,
    Popover,
    SelectOne,
    DataListItem,
    LucideAngularModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <button
        type="button"
        fiboKeyboardTarget
        #keyboardTarget="KeyboardTarget"
        fiboFormFieldTrigger [content]="selectTpl"
        [formField]="userForm.role"
        class="w-full form-field-control flex items-center gap-2 text-left"
      >
        <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
          <label class="form-field-label mt-1">User Role</label>
          @let role = user().role;
          <div class="text-sm" [class.from-field-placeholder]="!role">
            {{ role || 'Select Role' }}
          </div>
        </div>
        <lucide-icon
          name="chevron-down"
          size="16"
          class="form-field-icon form-field-icon-end shrink-0"
        ></lucide-icon>
      </button>
      <ng-template #selectTpl let-trigger>
        <div
          fiboPopover
          [matchWidth]="true"
          #popover="Popover"
          fiboDataList
          [fiboDataListKeyboardBridge]="keyboardTarget"
          (itemTriggered)="popover.close()"
          fiboSelectOne
          [(value)]="userForm.role().value"
          class="popover-container"
        >
          @for (role of userRoles; track role) {
            <a fiboDataListItem [value]="role" class="datalist-item">
              <span class="block truncate font-normal">{{ role }}</span>
            </a>
          }
        </div>
      </ng-template>
    </div>
  `,
})
export class SelectBasicExample {
  readonly user = signal<UserModel>({ role: '' });
  readonly userForm = form(this.user);
  readonly userRoles = ['admin', 'user', 'guest'];
}
