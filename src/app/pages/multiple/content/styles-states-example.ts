import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MultipleSelect} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-multiple-select-style-states',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultipleSelect, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Styles and states</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto grid grid-cols-2 gap-8">
        <!-- Column 1: Default style -->
        <div class="space-y-6 p-8">
          <fibo-multiple-select
            [items]="items()"
            [formControl]="floatingLabelCtrl"
            [label]="'Floating Label'">
          </fibo-multiple-select>

          <fibo-multiple-select
            [items]="items()"
            [formControl]="fixedLabelCtrl"
            [placeholder]="'Select options'"
            [fixedLabel]="'Fixed Label'">
          </fibo-multiple-select>

          <fibo-multiple-select
            [items]="items()"
            [formControl]="disabledCtrl"
            [label]="'Disabled Multiple Select'"
            [placeholder]="'This is disabled'"
            >
          </fibo-multiple-select>

          <fibo-multiple-select
            [items]="items()"
            [formControl]="errorCtrl"
            [label]="'Multiple Select with Error'"
            [placeholder]="'Required field'">
          </fibo-multiple-select>
        </div>

        <!-- Column 2: Secondary style -->
        <div class="bg-background-secondary outline-0  rounded-tr-md  p-8 space-y-6">
          <fibo-multiple-select
            [items]="items()"
            [formControl]="floatingLabelCtrl2"
            [label]="'Floating Label'"
            [appearance]="'secondary'">
          </fibo-multiple-select>

          <fibo-multiple-select
            [items]="items()"
            [formControl]="fixedLabelCtrl2"
            [placeholder]="'Select options'"
            [fixedLabel]="'Fixed Label'"
            [appearance]="'secondary'">
          </fibo-multiple-select>

          <fibo-multiple-select
            [items]="items()"
            [formControl]="disabledCtrl2"
            [label]="'Disabled Multiple Select'"
            [placeholder]="'This is disabled'"
            [appearance]="'secondary'">
          </fibo-multiple-select>

          <fibo-multiple-select
            [items]="items()"
            [formControl]="errorCtrl2"
            [label]="'Multiple Select with Error'"
            [placeholder]="'Required field'"
            [appearance]="'secondary'">
          </fibo-multiple-select>
        </div>
      </div>
    </app-usage-demo>
  `,
})
export class StylesStatesMultipleSelectExampleComponent {
  readonly items = signal<User[]>([...usersChoices]);

  readonly floatingLabelCtrl = new FormControl<number[]>([]);
  readonly fixedLabelCtrl = new FormControl<number[]>([]);
  readonly disabledCtrl = new FormControl<number[] | null>({ value: [1,2,3], disabled: true });
  readonly errorCtrl = new FormControl<number[]>([], [Validators.required]);

  readonly floatingLabelCtrl2 = new FormControl<number[]>([]);
  readonly fixedLabelCtrl2 = new FormControl<number[]>([]);
  readonly disabledCtrl2 = new FormControl<number[] | null>({ value: [], disabled: true });
  readonly errorCtrl2 = new FormControl<number[]>([], [Validators.required]);

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/multiple-select/styles-states.html.md' },
    { name: 'ts', path: '/documentation/multiple-select/styles-states.ts.md' },
  ];

  constructor() {
    this.errorCtrl.markAsTouched();
    this.errorCtrl.markAsDirty();
    this.errorCtrl.updateValueAndValidity({ emitEvent: false, onlySelf: true });

    this.errorCtrl2.markAsTouched();
    this.errorCtrl2.markAsDirty();
    this.errorCtrl2.updateValueAndValidity({ emitEvent: false, onlySelf: true });
  }
}


