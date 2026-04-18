import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import {
  Button,
  DatePickerField,
  MultiSelect,
  Select,
  SelectItem,
  TextField,
} from '@fibo-ui/components';
import { citiesChoices, usersChoices } from '../../../../common/form-data-example';

interface RegistrationData {
  name: string;
  position: string | null;
  birthDate: string;
  skills: string[];
}

interface FilterToolbarData {
  query: string;
  status: string | null;
  assignee: number | null;
  updatedAfter: string;
  city: string | null;
}

@Component({
  selector: 'form-example',
  imports: [FormField, TextField, Select, MultiSelect, DatePickerField, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: contents;',
  },
  template: `
    @if (showHeader()) {
      <div class="space-y-1">
        <h1 class="text-2xl font-bold">{{ title() }}</h1>
        <p class="text-sm text-foreground-secondary">{{ description() }}</p>
      </div>
    }

    @switch (variant()) {
      @case ('toolbar') {
        <fibo-text-field
          [formField]="filterForm.query"
          label="Search"
          iconStart="search"
          placeholder="Issue title or ID"
        />

        <fibo-select
          [formField]="filterForm.status"
          label="Status"
          placeholder="Any"
          [items]="statusItems"
          [clearValue]="null"
        />

        <fibo-select
          [formField]="filterForm.assignee"
          label="Owner"
          placeholder="Anyone"
          [items]="assigneeItems"
          [clearValue]="null"
        />

        <fibo-datepicker
          [formField]="filterForm.updatedAfter"
          label="Updated"
          placeholder="After"
        />

        <fibo-select
          [formField]="filterForm.city"
          label="City"
          placeholder="Any city"
          [items]="cityItems"
          [clearValue]="null"
        />
      }

      @default {
        <fibo-text-field
          [formField]="registrationForm.name"
          label="Name"
          iconEnd="user"
          placeholder="Enter full name"
        />

        <fibo-select
          [formField]="registrationForm.position"
          label="Position"
          placeholder="Select position"
          [items]="positions"
        />

        <fibo-datepicker
          [formField]="registrationForm.birthDate"
          label="Birth Date"
          placeholder="YYYY-MM-DD"
        />

        <fibo-multi-select
          [formField]="registrationForm.skills"
          label="Skills"
          placeholder="Select skills"
          [items]="skillItems"
        />

        <button
          type="button"
          fiboButton fiboAppearance="primary" class="w-full"
          [disabled]="!registrationForm().valid()"
          (click)="onSubmit()"
        >
          Register
        </button>
      }
    }
  `,
})
export class FormExample {
  readonly title = input('Form Example');
  readonly description = input('Registration form demo built from fibo form controls.');
  readonly showHeader = input(true);
  readonly variant = input<'registration' | 'toolbar'>('registration');

  readonly positions: SelectItem[] = [
    { label: 'Developer', value: 'developer' },
    { label: 'Designer', value: 'designer' },
    { label: 'Product Manager', value: 'pm' },
    { label: 'QA Engineer', value: 'qa' },
    { label: 'DevOps Engineer', value: 'devops' },
    { label: 'Team Lead', value: 'lead' },
  ];

  readonly skillItems: SelectItem[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Python', value: 'python' },
    { label: 'Docker', value: 'docker' },
    { label: 'SQL', value: 'sql' },
    { label: 'Git', value: 'git' },
  ];

  readonly statusItems: SelectItem[] = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Blocked', value: 'blocked' },
    { label: 'Done', value: 'done' },
  ];

  readonly assigneeItems: SelectItem[] = usersChoices.slice(0, 8).map((user) => ({
    label: user.label,
    value: user.id,
  }));

  readonly cityItems: SelectItem[] = citiesChoices.slice(0, 10);

  readonly model = signal<RegistrationData>({
    name: '',
    position: null,
    birthDate: '',
    skills: [],
  });

  readonly filterModel = signal<FilterToolbarData>({
    query: '',
    status: null,
    assignee: null,
    updatedAfter: '',
    city: null,
  });

  readonly registrationForm = form(this.model, schema => {
    required(schema.name, { message: 'Name is required' });
    required(schema.position, { message: 'Position is required' });
    required(schema.birthDate, { message: 'Birth date is required' });
  });

  readonly filterForm = form(this.filterModel, () => {});

  onSubmit() {
    console.log('Registration data:', this.model());
  }
}
