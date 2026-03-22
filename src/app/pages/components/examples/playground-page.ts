import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Combobox, DatePickerField, Select, TextField, type SelectItem } from '@fibo-ui/components';
import { form, required, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [
    CommonModule,
    JsonPipe,
    LucideAngularModule,
    Combobox,
    Select,
    TextField,
    FormField,
    DatePickerField,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-3xl space-y-8 p-8">
      <section class="space-y-3">
        <h1 class="text-2xl font-semibold">Playground</h1>
        <p class="text-sm text-zinc-600">
          Debug page for signal-form controls. The block below uses the new Select
          together with other fields and prints live form state.
        </p>
      </section>

      <section class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
        <div class="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-medium">Signal Form Example</h2>

          <fibo-text-field
            [formField]="debugForm.title"
            label="Title"
            placeholder="Enter task title"
            iconStart="file-text"
          />

          <fibo-select
            [formField]="debugForm.status"
            label="Status"
            placeholder="Select status"
            iconStart="list"
            [items]="statuses"
            [clearValue]="null"
          />

          <fibo-combobox
            [formField]="debugForm.assignee"
            label="Assignee"
            placeholder="Search assignee"
            [items]="assignees"
          />

          <fibo-datepicker-field
            [formField]="debugForm.dueDate"
            label="Due date"
            placeholder="Pick a date"
          />
        </div>

        <aside class="space-y-4 rounded-xl border border-zinc-200 bg-zinc-950 p-5 text-zinc-100 shadow-sm">
          <div>
            <h2 class="text-lg font-medium">Form State</h2>
            <p class="text-xs text-zinc-400">Live snapshot for debugging.</p>
          </div>

          <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
            <dt class="text-zinc-400">valid</dt>
            <dd>{{ debugForm().valid() }}</dd>
            <dt class="text-zinc-400">invalid</dt>
            <dd>{{ debugForm().invalid() }}</dd>
            <dt class="text-zinc-400">title error</dt>
            <dd>{{ titleError() ?? 'none' }}</dd>
            <dt class="text-zinc-400">status error</dt>
            <dd>{{ statusError() ?? 'none' }}</dd>
          </dl>

          <pre class="overflow-auto rounded-lg bg-black/40 p-3 text-xs leading-5">{{
            debugState() | json
          }}</pre>
        </aside>
      </section>
    </div>
  `,
})
export class PlaygroundPageComponent {
  readonly assignees = [
    'Ada Lovelace',
    'Alan Turing',
    'Barbara Liskov',
    'Grace Hopper',
    'Linus Torvalds',
    'Margaret Hamilton',
  ];

  readonly statuses: SelectItem[] = [
    { label: 'Backlog', value: 'backlog' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Blocked', value: 'blocked' },
    { label: 'Done', value: 'done' },
  ];

  readonly debugModel = signal({
    title: '',
    status: null as string | null,
    assignee: null as string | null,
    dueDate: '',
  });

  readonly debugForm = form(this.debugModel, (path) => {
    required(path.title, { message: 'Title is required' });
    required(path.status, { message: 'Status is required' });
  });

  readonly titleError = computed(() => {
    const state = this.debugForm.title();
    return state.invalid() && state.touched() ? state.errors()[0]?.message ?? null : null;
  });

  readonly statusError = computed(() => {
    const state = this.debugForm.status();
    return state.invalid() && state.touched() ? state.errors()[0]?.message ?? null : null;
  });

  readonly debugState = computed(() => ({
    model: this.debugModel(),
    form: {
      valid: this.debugForm().valid(),
      invalid: this.debugForm().invalid(),
      title: {
        value: this.debugForm.title().value(),
        touched: this.debugForm.title().touched(),
        dirty: this.debugForm.title().dirty(),
        invalid: this.debugForm.title().invalid(),
        errors: this.debugForm.title().errors().map(error => error.message ?? error.kind),
      },
      status: {
        value: this.debugForm.status().value(),
        touched: this.debugForm.status().touched(),
        dirty: this.debugForm.status().dirty(),
        invalid: this.debugForm.status().invalid(),
        errors: this.debugForm.status().errors().map(error => error.message ?? error.kind),
      },
      assignee: {
        value: this.debugForm.assignee().value(),
        touched: this.debugForm.assignee().touched(),
        dirty: this.debugForm.assignee().dirty(),
        invalid: this.debugForm.assignee().invalid(),
      },
      dueDate: {
        value: this.debugForm.dueDate().value(),
        touched: this.debugForm.dueDate().touched(),
        dirty: this.debugForm.dueDate().dirty(),
        invalid: this.debugForm.dueDate().invalid(),
      },
    },
  }));
}
