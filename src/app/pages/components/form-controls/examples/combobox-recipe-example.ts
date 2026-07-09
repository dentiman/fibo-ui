import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Combobox } from '@fibo-ui/components';

@Component({
  selector: 'combobox-recipe-example',
  imports: [Combobox, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-combobox
        [formField]="form.assignee"
        label="Assignee"
        placeholder="Search assignee"
        [items]="assignees"
      />
    </div>
  `,
})
export class ComboboxRecipeExample {
  readonly assignees = [
    'Ada Lovelace',
    'Alan Turing',
    'Barbara Liskov',
    'Grace Hopper',
    'Linus Torvalds',
    'Margaret Hamilton',
  ];

  readonly model = signal({ assignee: null as string | null });
  readonly form = form(this.model);
}
