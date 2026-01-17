import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form, required} from '@angular/forms/signals';
import {FormFieldDirective} from '@fibo-ui/cdk';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-input',
  imports: [CommonModule, Field, FormFieldDirective, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Input with Signal Forms</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 space-y-4 p-8">
        <form class="space-y-4">
          <div fiboFormField class="group content-center fibo-form-field px-3 py-1">
            <label class="block text-xs fibo-form-field-label">Username</label>
            <input [field]="userForm.username" type="text" placeholder="Enter username" class="w-full appearance-none outline-none text-sm focus:outline-0" />
          </div>
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

