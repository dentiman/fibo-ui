import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormFieldControl } from '@fibo-ui/components';

@Component({
  selector: 'form-field-control-basic-example',
  imports: [FormFieldControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-form-field-control label="Username">
        <input type="text" placeholder="Enter username" class="text-field-input" />
      </fibo-form-field-control>

      <fibo-form-field-control label="Email" iconStart="mail">
        <input type="email" placeholder="Enter email" class="text-field-input" />
      </fibo-form-field-control>

      <fibo-form-field-control label="Search" iconStart="search" iconEnd="arrow-right">
        <input type="text" placeholder="Search..." class="text-field-input" />
      </fibo-form-field-control>
    </div>
  `,
})
export class FormFieldControlBasicExample {}
