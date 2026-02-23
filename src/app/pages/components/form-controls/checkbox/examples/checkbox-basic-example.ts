import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Checkbox } from '@fibo-ui/components';

@Component({
  selector: 'checkbox-basic-example',
  imports: [Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-70 space-y-4 p-8">
      <fibo-checkbox [checked]="false">Unchecked</fibo-checkbox>
      <fibo-checkbox [checked]="true">Checked</fibo-checkbox>
      <fibo-checkbox [indeterminate]="true">Indeterminate</fibo-checkbox>
      <fibo-checkbox [checked]="true" [disabled]="true">Disabled</fibo-checkbox>
    </div>
  `,
})
export class CheckboxBasicExample {}
