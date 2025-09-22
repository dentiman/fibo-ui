import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Select} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';

@Component({
  selector: 'app-select-basic',
  imports: [CommonModule, ReactiveFormsModule, Select],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Basic select</h2>
    <div class="border-border-primary border-1  p-8 rounded-md rounded-b-none">
      <div class="mx-auto w-1/3">
        <fibo-select [formControl]="userCtrl" [items]="items()" [placeholder]="'Select User'"></fibo-select>
      </div>
    </div>
    <div class="border-border-primary border-1 px-8 py-2 bg-background-secondary -mt-1 ">
      <div class="mx-auto ">
                <button class="btn btn-sm rounded-full">Expand code</button>
      </div>
    </div>

  `,
})
export class BasicSelectExampleComponent {
  readonly items = signal<User[]>([...usersChoices]);
  readonly userCtrl = new FormControl<number | null>(null);

}


