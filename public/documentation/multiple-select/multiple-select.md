# Multiple Select

Multi-value selector with checkbox items, integrated with Signal Forms.

## Basic Usage

:::example multiple-select-basic-template

```html {example="multiple-select-basic-template"}
<fibo-form-field-control fiboPopoverTriggerToggle
  [formField]="userForm.skills"
  label="Skills" iconEnd="chevron-down">

  <div class="w-full flex flex-wrap gap-x-1 gap-y-1 -mx-1">
    @for (item of selectedSkills(); track item.value) {
      <div class="flex items-center gap-1 btn btn-sm h-6 px-1.5 min-w-0">
        <span class="truncate flex-1 text-xs font-medium">{{ item.label }}</span>
        <button type="button"
                class="rounded-full cursor-pointer flex-shrink-0 btn-text p-0.5"
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
       fiboSelectMulti [(value)]="userForm.skills().value"
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
```

```ts {example="multiple-select-basic-template"}
@Component({
  selector: 'multiple-select-basic-template-example',
  imports: [
    FormField, FormFieldControl, PopoverTriggerToggle,
    PortalContent, Popover, DataList,
    DataListItem, SelectMulti, Checkbox, LucideAngularModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
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

  readonly user = signal<UserModel>({ skills: [] });
  readonly userForm = form(this.user);

  readonly selectedSkills = computed(() => {
    const v = this.userForm.skills().value();
    if (!v || !Array.isArray(v)) return [];
    return this.skillItems.filter(i => v.includes(i.value as string));
  });

  removeSkill(val: string | number | null) {
    if (val === null) return;
    const current = this.userForm.skills().value();
    if (!current) return;
    this.userForm.skills().value.set(current.filter(v => v !== val));
  }
}
```

## Multi Select Component

Ready-made multi-select component that encapsulates popover, data list, checkboxes, and chip removal.

:::example multiple-select-component

```html {example="multiple-select-component" title="usage.html"}
<fibo-multi-select
  [formField]="userForm.skills"
  label="Skills"
  placeholder="Select skills"
  [items]="skillItems"
/>
```

```ts {example="multiple-select-component" title="usage.ts"}
@Component({
  selector: 'multiple-select-component-example',
  imports: [MultiSelect, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class MultipleSelectComponentExample {
  readonly skillItems: SelectItem[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
  ];

  readonly user = signal({ skills: [] as string[] });
  readonly userForm = form(this.user);
}
```

```html {example="multiple-select-component" title="fibo-multi-select.html"}
<fibo-form-field-control
  fiboPopoverTriggerToggle
  [label]="label()" iconEnd="chevron-down"
  [(value)]="value"
  [required]="required()" [disabled]="disabled()"
  [invalid]="invalid()" [touched]="touched()"
  [errors]="errors()">

  <div class="w-full flex flex-wrap gap-x-1 gap-y-1 -mx-1">
    @for (item of selectedItems(); track item.value) {
      <div class="flex items-center gap-1 btn btn-sm h-6 px-1.5 min-w-0">
        <span class="truncate flex-1 text-xs font-medium">{{ item.label }}</span>
        <button type="button"
                class="rounded-full cursor-pointer flex-shrink-0 btn-text p-0.5"
                (click)="removeItem(item.value); $event.stopPropagation()"
                (keydown)="$event.stopPropagation()">
          <lucide-icon name="x" size="12"></lucide-icon>
        </button>
      </div>
    }
    @if (selectedItems().length === 0) {
      <div class="from-field-placeholder text-sm ml-1">{{ placeholder() }}</div>
    }
  </div>

  <div *fiboPortalContent="let trigger"
       fiboPopover [trigger]="trigger" [matchWidth]="true"
       fiboDataList
       fiboSelectMulti [(value)]="value"
       class="popover-container">
    @for (item of items(); track item.value) {
      <a fiboDataListItem [value]="item.value" #option="DataListItem"
         class="datalist-item items-center">
        <fibo-checkbox [readonly]="true" [checked]="option.isSelected()">
          {{ item.label }}
        </fibo-checkbox>
      </a>
    }
  </div>
</fibo-form-field-control>
```

```ts {example="multiple-select-component" title="fibo-multi-select.ts"}
@Component({
  selector: 'fibo-multi-select',
  imports: [
    PortalContent, Popover, DataList, SelectMulti,
    LucideAngularModule, DataListItem,
    FormFieldControl, PopoverTriggerToggle, Checkbox,
  ],
  hostDirectives: [PopoverTrigger],
  host: { class: 'block' },
  template: '...',
})
export class MultiSelect implements FormValueControl<(string | number)[] | null> {
  value = model<(string | number)[] | null>(null);
  required = input(false);
  disabled = input(false);
  touched = input(false);
  invalid = input(false);
  dirty = input(false);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);

  items = input<SelectItem[]>([]);
  label = input<string>('');
  placeholder = input<string>('Select');

  selectedItems = computed(() => {
    const currentValue = this.value();
    if (!currentValue || !Array.isArray(currentValue)) return [];
    return this.items().filter(item =>
      item.value !== null && currentValue.includes(item.value)
    );
  });

  removeItem(val: string | number | null) {
    if (val === null) return;
    const currentValue = this.value();
    if (!currentValue) return;
    this.value.set(currentValue.filter(v => v !== val));
  }
}
```
