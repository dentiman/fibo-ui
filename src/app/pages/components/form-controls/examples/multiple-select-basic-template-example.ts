import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { DataList, DataListItem, Popover, PopoverTriggerToggle, SelectMulti } from '@fibo-ui/cdk';
import { Checkbox, fieldErrorMessage, FormFieldControl, SelectItem } from '@fibo-ui/components';
import { LucideAngularModule } from 'lucide-angular';

interface UserModel {
  skills: string[];
}

@Component({
  selector: 'multiple-select-basic-template-example',
  imports: [
    FormField,
    FormFieldControl,
    PopoverTriggerToggle,
    Popover,
    DataList,
    DataListItem,
    SelectMulti,
    Checkbox,
    LucideAngularModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-form-field-control
        fiboPopoverTriggerToggle
        [content]="skillsTpl"
        [formField]="userForm.skills"
        label="Skills"
        iconEnd="chevron-down"
      >
        <div class="w-full flex flex-wrap gap-x-1 gap-y-1 -mx-1">
          @for (item of selectedSkills(); track item.value) {
            <div class="flex items-center gap-1 btn btn-sm h-6 px-1.5 min-w-0">
              <span class="truncate flex-1 text-xs font-medium">{{ item.label }}</span>
              <button
                type="button"
                class="rounded-full cursor-pointer flex-shrink-0 btn-text p-0.5 hover:bg-black/5 dark:hover:bg-white/5"
                (click)="removeSkill(item.value); $event.stopPropagation()"
                (keydown)="$event.stopPropagation()"
              >
                <lucide-icon name="x" size="12"></lucide-icon>
              </button>
            </div>
          }
          @if (selectedSkills().length === 0) {
            <div class="from-field-placeholder text-sm ml-1">Select skills</div>
          }
        </div>
      </fibo-form-field-control>
      @if (skillsError(); as error) {
        <div class="form-field-error">{{ error }}</div>
      }
      <ng-template #skillsTpl let-trigger>
        <div
          fiboPopover
          [trigger]="trigger"
          [matchWidth]="true"
          fiboDataList
          fiboSelectMulti
          [(value)]="userForm.skills().value"
          class="popover-container"
        >
          @for (item of skillItems; track item.value) {
            <a
              fiboDataListItem
              [value]="item.value"
              #option="DataListItem"
              class="datalist-item items-center"
            >
              <fibo-checkbox [readonly]="true" [checked]="option.isSelected()">
                {{ item.label }}
              </fibo-checkbox>
            </a>
          }
        </div>
      </ng-template>
    </div>
  `,
})
export class MultipleSelectBasicTemplateExample {
  readonly skillItems: SelectItem[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
  ];

  readonly user = signal<UserModel>({ skills: ['angular', 'react', 'vue'] });
  readonly userForm = form(this.user);
  readonly skillsError = fieldErrorMessage(this.userForm.skills);

  readonly selectedSkills = computed(() => {
    const v = this.userForm.skills().value();
    if (!v || !Array.isArray(v)) return [];
    return this.skillItems.filter((i) => i.value !== null && v.includes(i.value as string));
  });

  removeSkill(val: string | number | null) {
    if (val === null) return;
    const current = this.userForm.skills().value();
    if (!current || !Array.isArray(current)) return;
    this.userForm.skills().value.set(current.filter((v) => v !== val));
  }
}
