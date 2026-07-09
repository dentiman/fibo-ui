import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldShell } from '@fibo-ui/components';

@Component({
  selector: 'field-shell-example',
  imports: [FieldShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-field-shell label="Label" hint="Helper text below the field" />

      <fibo-field-shell
        label="With icons"
        hint="Leading and trailing icons"
        iconStart="user"
        iconEnd="check"
      />

      <fibo-field-shell
        label="Clearable"
        hint="Shows the clear button"
        iconStart="search"
        [canClear]="true"
      />
    </div>
  `,
})
export class FieldShellExample {}
