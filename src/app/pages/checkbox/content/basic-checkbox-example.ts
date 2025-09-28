import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Checkbox} from '@fibo-ui/components';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-checkbox-basic',
  imports: [CommonModule, Checkbox, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Basic checkbox</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 space-y-4">
        <fibo-checkbox [checked]="false">
          Unchecked
        </fibo-checkbox>
        
        <fibo-checkbox [checked]="true">
          Checked
        </fibo-checkbox>
        
        <fibo-checkbox [indeterminate]="true">
          Indeterminate
        </fibo-checkbox>
        
        <fibo-checkbox [checked]="true" [disabled]="true">
          Disabled
        </fibo-checkbox>
      </div>
    </app-usage-demo>
  `,
})
export class BasicCheckboxExampleComponent {
  readonly codeBlocks = [
    { name: 'html', path: '/documentation/checkbox/basic-checkbox.html.md' },
    { name: 'ts', path: '/documentation/checkbox/basic-checkbox.ts.md' }
  ];
}
