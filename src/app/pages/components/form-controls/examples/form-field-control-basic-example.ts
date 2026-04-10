import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldShell, FieldInteractiveDirective } from '@fibo-ui/components';

@Component({
  selector: 'form-field-control-basic-example',
  imports: [FieldShell, FieldInteractiveDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-field-shell label="Username">
        <input fiboFieldInteractive type="text" placeholder="Enter username" class="text-field-input" />
      </fibo-field-shell>

      <fibo-field-shell label="Email" iconStart="mail">
        <input fiboFieldInteractive type="email" placeholder="Enter email" class="text-field-input" />
      </fibo-field-shell>

      <fibo-field-shell label="Search" iconStart="search" iconEnd="arrow-right">
        <input fiboFieldInteractive type="text" placeholder="Search..." class="text-field-input" />
      </fibo-field-shell>

      <div class="ff-label-inline ff-density-compact">
        <fibo-field-shell label="Role" iconEnd="chevron-down">
          <div class="text-sm from-field-placeholder">Select role</div>
        </fibo-field-shell>
      </div>
    </div>
  `,
})
export class FormFieldControlBasicExample {}
