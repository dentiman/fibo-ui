import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Switch} from '@fibo-ui/components';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-switch-sizes',
  imports: [CommonModule, Switch, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Switch sizes</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-90 space-x-4">
        <fibo-switch [checked]="true" size="xs">
          Extra small switch
        </fibo-switch>

        <fibo-switch [checked]="true" size="sm">
          Small switch
        </fibo-switch>

        <fibo-switch [checked]="true" size="md">
          Medium switch
        </fibo-switch>

        <fibo-switch [checked]="true" size="lg">
          Large switch
        </fibo-switch>

        <fibo-switch [checked]="true" size="xl">
          Extra large switch
        </fibo-switch>
      </div>
    </app-usage-demo>
  `,
})
export class SwitchSizesExampleComponent {
  readonly codeBlocks = [
    { name: 'html', path: '/documentation/switch/switch-sizes.html.md' },
    { name: 'ts', path: '/documentation/switch/switch-sizes.ts.md' }
  ];
}
