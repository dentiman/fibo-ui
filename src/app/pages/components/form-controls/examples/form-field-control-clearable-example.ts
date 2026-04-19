import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextField } from '@fibo-ui/components';

@Component({
  selector: 'field-control-clearable-example',
  imports: [TextField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-text-field
        label="Clearable field"
        iconStart="user"
        placeholder="Type something, then clear"
        [(value)]="username"
      />

      <p class="text-xs text-muted-foreground">Value: "{{ username() }}"</p>
    </div>
  `,
})
export class FieldControlClearableExample {
  readonly username = signal('John Doe');
}
