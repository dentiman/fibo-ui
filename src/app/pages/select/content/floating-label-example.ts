import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Select} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';

@Component({
  selector: 'app-select-floating-label',
  imports: [CommonModule, ReactiveFormsModule, Select],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="block mt-2">Floating label</span>
    <fibo-select [items]="items()" [label]="'User'" [formControl]="userCtrl"></fibo-select>
  `,
})
export class FloatingLabelSelectExampleComponent {
  readonly items = signal<User[]>([...usersChoices]);
  readonly userCtrl = new FormControl<number | null>(null);
}


