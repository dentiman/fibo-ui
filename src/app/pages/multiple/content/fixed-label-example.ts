import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MultipleSelect} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-multiple-select-fixed-label',
  imports: [CommonModule, ReactiveFormsModule, MultipleSelect, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Fixed label</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-90">
        <fibo-multiple-select [items]="items()" [formControl]="usersCtrl" fixedLabel="Customers" [placeholder]="'Select Customers'"></fibo-multiple-select>
      </div>
    </app-usage-demo>
  `,
})
export class FixedLabelMultipleSelectExampleComponent {
  readonly items = signal<User[]>([...usersChoices]);
  readonly usersCtrl = new FormControl<number[]>([]);

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/multiple-select/fixed-label.html.md' },
    { name: 'ts', path: '/documentation/multiple-select/fixed-label.ts.md' }
  ];
}
