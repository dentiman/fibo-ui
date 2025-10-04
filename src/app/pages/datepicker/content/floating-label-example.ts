import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Datepicker} from '@fibo-ui/components';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-datepicker-floating-label',
  imports: [CommonModule, ReactiveFormsModule, Datepicker, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Floating label</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 p-8">
        <fibo-datepicker [formControl]="dateCtrl" [label]="'Start Date'"></fibo-datepicker>
      </div>
    </app-usage-demo>
  `,
})
export class FloatingLabelDatepickerExampleComponent {
  readonly dateCtrl = new FormControl<string>('2024-07-02');

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/datepicker/floating-label.html.md' },
    { name: 'ts', path: '/documentation/datepicker/floating-label.ts.md' }
  ];
}
