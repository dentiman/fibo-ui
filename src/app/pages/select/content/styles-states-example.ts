import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-select-style-states',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Select, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Styles and states</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto grid grid-cols-2 gap-8">
        <!-- Column 1: Default style -->
        <div class="space-y-6 p-8">
          <fibo-select
            [items]="items()"
            [formControl]="floatingLabelCtrl"
            [label]="'Floating Label'">
          </fibo-select>

          <fibo-select
            [items]="items()"
            [formControl]="fixedLabelCtrl"
            [placeholder]="'Select option'"
            [fixedLabel]="'Fixed Label'">
          </fibo-select>

          <fibo-select
            [items]="items()"
            [formControl]="disabledCtrl"
            [label]="'Disabled Select'"
            [placeholder]="'This is disabled'"
            [disabled]="true">
          </fibo-select>

          <fibo-select
            [items]="items()"
            [formControl]="errorCtrl"
            [label]="'Select with Error'"
            [placeholder]="'Required field'">
          </fibo-select>
        </div>

        <!-- Column 2: Secondary style -->
        <div class="bg-background-secondary outline-0  rounded-tr-md  p-8 space-y-6">
          <fibo-select
            [items]="items()"
            [formControl]="floatingLabelCtrl2"
            [label]="'Floating Label'"
            [appearance]="'secondary'">
          </fibo-select>

          <fibo-select
            [items]="items()"
            [formControl]="fixedLabelCtrl2"
            [placeholder]="'Select option'"
            [fixedLabel]="'Fixed Label'"
            [appearance]="'secondary'">
          </fibo-select>

          <fibo-select
            [items]="items()"
            [formControl]="disabledCtrl2"
            [label]="'Disabled Select'"
            [placeholder]="'This is disabled'"
            [disabled]="true"
            [appearance]="'secondary'">
          </fibo-select>

          <fibo-select
            [items]="items()"
            [formControl]="errorCtrl2"
            [label]="'Select with Error'"
            [placeholder]="'Required field'"
            [appearance]="'secondary'">
          </fibo-select>
        </div>
      </div>
    </app-usage-demo>
  `,
})
export class StylesStatesSelectExampleComponent {
  readonly items = signal<User[]>([...usersChoices]);

  readonly floatingLabelCtrl = new FormControl<number | null>(null);
  readonly fixedLabelCtrl = new FormControl<number | null>(null);
  readonly disabledCtrl = new FormControl<number | null>({ value: null, disabled: true });
  readonly errorCtrl = new FormControl<number | null>(null, [Validators.required]);

  readonly floatingLabelCtrl2 = new FormControl<number | null>(null);
  readonly fixedLabelCtrl2 = new FormControl<number | null>(null);
  readonly disabledCtrl2 = new FormControl<number | null>({ value: null, disabled: true });
  readonly errorCtrl2 = new FormControl<number | null>(null, [Validators.required]);

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/select/styles-states.html.md' }
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


