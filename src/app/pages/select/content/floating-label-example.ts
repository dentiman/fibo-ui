import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Select} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-select-floating-label',
  imports: [CommonModule, ReactiveFormsModule, Select, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Floating label</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 p-8">
        <fibo-select [items]="items()" [label]="'User'" [formControl]="userCtrl"></fibo-select>
      </div>
    </app-usage-demo>
  `,
})
export class FloatingLabelSelectExampleComponent {
  readonly items = signal<User[]>([...usersChoices]);
  readonly userCtrl = new FormControl<number | null>(null);

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/select/floating-label.html.md' },
    { name: 'ts', path: '/documentation/select/floating-label.ts.md' }
  ];
}


