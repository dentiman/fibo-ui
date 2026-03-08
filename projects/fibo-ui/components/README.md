# @fibo-ui/components

Angular UI component library built with Angular 21, Tailwind CSS 4, and signal-based architecture. Depends on [`@fibo-ui/cdk`](../cdk) for low-level primitives (popover, portal, data-list, form-field directives).

## Installation

```bash
npm install @fibo-ui/components @fibo-ui/cdk
```

### Peer Dependencies

```bash
npm install @angular/common@^21.0.0 @angular/core@^21.0.0 @angular/forms@^21.0.0 \
  @angular/platform-browser@^21.0.0 @angular/router@^21.0.0 \
  @floating-ui/dom@^1.7.3 date-fns@^4.1.0 lucide-angular@^0.539.0 \
  ngxtension@^5.1.0 rxjs@~7.8.0 tailwindcss@^4.1.12
```

## Setup

### 1. Import Styles

The library ships CSS via package exports. Import what you need in your global stylesheet:

```css
@import '@fibo-ui/components/theme';       /* CSS custom properties (light + dark) */
@import '@fibo-ui/components/buttons';     /* .btn, .btn-primary, .btn-danger, etc. */
@import '@fibo-ui/components/components';  /* .datalist-item, .fibo-card, .fibo-input, etc. */
```

Form field styles are in a separate file — import in your stylesheet if using form components:

```css
@import '@fibo-ui/components/src/form-fields.css';
```

### 2. Dark Mode

The theme uses a `data-theme` attribute on `<html>`. Toggle between light and dark:

```html
<html data-theme="dark">
```

All CSS custom properties automatically switch between light/dark palettes.

### 3. Icons

