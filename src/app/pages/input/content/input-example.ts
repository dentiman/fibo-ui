import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form, required} from '@angular/forms/signals';
import {FormField} from '@fibo-ui/components';
import {FiboInput} from '@fibo-ui/cdk';
import {FieldLabel} from '../../../../../projects/fibo-ui/components/src/lib/form/form-field/field-label';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-input',
  imports: [CommonModule, Field, FormField, FiboInput, FieldLabel, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Input with Signal Forms</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 space-y-4 p-8">
        <form class="space-y-4">
          <fibo-form-field [field]="userForm.username">
            <fibo-field-label>Username</fibo-field-label>
            <input
              fiboInput
              [field]="userForm.username"
              placeholder="Enter username"
              class="w-full appearance-none outline-none text-sm focus:outline-0" />
          </fibo-form-field>
        </form>
      </div>
    </app-usage-demo>
  `,
})
export class InputExampleComponent {
  userModel = signal({
    username: ''
  });

  userForm = form(this.userModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required' });
  });

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/input/signal-forms.html.md' },
    { name: 'ts', path: '/documentation/input/signal-forms.ts.md' }
  ];
}

