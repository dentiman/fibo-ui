import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required } from '@angular/forms/signals';
import { FormFieldDirective } from '@fibo-ui/cdk';
import { UsageDemo } from '../../common/usage-demo';

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
              <div fiboFormField class="form-field-control flex items-center gap-2">
                <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
                  <label class="form-field-label mt-1">Username</label>
                  <input [formField]="userForm.username" type="text" placeholder="Enter username" class="text-field-input" />
                </div>
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
