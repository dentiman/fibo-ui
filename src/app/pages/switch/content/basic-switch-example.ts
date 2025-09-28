import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Switch} from '@fibo-ui/components';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-switch-basic',
  imports: [CommonModule, Switch, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Basic switch</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-90 space-x-4">
        <fibo-switch [checked]="false">
          Unchecked
        </fibo-switch>

        <fibo-switch [checked]="true">
          Checked
        </fibo-switch>

        <fibo-switch [checked]="true" [isLoading]="true">
          Loading
        </fibo-switch>

        <fibo-switch [checked]="true" [disabled]="true">
          Disabled
        </fibo-switch>
      </div>
    </app-usage-demo>
  `,
})
export class BasicSwitchExampleComponent {
  readonly codeBlocks = [
    { name: 'html', path: '/documentation/switch/basic-switch.html.md' },
    { name: 'ts', path: '/documentation/switch/basic-switch.ts.md' }
  ];
}
