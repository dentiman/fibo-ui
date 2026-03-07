import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { DataList, DataListItem, Popover, PopoverTriggerToggle, SelectOne } from '@fibo-ui/cdk';
import { fieldErrorMessage, FormFieldControl, SelectItem } from '@fibo-ui/components';

interface ContactData {
  name: string;
  role: string | null;
}

@Component({
  selector: 'form-field-control-signal-form-example',
  imports: [
    FormField,
    FormFieldControl,
    PopoverTriggerToggle,
    Popover,
    DataList,
    DataListItem,
    SelectOne,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-form-field-control
        [formField]="contactForm.name"
        [clearValue]="''"
        label="Name"
        iconEnd="user"
      >
        <input
          [formField]="contactForm.name"
          type="text"
          placeholder="Enter full name"
          class="text-field-input"
        />
      </fibo-form-field-control>
      @if (nameError(); as error) {
        <div class="form-field-error">{{ error }}</div>
      }

      <fibo-form-field-control
        fiboPopoverTriggerToggle
        [content]="roleTpl"
        [formField]="contactForm.role"
        label="Role"
        iconEnd="chevron-down"
      >
        <div class="text-sm" [class.from-field-placeholder]="!roleLabel()">
          {{ roleLabel() || 'Select role' }}
        </div>
      </fibo-form-field-control>
      @if (roleError(); as error) {
        <div class="form-field-error">{{ error }}</div>
      }
      <ng-template #roleTpl let-trigger>
        <div
          fiboPopover
          [trigger]="trigger"
          [matchWidth]="true"
          fiboDataList
          (itemTriggered)="trigger.close()"
          fiboSelectOne
          [(value)]="contactForm.role().value"
          class="popover-container"
        >
          @for (item of roles; track item.value) {
            <a fiboDataListItem [value]="item.value" class="datalist-item">
              {{ item.label }}
            </a>
          }
        </div>
      </ng-template>

      <button
        type="button"
        class="btn btn-primary w-full"
        [disabled]="!contactForm().valid()"
        (click)="onSubmit()"
      >
        Submit
      </button>
    </div>
  `,
})
export class FormFieldControlSignalFormExample {
  readonly roles: SelectItem[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
  ];

  readonly model = signal<ContactData>({
    name: '',
    role: null,
  });

  readonly contactForm = form(this.model, (schema) => {
    required(schema.name, { message: 'Name is required' });
    required(schema.role, { message: 'Role is required' });
  });
  readonly nameError = fieldErrorMessage(this.contactForm.name);
  readonly roleError = fieldErrorMessage(this.contactForm.role);

  readonly roleLabel = computed(() => {
    const v = this.contactForm.role().value();
    if (v === null) return null;
    return this.roles.find((i) => i.value === v)?.label || null;
  });

  onSubmit() {
    console.log('Contact data:', this.model());
  }
}
