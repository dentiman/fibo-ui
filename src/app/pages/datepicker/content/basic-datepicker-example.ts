import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Datepicker} from '@fibo-ui/components';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-datepicker-basic',
  imports: [CommonModule, ReactiveFormsModule, Datepicker, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Basic datepicker</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70">
        <fibo-datepicker [formControl]="dateCtrl"></fibo-datepicker>
      </div>
    </app-usage-demo>
  `,
})
export class BasicDatepickerExampleComponent {
  readonly dateCtrl = new FormControl<string>('2024-07-02');

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/datepicker/basic-datepicker.html.md' },
    { name: 'ts', path: '/documentation/datepicker/basic-datepicker.ts.md' }
  ];
}
