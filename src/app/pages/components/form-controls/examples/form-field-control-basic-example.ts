import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldShell, FieldTarget, FieldContext } from '@fibo-ui/components';

@Component({
  selector: 'form-field-control-basic-example',
  imports: [FieldShell, FieldTarget, FieldContext],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-field-shell label="Username">
        <input fiboFieldTarget type="text" placeholder="Enter username" class="fibo-field-input" />
      </fibo-field-shell>

      <fibo-field-shell label="Email" iconStart="mail">
        <input fiboFieldTarget type="email" placeholder="Enter email" class="fibo-field-input" />
      </fibo-field-shell>

      <fibo-field-shell label="Search" iconStart="search" iconEnd="arrow-right">
        <input fiboFieldTarget type="text" placeholder="Search..." class="fibo-field-input" />
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
