import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Combobox } from '@fibo-ui/components';

@Component({
  selector: 'combobox-component-example',
  imports: [Combobox, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">
      <fibo-combobox
        [formField]="userForm.assignee"
        label="Assignee"
        placeholder="Search assignee"
        [items]="assignees"
      />
    </div>
  `,
})
export class ComboboxComponentExample {
  readonly assignees = [
    'Ada Lovelace',
    'Alan Turing',
    'Barbara Liskov',
    'Grace Hopper',
    'Linus Torvalds',
    'Margaret Hamilton',
  ];

  readonly user = signal({ assignee: null as string | null });
  readonly userForm = form(this.user);
}
