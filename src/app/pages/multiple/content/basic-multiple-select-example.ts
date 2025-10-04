import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MultipleSelect} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-multiple-select-basic',
  imports: [CommonModule, ReactiveFormsModule, MultipleSelect, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Basic multiple select</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-90 p-8">
        <fibo-multiple-select [formControl]="usersCtrl" [items]="items()" [placeholder]="'Select Users'"></fibo-multiple-select>
      </div>
    </app-usage-demo>
  `,
})
export class BasicMultipleSelectExampleComponent {
  readonly items = signal<User[]>([...usersChoices]);
  readonly usersCtrl = new FormControl<number[]>([1,2,3]);

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/multiple-select/basic-multiple-select.html.md' },
    { name: 'ts', path: '/documentation/multiple-select/basic-multiple-select.ts.md' }
  ];
}
