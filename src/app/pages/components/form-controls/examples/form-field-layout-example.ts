import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormField as SignalFormField, form, required } from '@angular/forms/signals';
import {
  Button,
  DatePickerField,
  FormLayout,
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
  selector: 'form-field-layout-example',
  imports: [SignalFormField, FormLayout, TextField, Select, MultiSelect, DatePickerField, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: contents;',
  },
  template: `
    <div [formLayout]="orientation()" class="contents">
      <fibo-text-field
        label="Name"
        [formField]="registrationForm.name"
        iconEnd="user"
        placeholder="Enter full name"
      />

      <fibo-select
        label="Position"
        [formField]="registrationForm.position"
        placeholder="Select position"
        [items]="positions"
      />

      <fibo-datepicker
        label="Birth Date"
        [formField]="registrationForm.birthDate"
        placeholder="YYYY-MM-DD"
      />

      <fibo-multi-select
        label="Skills"
        [formField]="registrationForm.skills"
        placeholder="Select skills"
        [items]="skillItems"
      />
    </div>

    <button
      type="button"
      fiboButton fiboAppearance="primary" class="w-full"
      [disabled]="!registrationForm().valid()"
      (click)="onSubmit()"
    >
      Register
    </button>
  `,
})
export class FormFieldLayoutExample {
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');

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

  readonly registrationForm = form(this.model, schema => {
    required(schema.name, { message: 'Name is required' });
    required(schema.position, { message: 'Position is required' });
    required(schema.birthDate, { message: 'Birth date is required' });
  });

  onSubmit() {
    console.log('Registration data:', this.model());
  }
}
