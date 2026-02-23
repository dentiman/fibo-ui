import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Switch } from '@fibo-ui/components';

@Component({
  selector: 'switch-basic-example',
  imports: [Switch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 flex flex-wrap gap-4 p-8">
      <fibo-switch [checked]="false">Unchecked</fibo-switch>
      <fibo-switch [checked]="true">Checked</fibo-switch>
      <fibo-switch [checked]="true" [isLoading]="true">Loading</fibo-switch>
      <fibo-switch [checked]="true" [disabled]="true">Disabled</fibo-switch>
    </div>
  `,
})
export class SwitchBasicExample {}
