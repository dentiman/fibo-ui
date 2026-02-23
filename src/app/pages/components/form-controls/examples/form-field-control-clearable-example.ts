import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormFieldControl } from '@fibo-ui/components';

@Component({
  selector: 'form-field-control-clearable-example',
  imports: [FormFieldControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-form-field-control
        label="Clearable field"
        iconStart="user"
        [clearValue]="''"
        [(value)]="username"
      >
        <input
          type="text"
          placeholder="Type something, then clear"
          [value]="username()"
          (input)="username.set($any($event.target).value)"
          class="text-field-input"
        />
      </fibo-form-field-control>

      <p class="text-xs text-muted-foreground">Value: "{{ username() }}"</p>
    </div>
  `,
})
export class FormFieldControlClearableExample {
  readonly username = signal('John Doe');
}
