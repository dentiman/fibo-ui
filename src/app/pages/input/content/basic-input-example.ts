import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Input} from '@fibo-ui/components';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-input-basic',
  imports: [CommonModule, ReactiveFormsModule, Input, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Basic input</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 space-y-4">
        <fibo-input
          [formControl]="inputCtrl"
          [placeholder]="'Enter your name'">
        </fibo-input>
        
        <div class="text-sm text-gray-600">
          Current value: {{ inputCtrl.value }}
        </div>
      </div>
    </app-usage-demo>
  `,
})
export class BasicInputExampleComponent {
  readonly inputCtrl = new FormControl('');

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/input/basic-input.html.md' },
    { name: 'ts', path: '/documentation/input/basic-input.ts.md' }
  ];
}
