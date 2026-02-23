import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Select, SelectItem } from '@fibo-ui/components';

@Component({
  selector: 'select-component-example',
  imports: [Select, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-select
        [formField]="registrationForm.role"
        label="User Role"
        placeholder="Select role"
        [items]="roles"
      />
    </div>
  `,
})
export class SelectComponentExample {
  readonly roles: SelectItem[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
    { label: 'Guest', value: 'guest' },
  ];

  readonly user = signal({ role: null as string | null });
  readonly registrationForm = form(this.user);
}
