# Form Field Control

Visual shell for form fields — provides label, start/end icons, error state styling, and a clearable value button. Every styled form component in `@fibo-ui/components` (`TextField`, `Select`, `DatePickerField`) is built on top of `FormFieldControl`.

## Basic Usage

A `FormFieldControl` wraps any native input (or custom content) and adds a label, optional icons at start/end positions.

:::example form-field-control-basic

```html {example="form-field-control-basic"}
<fibo-form-field-control label="Username">
  <input type="text" placeholder="Enter username" class="text-field-input" />
</fibo-form-field-control>

<fibo-form-field-control label="Email" iconStart="mail">
  <input type="email" placeholder="Enter email" class="text-field-input" />
</fibo-form-field-control>

<fibo-form-field-control label="Search" iconStart="search" iconEnd="arrow-right">
  <input type="text" placeholder="Search..." class="text-field-input" />
</fibo-form-field-control>

<div class="form-field-variant-inline">
  <fibo-form-field-control label="Role" iconEnd="chevron-down">
    <div class="text-sm from-field-placeholder">Select role</div>
  </fibo-form-field-control>
</div>
```

```ts {example="form-field-control-basic"}
@Component({
  selector: 'form-field-control-basic-example',
  imports: [FormFieldControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class FormFieldControlBasicExample {}
```

## Layout Variants

`FormFieldControl` exposes stable internal slot classes, and layout variants can be applied entirely from global CSS:

- default layout from `form-fields.css`: the label is rendered above the content.
- `.form-field-variant-inline`: keeps the icons at the edges, but places the label inline to the left of the content.

For component usage, wrap the field with a global variant class:

```html
<div class="form-field-variant-inline">
  <fibo-form-field-control label="Status" iconEnd="chevron-down">
    <div class="text-sm">Active</div>
  </fibo-form-field-control>
</div>
```

For manual templating with `fiboFormField` / `fiboFormFieldTrigger`, use the same modifier classes in CSS:

```html
<button class="form-field-control">
  <div class="form-field-body">
    <label class="form-field-label">Status</label>
    <div class="form-field-content">
      <div class="text-sm">Active</div>
    </div>
  </div>
  <lucide-icon name="chevron-down" size="16" class="form-field-icon form-field-icon-end"></lucide-icon>
</button>
```

## Signal Forms Integration

`FormFieldControl` implements `FormValueControl<T>`, making it a first-class citizen for custom form fields with `@angular/forms/signals`. When you bind `[formField]` to it, the directive automatically wires `value`, `required`, `disabled`, `touched`, `invalid`, `dirty`, and `errors` — so the control reflects validation state (error styling, error messages) without any manual binding.

This lets you compose fully validated form fields from `FormFieldControl` + any projected content (native `<input>`, CDK-based select dropdown, etc.).

:::example form-field-control-signal-form

```html {example="form-field-control-signal-form"}
<fibo-form-field-control
  [formField]="contactForm.name" [clearValue]="''"
  label="Name" iconEnd="user">
  <input [formField]="contactForm.name"
         type="text" placeholder="Enter full name" class="text-field-input" />
</fibo-form-field-control>

<fibo-form-field-control fiboPopoverTriggerToggle
  [formField]="contactForm.role"
  label="Role" iconEnd="chevron-down">

  <div class="text-sm" [class.from-field-placeholder]="!roleLabel()">
    {{ roleLabel() || 'Select role' }}
  </div>

  <div *fiboPortalContent="let trigger"
       fiboPopover [trigger]="trigger" [matchWidth]="true"
       fiboDataList (itemTriggered)="trigger.close()"
       fiboSelectOne [(value)]="contactForm.role().value"
       class="popover-container">
    @for (item of roles; track item.value) {
      <a fiboDataListItem [value]="item.value" class="datalist-item">
        {{ item.label }}
      </a>
    }
  </div>
</fibo-form-field-control>

<button class="btn btn-primary w-full"
  [disabled]="!contactForm().valid()"
  (click)="onSubmit()">
  Submit
</button>
```

