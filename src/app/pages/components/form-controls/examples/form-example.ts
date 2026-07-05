import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import {
  Button,
  DatePickerField,
  MultiSelect,
  Select,
  SelectItem,
  TextField,
} from '@fibo-ui/components';

interface RegistrationData {
  name: string;
  position: string | null;
  birthDate: string;
  skills: string[];
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
      (click)="onSubmit()"
    >
      Register
    </button>
  `,
})
export class FormExample {
  readonly title = input('Form Example');
  readonly description = input('Registration form demo built from fibo form controls.');
  readonly showHeader = input(true);

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

  readonly model = signal<RegistrationData>({
    name: '',
    position: null,
    birthDate: '',
    skills: [],
  });

  readonly registrationForm = form(this.model);

  onSubmit() {
    console.log('Registration data:', this.model());
  }
}
