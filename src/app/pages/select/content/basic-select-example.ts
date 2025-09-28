import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Select} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-select-basic',
  imports: [CommonModule, ReactiveFormsModule, Select, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Basic select</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70">
        <fibo-select [formControl]="userCtrl" [items]="items()" [placeholder]="'Select User'"></fibo-select>
      </div>
    </app-usage-demo>
  `,
})
export class BasicSelectExampleComponent {
  readonly items = signal<User[]>([...usersChoices]);
  readonly userCtrl = new FormControl<number | null>(null);

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/select/basic-select.html.md' },
    { name: 'ts', path: '/documentation/select/basic-select.ts.md' }
  ];
}