```ts {example="form-field-control-signal-form"}
@Component({
  selector: 'form-field-control-signal-form-example',
  imports: [
    FormField, FormFieldControl,
    PopoverTriggerToggle, PortalContent, Popover,
    DataList, DataListItem, SelectOne,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class FormFieldControlSignalFormExample {
  readonly roles: SelectItem[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
  ];

  readonly model = signal<ContactData>({
    name: '',
    role: null,
  });

  readonly contactForm = form(this.model, schema => {
    required(schema.name, { message: 'Name is required' });
    required(schema.role, { message: 'Role is required' });
  });

  readonly roleLabel = computed(() => {
    const v = this.contactForm.role().value();
    if (v === null) return null;
    return this.roles.find(i => i.value === v)?.label || null;
  });

  onSubmit() {
    console.log('Contact data:', this.model());
  }
}
```

## Clearable

When `clearValue` is set and the current `value` differs from it, a clear button (X icon) appears. Clicking it resets the value to `clearValue`.

:::example form-field-control-clearable

```html {example="form-field-control-clearable"}
<fibo-form-field-control
  label="Clearable field"
  iconStart="user"
  [clearValue]="''"
  [(value)]="username"
>
  <input
    type="text"
    placeholder="Type something, then clear"
    [value]="username()"
    (input)="username.set($any($event.target).value)"
    class="text-field-input"
  />
</fibo-form-field-control>

<p class="text-xs text-muted-foreground">Value: "{{ username() }}"</p>
```

```ts {example="form-field-control-clearable"}
@Component({
  selector: 'form-field-control-clearable-example',
  imports: [FormFieldControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class FormFieldControlClearableExample {
  readonly username = signal('John Doe');
}
```

## Composition

`FormFieldControl` is the building block behind every styled form component. `TextField`, `Select`, `MultiSelect`, and `DatePickerField` all wrap it internally, forwarding their inputs (label, icons, errors, disabled) down to `FormFieldControl`. Here is a complete registration form showcasing all of them wired with signal forms and validation.

:::example form-example

```html {example="form-example"}
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

<button class="btn btn-primary w-full"
  [disabled]="!registrationForm().valid()"
  (click)="onSubmit()">
  Register
</button>
```

```ts {example="form-example"}
@Component({
  selector: 'form-example',
  imports: [FormField, TextField, Select, MultiSelect, DatePickerField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class FormExample {
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
```

## API

### Selector

`fibo-form-field-control` / `button[fiboFormFieldControl]`

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | `''` | Label text displayed above the content |
| `iconStart` | `string` | `''` | Lucide icon name rendered before the content |
| `iconEnd` | `string` | `''` | Lucide icon name rendered after the content |
| `id` | `string` | `''` | Forwarded to the inner `<label for="">` |
| `value` | `unknown` | `undefined` | Two-way bound value (model) |
| `clearValue` | `unknown` | `undefined` | When set, enables the clear button. Clicking it sets `value` to this |
| `required` | `boolean` | `false` | Sets `aria-required` on the host |
| `disabled` | `boolean` | `false` | Sets `aria-disabled` on the host and blocks `clear()` |
| `invalid` | `boolean` | `false` | Combined with `touched` to derive error state |
| `touched` | `boolean` | `false` | Combined with `invalid` to derive error state |
| `dirty` | `boolean` | `false` | Tracks whether the value has been modified |
| `errors` | `ValidationError[]` | `[]` | Validation errors from `@angular/forms/signals` |

### Host Attributes

| Attribute | Condition |
|-----------|-----------|
| `aria-disabled` | `disabled() === true` |
| `aria-required` | `required() === true` |
| `data-error` | `invalid() && touched()` |
| `data-can-clear` | `clearValue` is set and `value !== clearValue` |

### Computed

| Name | Description |
|------|-------------|
| `hasError()` | `true` when both `invalid` and `touched` are `true` |
| `canClear()` | `true` when `clearValue` is defined and differs from current `value` |

### CSS Classes

| Class | Element | Description |
|-------|---------|-------------|
| `.form-field-control` | Host | Main container — flex row with gap |
| `.form-field-variant-inline` | Wrapper | Global modifier that switches descendants to inline label layout |
| `.form-field-body` | Inner wrapper | Variant-aware layout wrapper for label/content |
| `.form-field-content` | Inner wrapper | Content slot that stretches between label and trailing icons |
| `.form-field-label` | `<label>` | Label element used by both layout variants |
| `.form-field-icon` | `<lucide-icon>` | Start and end icons |
| `.form-field-icon-end` | `<lucide-icon>` | Additional class on the end icon |
| `.form-field-clear-icon` | `<lucide-icon>` | The clear (X) button |
