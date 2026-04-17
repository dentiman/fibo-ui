import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldShell, FieldInput, FieldContext } from '@fibo-ui/components';

@Component({
  selector: 'form-field-control-basic-example',
  imports: [FieldShell, FieldInput, FieldContext],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-field-shell label="Username">
        <input fiboFieldInput type="text" placeholder="Enter username" />
      </fibo-field-shell>

      <fibo-field-shell label="Email" iconStart="mail">
        <input fiboFieldInput type="email" placeholder="Enter email" />
      </fibo-field-shell>

      <fibo-field-shell label="Search" iconStart="search" iconEnd="arrow-right">
        <input fiboFieldInput type="text" placeholder="Search..." />
      </fibo-field-shell>

      <div fiboFieldContext labelLayout="inline" density="compact">
        <fibo-field-shell label="Role" iconEnd="chevron-down">
          <div class="text-sm fibo-field-placeholder">Select role</div>
        </fibo-field-shell>
      </div>
    </div>
  `,
})
export class FormFieldControlBasicExample {}
