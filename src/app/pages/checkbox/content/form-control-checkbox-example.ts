import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Checkbox} from '@fibo-ui/components';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-checkbox-form-control',
  imports: [CommonModule, ReactiveFormsModule, Checkbox, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Form control checkbox</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 space-y-4 p-8">
        <fibo-checkbox [formControl]="checkboxCtrl">
          I agree to the terms and conditions
        </fibo-checkbox>
        
        <div class="text-sm text-gray-600">
          Current value: {{ checkboxCtrl.value }}
        </div>
      </div>
    </app-usage-demo>
  `,
})
export class FormControlCheckboxExampleComponent {
  readonly checkboxCtrl = new FormControl<boolean>(false);

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/checkbox/form-control.html.md' },
    { name: 'ts', path: '/documentation/checkbox/form-control.ts.md' }
  ];
}
