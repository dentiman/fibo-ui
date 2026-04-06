# Fibo UI

Angular UI component library monorepo — two publishable packages and a demo application.

Built with **Angular 21**, **Tailwind CSS 4**, **TypeScript 5.9** (strict mode), and **zoneless change detection**.

## Packages

| Package | Version | Description |
|---|---|---|
| [`@fibo-ui/cdk`](./projects/fibo-ui/cdk) | 0.0.9 | Core Development Kit — low-level directives, utilities, and base controls (popover, portal, data-list, form-field, selection models) |
| [`@fibo-ui/components`](./projects/fibo-ui/components) | 0.1.11 | UI Components — built on top of CDK (form fields, select, menu, dialog, table, calendar, notification, tooltip, and more) |

**Build dependency chain:** `@fibo-ui/cdk` → `@fibo-ui/components` → demo app.

## Getting Started

```bash
npm install
npm start          # Dev server at http://localhost:4200
```

## Commands

| Command | Description |
|---|---|
| `npm start` | Start dev server (http://localhost:4200) |
| `npm run build` | Build all projects (CDK → Components → App) |
| `npm run build:prod` | Production build |
| `npm test` | Run app unit tests (Karma + Jasmine) |
| `ng test @fibo-ui/cdk` | Run CDK library tests |
| `ng test @fibo-ui/components` | Run Components library tests |
| `ng build @fibo-ui/cdk` | Build CDK library only |
| `ng build @fibo-ui/components` | Build Components library only |

## Project Structure

```
├── src/                              # Demo application
│   ├── app/
│   │   ├── pages/                    # Component demo pages (one per component)
│   │   ├── common/                   # Shared services (theme, code highlighting)
│   │   └── layout/                   # App shell, navigation
│   └── styles.css                    # Global styles + library CSS imports
│
├── projects/fibo-ui/
│   ├── cdk/                          # @fibo-ui/cdk
│   │   └── src/lib/
│   │       ├── popover/              # Popover + PopoverTrigger (Floating UI)
│   │       ├── portal/              # OverlayRegistry, PortalContent, OverlayOutlet
│   │       ├── data-list/           # DataList, DataListItem, SelectOne, SelectMulti
│   │       ├── form/                # FormFieldDirective, FiboInput
│   │       ├── common/              # IsEmpty, RandomId
│   │       └── utils/               # Property utilities
│   │
│   └── components/                   # @fibo-ui/components
│       └── src/
│           ├── lib/
│           │   ├── form/            # TextField, DatePickerField, FormFieldControl
│           │   ├── select/          # Select, MultiSelect
│           │   ├── calendar/        # Calendar, DateSelectionModel, DateRangeSelectionModel
│           │   ├── menu/            # Menu, TreeMenu, MenuItem, MenuPanel
│           │   ├── dialog/          # FiboDialog, DialogTrigger, DialogService
│           │   ├── notification/    # Notification, Notifier service
│           │   ├── confirmation/    # Confirmation, ConfirmationTrigger, ConfirmationService
│           │   ├── tooltip/         # Tooltip directive, TooltipService
│           │   ├── table/           # Table, FiboColumn, FiboTableRow
│           │   ├── data-list/       # Listbox
│           │   ├── checkbox/        # Checkbox
│           │   ├── switch/          # Switch
│           │   └── loading-spin/    # LoadingSpin
│           ├── theme.css            # CSS custom properties (light + dark)
│           ├── buttons.css          # Button classes
│           ├── components.css       # Component utility classes
│           └── form-fields.css      # Form field classes
```

## Architecture

### CDK Layer (`@fibo-ui/cdk`)

Behavior-only primitives with no styling. Components library builds on these.

- **Popover system** — `PopoverTrigger` (click/toggle variants) manages open state, `Popover` handles positioning via `@floating-ui/dom` and click-outside dismissal, `PopoverPosition` computes placement
- **Portal system** — `PortalContent` directive marks template content, `OverlayOutlet` renders it at a different DOM location, `OverlayRegistry` connects them. Used by all floating UI (menus, selects, dialogs)
- **DataList + Selection** — `DataList` manages a list of `DataListItem` directives with keyboard navigation (arrow keys, active state tracking). `SelectOne` and `SelectMulti` are selection model directives that plug into any DataList. Used by Select, Menu, Table, Listbox
- **Form field directives** — `FormFieldDirective` tracks form state (touched, invalid, dirty, errors) via content projection

### Components Layer (`@fibo-ui/components`)

Styled components composed from CDK primitives.

- **Form components** implement `FormValueControl<T>` interface — `value`, `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors` signals. Integrates with `@angular/forms/signals` via `[formField]` binding
- **Menu system** — `Menu` uses CDK's DataList + Popover for floating menus with nested submenus. `TreeMenu` renders hierarchical collapsible navigation with active URL detection
- **Dialog** — `DialogTrigger` directive opens modal/drawer via `DialogService`. Supports `'dialog'` and `'drawer'` modes
- **Notification** — `Notifier` service manages a signal-based stack of toasts with auto-dismiss timers

### Styling

Components ship CSS files as package exports:

```css
@import '@fibo-ui/components/theme';        /* CSS custom properties */
@import '@fibo-ui/components/buttons';       /* .btn, .btn-primary, etc. */
@import '@fibo-ui/components/components';    /* .datalist-item, .fibo-card, etc. */
```

Dark mode uses `data-theme="dark"` attribute on `<html>`. All CSS custom properties switch automatically.

Icons: [Lucide Angular](https://lucide.dev/guide/packages/lucide-angular) — tree-shakeable, registered in `app.config.ts`.

## Component Usage Examples

### Form Fields with Signal Forms

```typescript
import { signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';

userModel = signal({ username: '', birthDate: '' });
userForm = form(this.userModel, (path) => {
  required(path.username, { message: 'Username is required' });
});
```

```html
<fibo-text-field [formField]="userForm.username" label="Username" />
<fibo-datepicker [formField]="userForm.birthDate" label="Birth Date" />
```

### Dialog

```html
<button [fiboDialogTrigger]="content">Open Dialog</button>
<button [fiboDialogTrigger]="content" [fiboDialogConfig]="{ mode: 'drawer' }">Open Drawer</button>

<ng-template #content>
  <div>Dialog body here</div>
</ng-template>
```

### Table with Sort and Selection

```html
<fibo-table [dataSource]="users()" fiboDataList fiboSelectMulti [(value)]="selected" [(sort)]="sort">
  <div *fiboColumn="'name'; source: users(); isSortable: true; let user">
    {{ user.name }}
  </div>
  <span *fiboColumn="'email'; header: 'Email'; source: users(); let user">
    {{ user.email }}
  </span>
</fibo-table>
```

### Notifications

```typescript
private notifier = inject(Notifier);

this.notifier.success('Saved!');
this.notifier.error('Failed.', 0);       // 0 = no auto-dismiss
this.notifier.warning('Warning!', 8);     // 8 seconds
```

### Tooltip

```html
<button [fiboTooltip]="'Save changes'" placement="top">Save</button>
```

For complete API reference and all component examples, see the [`@fibo-ui/components` README](./projects/fibo-ui/components/README.md).

## Publishing

```bash
ng build @fibo-ui/cdk && ng build @fibo-ui/components
cd dist/fibo-ui/cdk && npm publish
cd dist/fibo-ui/components && npm publish
```

## License

MIT
