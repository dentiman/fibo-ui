import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Select, SelectItem } from '@fibo-ui/components';

@Component({
  selector: 'select-recipe-example',
  imports: [Select, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-select
        [formField]="form.role"
        label="User Role"
        placeholder="Select role"
        [items]="roles"
      />
    </div>
  `,
})
export class SelectRecipeExample {
  readonly roles: SelectItem[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
    { label: 'Guest', value: 'guest' },
  ];

  readonly model = signal({ role: null as string | null });
  readonly form = form(this.model);
}
