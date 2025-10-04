import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Input} from '@fibo-ui/components';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-input-styles-states',
  imports: [CommonModule, ReactiveFormsModule, Input, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Styles and states</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto grid grid-cols-2 gap-8">
        <!-- Column 1: Default style -->
        <div class="space-y-6 p-8">
          <fibo-input
            [formControl]="floatingLabelCtrl"
            [label]="'Floating Label'"
            [placeholder]="'Enter your email'">
          </fibo-input>

          <fibo-input
            [formControl]="fixedLabelCtrl"
            [placeholder]="'Enter your phone'"
            [fixedLabel]="'Fixed Label'">
          </fibo-input>

          <fibo-input
            [formControl]="disabledCtrl"
            [label]="'Disabled Input'"
            [placeholder]="'This is disabled'"
            [disabled]="true">
          </fibo-input>

          <fibo-input
            [formControl]="errorCtrl"
            [label]="'Input with Error'"
            [placeholder]="'Enter required field'">
          </fibo-input>
        </div>

        <!-- Column 2: Card style -->
        <div class="bg-background-secondary outline-0  rounded-tr-md  p-8 space-y-6">
          <fibo-input
            class="form-field-secondary"
            [formControl]="floatingLabelCtrl2"
            [label]="'Floating Label'"
            [placeholder]="'Enter your email'"
            [appearance]="'secondary'">
          </fibo-input>

          <fibo-input
            class="form-field-secondary"
            [formControl]="fixedLabelCtrl2"
            [placeholder]="'Enter your phone'"
            [fixedLabel]="'Fixed Label'"
            [appearance]="'secondary'">
          </fibo-input>

          <fibo-input
            class="form-field-secondary"
            [formControl]="disabledCtrl2"
            [label]="'Disabled Input'"
            [placeholder]="'This is disabled'"
            [disabled]="true"
            [appearance]="'secondary'">
          </fibo-input>

          <fibo-input
            class="form-field-secondary"
            [formControl]="errorCtrl2"
            [label]="'Input with Error'"
            [placeholder]="'Enter required field'"
            [appearance]="'secondary'">
          </fibo-input>
        </div>
      </div>
    </app-usage-demo>
  `,
})
export class StylesStatesInputExampleComponent {
  readonly floatingLabelCtrl = new FormControl('');
  readonly fixedLabelCtrl = new FormControl('');
  readonly disabledCtrl = new FormControl({ value: 'Disabled value', disabled: true });
  readonly errorCtrl = new FormControl('', [Validators.required]);

  readonly floatingLabelCtrl2 = new FormControl('');
  readonly fixedLabelCtrl2 = new FormControl('');
  readonly disabledCtrl2 = new FormControl({ value: 'Disabled value', disabled: true });
  readonly errorCtrl2 = new FormControl('', [Validators.required]);

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/input/styles-states.html.md' },
    { name: 'ts', path: '/documentation/input/styles-states.ts.md' }
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
