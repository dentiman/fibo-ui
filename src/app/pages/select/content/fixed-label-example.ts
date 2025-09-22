import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Select} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';

@Component({
  selector: 'app-select-fixed-label',
  imports: [CommonModule, ReactiveFormsModule, Select],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="block mt-2">Fixed Label</span>
    <fibo-select [items]="items()" [formControl]="userCtrl" fixedLabel="Customer" [placeholder]="'Select Customer'"></fibo-select>
  `,
})
export class FixedLabelSelectExampleComponent {
  readonly items = signal<User[]>([...usersChoices]);
  readonly userCtrl = new FormControl<number | null>(null);
}


