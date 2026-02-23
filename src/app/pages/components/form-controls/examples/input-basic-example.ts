import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormFieldControl } from '@fibo-ui/components';

@Component({
  selector: 'input-basic-example',
  imports: [FormFieldControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-70 p-8">
      <form class="space-y-4">
        <fibo-form-field-control label="Username" iconStart="user">
          <input type="text" placeholder="Enter username" class="text-field-input" />
        </fibo-form-field-control>

        <fibo-form-field-control label="Password" iconStart="lock">
          <input type="password" placeholder="Enter password" class="text-field-input" />
        </fibo-form-field-control>
      </form>
    </div>
  `,
})
export class InputBasicExample {}