Components use [Lucide Angular](https://lucide.dev/guide/packages/lucide-angular) icons. Register the icons you need in your app config:

```typescript
import { LUCIDE_ICONS, LucideIconProvider, ChevronDown, X, Calendar } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ ChevronDown, X, Calendar }) }
  ]
};
```

---

## Components

### Form Fields

All form components implement `FormValueControl<T>` and integrate with Angular's signal-based forms (`@angular/forms/signals`).

#### TextField

Text input with label, icons, validation states, and clear button.

```html
<fibo-text-field
  [(value)]="name"
  label="Username"
  placeholder="Enter username"
  [required]="true"
  iconStart="user">
</fibo-text-field>
```

With signal forms:

```typescript
userModel = signal({ username: '' });
userForm = form(this.userModel, (path) => {
  required(path.username, { message: 'Username is required' });
});
```

```html
<fibo-text-field [formField]="userForm.username" label="Username" />
```

**Inputs:** `value: model<string>`, `type`, `label`, `placeholder`, `iconStart`, `iconEnd`, `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`

#### DatePickerField

Date input with calendar popover.

```html
<fibo-datepicker [(value)]="date" label="Birth Date" placeholder="YYYY-MM-DD" />
```

**Inputs:** `value: model<string>`, `label`, `placeholder`, `iconStart`, `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`

#### FormFieldControl

Low-level wrapper providing label, icons, and clear button for custom form fields.

```html
<fibo-form-field-control label="Custom Field" iconStart="search" [(value)]="val">
  <input class="text-field-input" />
</fibo-form-field-control>
```

Use global wrapper classes such as `.form-field-variant-inline` to override the default layout without changing component APIs.

**Inputs:** `value: model<unknown>`, `label`, `iconStart`, `iconEnd`, `clearValue`, `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`

---

### Select

#### Single Select

```html
<fibo-select
  [(value)]="selectedCity"
  [items]="cities"
  label="City"
  placeholder="Choose a city">
</fibo-select>
```

**Inputs:** `value: model<string | number | null>`, `items: SelectItem[]`, `label`, `placeholder`, `clearValue`, `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`

#### Multi Select

```html
<fibo-multi-select
  [(value)]="selectedCities"
  [items]="cities"
  label="Cities"
  placeholder="Choose cities">
</fibo-multi-select>
```

**Inputs:** `value: model<(string | number)[] | null>`, `items: SelectItem[]`, `label`, `placeholder`, `clearValue`, `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`

#### Building a custom select with CDK primitives

For full control, compose with CDK directives directly:

```html
<button fiboFormFieldTrigger [formField]="userForm.role" class="form-field-control">
  <label class="form-field-label">Role</label>
  <div>{{ user().role || 'Select Role' }}</div>
  <lucide-icon name="chevron-down" size="16" />

  <div *fiboPortalContent="let trigger"
       fiboPopover [trigger]="trigger" [matchWidth]="true"
       fiboDataList (itemTriggered)="trigger.close()"
       fiboSelectOne [(value)]="userForm.role().value"
       class="popover-container">
    @for (role of roles; track role) {
      <a fiboDataListItem [value]="role" class="datalist-item">{{ role }}</a>
    }
  </div>
</button>
```

---

### Checkbox

```html
<fibo-checkbox [(checked)]="accepted">Accept terms</fibo-checkbox>
<fibo-checkbox [indeterminate]="true">Partial</fibo-checkbox>
<fibo-checkbox [disabled]="true" [checked]="true">Locked</fibo-checkbox>
```

With signal forms:

```html
<fibo-checkbox [formField]="settingsForm.acceptTerms">Accept terms</fibo-checkbox>
```

**Inputs:** `checked: model<boolean>`, `indeterminate`, `readonly`, `disabled`, `touched: model<boolean>`

### Switch

```html
<fibo-switch [(checked)]="enabled" size="md">Enable feature</fibo-switch>
```

**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`

**Inputs:** `checked: model<boolean>`, `isLoading`, `size`, `disabled`, `touched: model<boolean>`

---

### Calendar

Date picker calendar with single-date and date-range selection models.

#### Single Date

```html
<fibo-calendar fiboSelectDate [(value)]="selectedDate" />
```

#### Date Range

```html
<fibo-calendar fiboSelectDateRange [(value)]="dateRange" />
```

Where `dateRange` is `{ startDate: string, endDate: string }`.

**Inputs:** `minDate`, `maxDate` (format: `yyyy-MM-dd`)

---

### Dialog / Drawer

Dialog and drawer use the same trigger flow via shared overlay outlet.

```html
<button fiboPopoverTriggerClick overlayCategory="dialog" [content]="dialogTpl">Open Dialog</button>
<button fiboPopoverTriggerClick overlayCategory="dialog" [content]="drawerTpl">Open Drawer</button>

<ng-template #dialogTpl>
  <fibo-dialog>
    <div>Dialog body</div>
  </fibo-dialog>
</ng-template>

<ng-template #drawerTpl>
  <fibo-drawer>
    <div>Drawer body</div>
  </fibo-drawer>
</ng-template>
```

---

### Confirmation

Confirmation dialog triggered by a directive.

```html
<button fiboConfirm (confirm)="onDelete()">Delete Item</button>
```

With custom content:

```html
<button fiboConfirm [content]="{ title: 'Are you sure?', message: 'This cannot be undone.' }" (confirm)="onDelete()">
  Delete
</button>
```

**Service:** `ConfirmationService` — `open(config)`, `confirm()`, `cancel()`

---

### Notification

Toast notification system. Place `<fibo-notification />` once in your root template.

```html
<!-- app.component.html -->
<fibo-notification />
```

```typescript
private notifier = inject(Notifier);

this.notifier.success('Saved!');
this.notifier.error('Failed to save.', 0);      // 0 = no auto-dismiss
this.notifier.warning('Check your input.', 8);   // 8 seconds
this.notifier.info('FYI: new update available.');

// Custom template notification
this.notifier.push({ template: myTemplateRef, duration: 5 });
```

**Methods:** `success(msg, duration?)`, `error(msg, duration?)`, `warning(msg, duration?)`, `info(msg, duration?)`, `push(config)`

Default duration: 5 seconds. Pass `0` to keep the notification until dismissed.

---

### Tooltip

Directive-based tooltip with placement options. Accepts a string or `TemplateRef`.

```html
<button [fiboTooltip]="'Save changes'" placement="top">Save</button>

<button [fiboTooltip]="richTooltip" placement="right-start">Info</button>
<ng-template #richTooltip>
  <p>Line 1</p>
  <p>Line 2</p>
</ng-template>
```

**Placements:** `top`, `bottom`, `left`, `right`, and aligned variants (`top-start`, `top-end`, `bottom-start`, `bottom-end`, `left-start`, `left-end`, `right-start`, `right-end`)

---

### Menu

#### Popover Menu

Floating menu triggered by a button. Items can be passed as data or composed declaratively.

**Data-driven (with nested submenus):**

```typescript
items: MenuItemType[] = [
  { label: 'Settings', icon: 'settings', url: '/settings' },
  { label: 'Tools', icon: 'wrench', children: [
    { label: 'Terminal', icon: 'terminal', url: '/terminal' },
    { label: 'Debug', icon: 'bug', url: '/debug' },
  ]},
];
```

```html
<button fiboPopoverTriggerToggle>Open Menu
  <ng-template fiboPortalContent let-trigger>
    <fibo-menu fiboPopover [items]="items" [trigger]="trigger" placement="bottom-start" />
  </ng-template>
</button>
```

**Declarative:**

```html
<button #menu="PopoverTrigger" fiboPopoverTriggerToggle>Menu</button>
@if (menu.isOpen()) {
  <fibo-menu fiboPopover [trigger]="menu">
    <a fiboMenuItem class="datalist-item" routerLink="/page1">Page 1</a>
    <a fiboMenuItem class="datalist-item" routerLink="/page2">Page 2</a>
  </fibo-menu>
}
```

**Menu with selection:**

```html
<fibo-menu fiboPopover [items]="items" [trigger]="trigger" fiboSelectOne [(value)]="selectedValue" />
```

#### Tree Menu

Hierarchical collapsible navigation menu for sidebars.

```html
<fibo-tree-menu [items]="menuItems" />
```

**MenuItemType:**

```typescript
type MenuItemType = {
  label: string;
  url?: string;
  icon?: any;
  badge?: string | number;
  children?: MenuItemType[];
  disabled?: boolean;
  content?: TemplateRef<any>;
  callback?: () => void;
  value?: any;
}
```

---

### Table

Data table with sortable columns, row selection, and custom cell templates.

```html
<fibo-table [dataSource]="users()" fiboDataList fiboSelectMulti [(value)]="selected" [(sort)]="sort">

  <div *fiboColumn="'name'; source: users(); isSortable: true; let user">
    {{ user.name }}
  </div>

  <span *fiboColumn="'email'; header: 'Email'; source: users(); let user">
    {{ user.email }}
  </span>

  <span *fiboColumn="'role'; header: 'Role'; source: users(); isSortable: true; let user">
    {{ user.role }}
  </span>

</fibo-table>
```

**Table inputs:** `dataSource: T[]`, `sort: model<{ sortBy: string; sortOrder: string } | null>`

**Column directive inputs:** `fiboColumn` (key), `header`, `source`, `isSortable`, `thClass`, `tdClass`

Column template context: `$implicit` (row), `value` (cell value), `key` (column key).

Row selection uses CDK's `fiboDataList` + `fiboSelectMulti` directives.

---

### Listbox

Selectable list of items with keyboard navigation.

```html
<fibo-listbox [items]="items" fiboSelectOne [(value)]="selected" />
```

**Inputs:** `items: T[]`, `itemTemplate: TemplateRef`, `valueProp` (default `'value'`), `labelProp` (default `'label'`), `disabled`

---

### Loading Spin

SVG spinner component.

```html
<fibo-loading-spin [strokeWidth]="4" />
```

---

## CSS Utility Classes

The library provides CSS classes for consistent styling:

| Class | Description |
|---|---|
| `.btn` | Base button |
| `.btn-primary` | Primary (blue) button |
| `.btn-secondary` | Secondary (gray) button |
| `.btn-danger` | Danger (red) button |
| `.btn-inverse` | Inverse theme button |
| `.btn-text` | Text-only button |
| `.btn-chip` | Chip/tag button |
| `.btn-sm` | Small button size |
| `.form-field-control` | Form field container |
| `.form-field-label` | Floating label |
| `.text-field-input` | Text input |
| `.form-field-error` | Validation error text |
| `.datalist-item` | List option item (select, menu, listbox) |
| `.popover-container` | Popover dropdown container |
| `.fibo-card` | Card container |
| `.fibo-input` | Styled input element |

---

## Development

```bash
# Build (CDK must be built first)
ng build @fibo-ui/cdk && ng build @fibo-ui/components

# Test
ng test @fibo-ui/components

# Publish
cd dist/fibo-ui/components && npm publish
```

## License

MIT
