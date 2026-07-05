import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TextField } from '@fibo-ui/components';

@Component({
  selector: 'input-component-example',
  imports: [FormField, TextField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-70 p-8 space-y-4">
      <fibo-text-field
        [formField]="userForm.username"
        label="Username"
        iconStart="user"
        placeholder="Enter username"
      />

      <fibo-text-field
        [formField]="userForm.email"
        label="Email"
        type="email"
        iconStart="mail"
        placeholder="Enter email"
      />

      <fibo-text-field
        [formField]="userForm.password"
        label="Password"
        type="password"
        iconStart="lock"
        placeholder="Enter password"
      />
    </div>
  `,
})
export class InputComponentExample {
  readonly user = signal({ username: '', email: '', password: '' });
  readonly userForm = form(this.user);
}
