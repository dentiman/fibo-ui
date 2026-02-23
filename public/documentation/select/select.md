# Select

Select

## Basic Usage

:::example select-basic-template

```html {example="select-basic-template"}
<fibo-form-field-control
  fiboPopoverTriggerToggle
  [formField]="userForm.role"
  label="User Role" iconEnd="chevron-down">

  <div class="text-sm" [class.from-field-placeholder]="!roleLabel()">
    {{ roleLabel() || 'Select Role' }}
  </div>

  <div *fiboPortalContent="let trigger"
       fiboPopover [trigger]="trigger" [matchWidth]="true"
       fiboDataList (itemTriggered)="trigger.close()"
       fiboSelectOne [(value)]="userForm.role().value"
       class="popover-container">
    @for (item of roles; track item.value) {
      <a fiboDataListItem [value]="item.value" class="datalist-item">
        {{ item.label }}
      </a>
    }
  </div>
</fibo-form-field-control>
```

```ts {example="select-basic-template"}
@Component({
  selector: 'select-basic-template-example',
  imports: [
    FormField, FormFieldControl, PopoverTriggerToggle,
    PortalContent, Popover, DataList,
    DataListItem, SelectOne,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class SelectBasicTemplateExample {
  readonly roles: SelectItem[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
    { label: 'Guest', value: 'guest' },
  ];

  readonly user = signal<UserModel>({ role: null });
  readonly userForm = form(this.user);

  readonly roleLabel = computed(() => {
    const v = this.userForm.role().value();
    if (v === null) return null;
    return this.roles.find(i => i.value === v)?.label || null;
  });
}
```

## Select Component

Ready-made select component that encapsulates popover, data list, and form field control.

:::example select-component

```html {example="select-component" title="usage.html"}
<fibo-select
  [formField]="registrationForm.role"
  label="User Role"
  placeholder="Select role"
  [items]="roles"
/>
```

```ts {example="select-component" title="usage.ts"}
@Component({
  selector: 'select-component-example',
  imports: [Select],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class SelectComponentExample {
  readonly roles: SelectItem[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
    { label: 'Guest', value: 'guest' },
  ];

  readonly user = signal({ role: null as string | null });
  readonly registrationForm = form(this.user);
}
```

```html {example="select-component" title="app-select.html"}
<fibo-form-field-control
  fiboPopoverTriggerToggle
  [label]="label()" iconEnd="chevron-down"
  [(value)]="value" [clearValue]="clearValue()"
  [required]="required()" [disabled]="disabled()"
  [invalid]="invalid()" [touched]="touched()"
  [errors]="errors()">

  <div class="text-sm" [class.from-field-placeholder]="!selectedValue()">
    {{ selectedValue() || placeholder() }}
  </div>

  <div *fiboPortalContent="let trigger"
       fiboPopover [trigger]="trigger" [matchWidth]="true"
       fiboDataList (itemTriggered)="trigger.close()"
       fiboSelectOne [(value)]="value"
       class="popover-container">
    @for (item of items(); track item.value) {
      <a fiboDataListItem [value]="item.value" class="datalist-item">
        {{ item.label }}
      </a>
    }
  </div>
</fibo-form-field-control>
```

```ts {example="select-component" title="app-select.ts"}
@Component({
  selector: 'fibo-select',
  imports: [
    PortalContent, Popover, DataList, SelectOne,
    LucideAngularModule, DataListItem,
    FormFieldControl, PopoverTriggerToggle,
  ],
  hostDirectives: [PopoverTrigger],
  host: { class: 'block' },
  template: '...',
})
export class Select implements FormValueControl<string | number | null> {
  value = model<string | number | null>(null);
  required = input(false);
  disabled = input(false);
  touched = input(false);
  invalid = input(false);
  dirty = input(false);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);

  items = input<SelectItem[]>([]);
  label = input<string>('');
  placeholder = input<string>('Select');
  clearValue = input<string | number | null | undefined>(undefined);

  selectedValue = computed(() => {
    const currentValue = this.value();
    if (currentValue === null) return null;
    const item = this.items().find(item => item.value === currentValue);
    return item?.label || null;
  });
}
```

## API
