import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormField, form, required} from '@angular/forms/signals';
import {FormFieldDirective} from '@fibo-ui/cdk';
import {UsageDemo} from '../../common/usage-demo';

@Component({
  selector: 'app-input-page',
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    FormFieldDirective,
    UsageDemo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 flex flex-col space-y-12">
      <div>
        <h2 class="text-foreground">Input with Signal Forms</h2>
        <app-usage-demo [codeBlocks]="codeBlocks">
          <div class="mx-auto w-70 space-y-4 p-8">
            <form class="space-y-4">
              <div fiboFormField class="group fibo-form-field px-3 py-1 flex flex-col justify-center">
                <label class="block text-xs fibo-form-field-label">Username</label>
                <input [formField]="userForm.username" type="text" placeholder="Enter username" class="w-full appearance-none outline-none text-sm focus:outline-0" />
              </div>
            </form>
          </div>
        </app-usage-demo>
      </div>
    </div>
  `
})
export class InputPageComponent {
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
