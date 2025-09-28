import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MultipleSelect} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-multiple-select-floating-label',
  imports: [CommonModule, ReactiveFormsModule, MultipleSelect, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Floating label</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-90">
        <fibo-multiple-select [items]="items()" [label]="'Users'" [formControl]="usersCtrl"></fibo-multiple-select>
      </div>
    </app-usage-demo>
  `,
})
export class FloatingLabelMultipleSelectExampleComponent {
  readonly items = signal<User[]>([...usersChoices]);
  readonly usersCtrl = new FormControl<number[]>([]);

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/multiple-select/floating-label.html.md' },
    { name: 'ts', path: '/documentation/multiple-select/floating-label.ts.md' }
  ];
}
