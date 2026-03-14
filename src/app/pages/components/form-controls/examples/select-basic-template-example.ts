import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { DataList, DataListItem, DataListKeyboardBridge, KeyboardTarget, Popover, PopoverTriggerToggle, SelectOne } from '@fibo-ui/cdk';
import { fieldErrorMessage, FormFieldControl, SelectItem } from '@fibo-ui/components';

interface UserModel {
  role: string | null;
}

@Component({
  selector: 'select-basic-template-example',
  imports: [
    FormField,
    FormFieldControl,
    PopoverTriggerToggle,
    Popover,
    DataList,
    DataListKeyboardBridge,
    DataListItem,
    KeyboardTarget,
    SelectOne,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-form-field-control
        fiboKeyboardTarget
        fiboPopoverTriggerToggle
        #keyboardTarget="KeyboardTarget"
        [content]="roleTpl"
        [formField]="userForm.role"
        label="User Role"
        iconEnd="chevron-down"
      >
        <div class="text-sm" [class.from-field-placeholder]="!roleLabel()">
          {{ roleLabel() || 'Select Role' }}
        </div>
      </fibo-form-field-control>
      @if (roleError(); as error) {
        <div class="form-field-error">{{ error }}</div>
      }
      <ng-template #roleTpl let-trigger>
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
          @for (item of roles; track item.value) {
            <a fiboDataListItem [value]="item.value" class="datalist-item">
              {{ item.label }}
            </a>
          }
        </div>
      </ng-template>
    </div>
  `,
})
export class SelectBasicTemplateExample {
  readonly roles: SelectItem[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
    { label: 'Guest', value: 'guest' },
  ];

  readonly user = signal<UserModel>({ role: null });
  readonly userForm = form(this.user);
  readonly roleError = fieldErrorMessage(this.userForm.role);

  readonly roleLabel = computed(() => {
    const v = this.userForm.role().value();
    if (v === null) return null;
    return this.roles.find((i) => i.value === v)?.label || null;
  });
}
