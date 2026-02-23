import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormFieldControl } from '@fibo-ui/components';

@Component({
  selector: 'form-field-control-states-example',
  imports: [FormFieldControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-form-field-control label="Disabled" [disabled]="true" iconStart="lock">
        <input type="text" placeholder="Cannot edit" disabled class="text-field-input" />
      </fibo-form-field-control>

      <fibo-form-field-control label="Required" [required]="true">
        <input type="text" placeholder="This field is required" class="text-field-input" />
      </fibo-form-field-control>

      <fibo-form-field-control label="Error state" [invalid]="true" [touched]="true">
        <input type="text" value="bad value" class="text-field-input" />
      </fibo-form-field-control>
    </div>
  `,
})
export class FormFieldControlStatesExample {}
