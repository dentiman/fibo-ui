import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Switch } from '@fibo-ui/components';

@Component({
  selector: 'switch-sizes-example',
  imports: [Switch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 flex flex-wrap gap-4 p-8">
      <fibo-switch [checked]="true" size="xs">Extra small</fibo-switch>
      <fibo-switch [checked]="true" size="sm">Small</fibo-switch>
      <fibo-switch [checked]="true" size="md">Medium</fibo-switch>
      <fibo-switch [checked]="true" size="lg">Large</fibo-switch>
      <fibo-switch [checked]="true" size="xl">Extra large</fibo-switch>
    </div>
  `,
})
export class SwitchSizesExample {}
