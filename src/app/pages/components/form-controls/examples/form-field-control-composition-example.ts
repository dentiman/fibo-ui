import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { TextField, Select, SelectItem } from '@fibo-ui/components';

@Component({
  selector: 'form-field-control-composition-example',
  imports: [FormField, TextField, Select],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-text-field
        [formField]="profileForm.fullName"
        label="Full name"
        iconStart="user"
        placeholder="Enter your name"
      />

      <fibo-text-field
        [formField]="profileForm.email"
        label="Email"
        iconStart="mail"
        placeholder="Enter email"
      />

      <fibo-select
        [formField]="profileForm.role"
        label="Role"
        placeholder="Select a role"
        [items]="roles"
      />
    </div>
  `,
})
export class FormFieldControlCompositionExample {
  readonly roles: SelectItem[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
  ];

  readonly profileModel = signal({
    fullName: '',
    email: '',
    role: null as string | null,
  });

  readonly profileForm = form(this.profileModel, schemaPath => {
    required(schemaPath.fullName, { message: 'Name is required' });
    required(schemaPath.email, { message: 'Email is required' });
  });
}
