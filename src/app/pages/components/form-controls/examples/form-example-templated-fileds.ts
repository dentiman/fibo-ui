import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import {
  DataList,
  DataListItem,
  Popover,
  PopoverTriggerClick,
  PopoverTriggerToggle,
  PortalContent,
  SelectDate,
  SelectMulti,
  SelectOne,
} from '@fibo-ui/cdk';
import { Calendar, Checkbox, FormFieldControl, SelectItem } from '@fibo-ui/components';
import { LucideAngularModule } from 'lucide-angular';

interface RegistrationData {
  name: string;
  position: string | null;
  birthDate: string;
  skills: string[];
}

@Component({
  selector: 'form-example-templated-fields',
  imports: [
    FormField,
    FormFieldControl,
    PopoverTriggerToggle,
    PopoverTriggerClick,
    PortalContent,
    Popover,
    DataList,
    DataListItem,
    SelectOne,
    SelectMulti,
    SelectDate,
    Calendar,
    Checkbox,
    LucideAngularModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8 space-y-4">

      <fibo-form-field-control
        [formField]="registrationForm.name" [clearValue]="''"
        label="Name" iconEnd="user">
        <input [formField]="registrationForm.name"
               type="text" placeholder="Enter full name" class="text-field-input" />
      </fibo-form-field-control>

      <fibo-form-field-control
        fiboPopoverTriggerToggle
        [formField]="registrationForm.position"
        label="Position" iconEnd="chevron-down">

        <div class="text-sm" [class.from-field-placeholder]="!positionLabel()">
          {{ positionLabel() || 'Select position' }}
        </div>

        <div *fiboPortalContent="let trigger"
             fiboPopover [trigger]="trigger" [matchWidth]="true"
             fiboDataList (itemTriggered)="trigger.close()"
             fiboSelectOne [(value)]="registrationForm.position().value"
             class="popover-container">
          @for (item of positions; track item.value) {
            <a fiboDataListItem [value]="item.value" class="datalist-item">
              {{ item.label }}
            </a>
          }
        </div>
      </fibo-form-field-control>

      <fibo-form-field-control fiboPopoverTriggerClick
        [formField]="registrationForm.birthDate"
        label="Birth Date" iconEnd="calendar-days" [clearValue]="''">

        <input [formField]="registrationForm.birthDate"
               placeholder="YYYY-MM-DD" class="text-field-input" />

        <fibo-calendar *fiboPortalContent="let trigger"
                       fiboPopover [trigger]="trigger"
                       fiboSelectDate [(value)]="registrationForm.birthDate().value"
                       (itemTriggered)="trigger.close()"
                       class="popover-container" />
      </fibo-form-field-control>

      <fibo-form-field-control fiboPopoverTriggerToggle
        [formField]="registrationForm.skills"
        label="Skills" iconEnd="chevron-down">

        <div class="w-full flex flex-wrap gap-x-1 gap-y-1 -mx-1">
          @for (item of selectedSkills(); track item.value) {
            <div class="flex items-center gap-1 btn btn-sm h-6 px-1.5 min-w-0">
              <span class="truncate flex-1 text-xs font-medium">{{ item.label }}</span>
              <button type="button"
                      class="rounded-full cursor-pointer flex-shrink-0 btn-text p-0.5 hover:bg-black/5 dark:hover:bg-white/5"
                      (click)="removeSkill(item.value); $event.stopPropagation()"
                      (keydown)="$event.stopPropagation()">
                <lucide-icon name="x" size="12"></lucide-icon>
              </button>
            </div>
          }
          @if (selectedSkills().length === 0) {
            <div class="from-field-placeholder text-sm ml-1">Select skills</div>
          }
        </div>

        <div *fiboPortalContent="let trigger"
             fiboPopover [trigger]="trigger" [matchWidth]="true"
             fiboDataList
             fiboSelectMulti [(value)]="registrationForm.skills().value"
             class="popover-container">
            @for (item of skillItems; track item.value) {
              <a fiboDataListItem [value]="item.value" #option="DataListItem"
                 class="datalist-item items-center">
                <fibo-checkbox [readonly]="true" [checked]="option.isSelected()">
                  {{ item.label }}
                </fibo-checkbox>
              </a>
            }
        </div>
      </fibo-form-field-control>

      <button
        type="button"
        class="btn btn-primary w-full"
        [disabled]="!registrationForm().valid()"
        (click)="onSubmit()"
      >
        Register
      </button>
    </div>
  `,
})
export class FormExampleTemplatedFields {
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

  readonly positionLabel = computed(() => {
    const v = this.registrationForm.position().value();
    if (v === null) return null;
    return this.positions.find(i => i.value === v)?.label || null;
  });

  readonly selectedSkills = computed(() => {
    const v = this.registrationForm.skills().value();
    if (!v || !Array.isArray(v)) return [];
    return this.skillItems.filter(i => i.value !== null && v.includes(i.value as string));
  });

  removeSkill(val: string | number | null) {
    if (val === null) return;
    const current = this.registrationForm.skills().value();
    if (!current || !Array.isArray(current)) return;
    this.registrationForm.skills().value.set(current.filter(v => v !== val));
  }

  onSubmit() {
    console.log('Registration data:', this.model());
  }
}
