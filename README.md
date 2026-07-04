# Fibo UI

[![CI](https://github.com/dentiman/fibo-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/dentiman/fibo-ui/actions/workflows/ci.yml)
[![npm @fibo-ui/cdk](https://img.shields.io/npm/v/%40fibo-ui%2Fcdk?label=%40fibo-ui%2Fcdk)](https://www.npmjs.com/package/@fibo-ui/cdk)
[![npm @fibo-ui/components](https://img.shields.io/npm/v/%40fibo-ui%2Fcomponents?label=%40fibo-ui%2Fcomponents)](https://www.npmjs.com/package/@fibo-ui/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Signal-native Angular UI library monorepo — two publishable packages and a demo application.

Built with **Angular 21**, **Tailwind CSS 4**, **TypeScript 5.9** (strict mode), and **zoneless change detection**.

> **Status: beta.** APIs may change between minor versions until 1.0.

## Philosophy

> "The CDK does the hard part. A component is a simple blueprint. Developers use it as-is — or compose their own."

- **[`@fibo-ui/cdk`](./projects/fibo-ui/cdk)** — headless behavior primitives: overlays, keyboard navigation, selection models, form field composition, a11y. No styles.
- **[`@fibo-ui/components`](./projects/fibo-ui/components)** — ready-to-use styled components (Select, Combobox, DatePicker, Menu, Dialog, Table…) that double as readable blueprints, most under 100 lines.

Three levels of usage: use components directly, compose them, or build your own business components from the same CDK blocks. See [docs/philosophy.md](./docs/philosophy.md).

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
| `npm run build:libs` | Build both libraries |
| `npm run build:prod` | Production build |
| `npm test` | Run app unit tests (Karma + Jasmine) |
| `ng test @fibo-ui/cdk` | Run CDK library tests |
| `ng test @fibo-ui/components` | Run Components library tests |

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
│   ├── cdk/                          # @fibo-ui/cdk — headless primitives
│   │   └── src/lib/
│   │       ├── overlay/              # createOverlay, triggers, shells, positioning
│   │       ├── data-list/            # DataList, SelectOne/SelectMulti selection models
│   │       ├── form/                 # Field composition stack (container, label, input…)
│   │       ├── menu/                 # Expandable, submenu triggers, route expansion
│   │       ├── table/                # Column and row primitives
│   │       ├── date/                 # DateAdapter, date/date-range selection
│   │       └── common/               # IsEmpty, RandomId, utilities
│   │
│   └── components/                   # @fibo-ui/components — styled components
│       └── src/
│           ├── lib/
│           │   ├── form-controls/    # TextField, PasswordField, DatePicker, Select,
│           │   │                     # MultiSelect, Combobox, Calendar, Checkbox, Switch
│           │   ├── overlay/          # Shells, Tooltip, Confirmation, Notification
│           │   ├── menu/             # Menu, TreeMenu, SideMenu
│           │   ├── data-list/        # Listbox
│           │   ├── table/            # Table
│           │   ├── buttons/          # Button directive
│           │   └── primitives/       # Appearance, Size styling directives
│           ├── theme.css             # CSS custom properties (light + dark)
│           └── styles/               # Per-subsystem CSS (form-field, overlay, button…)
│
├── public/documentation/             # User-facing docs rendered by the demo app
└── docs/                             # Internal architecture notes and deep dives
```

## Architecture

### CDK Layer (`@fibo-ui/cdk`)

Behavior-only primitives with no styling. The components library builds on these.

- **Overlay system** — a single `createOverlay(factory)` API powers every floating surface. Overlay *sessions* manage open state, focus restore, and stacking; *shells* (modal, drawer, connected, plain) define presentation; `DialogTrigger`, `DrawerTrigger`, and `PopoverTrigger` are thin directives on top. Positioning via `@floating-ui/dom`
- **DataList + selection** — `DataList` manages a list of `DataListItem` directives with keyboard navigation. `SelectOne` / `SelectMulti` selection models plug into any DataList. Used by Select, Menu, Table, Listbox
- **Field stack** — composition primitives for form fields: `FieldContainer`, `FieldLabel`, `FieldInput`, `FieldInteractive`, `FieldOverlay`, with shared UI state (`FieldUiState`) and focus targeting (`FieldTarget`)
- **Menu primitives** — `Expandable`, `SubmenuTrigger`, expand-on-route/selection behaviors
- **Date primitives** — `DateAdapter`, `SelectDate`, `SelectDateRange` models

### Components Layer (`@fibo-ui/components`)

Styled components composed from CDK primitives.

- **Form components** implement the `FormValueControl<T>` interface — `value`, `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors` signals. Integrate with `@angular/forms/signals` via the `[formField]` binding
- **Overlay shells** — `provideOverlays()` registers default shells; `withShell(TOKEN, Component)` overrides any of them
- **Menu system** — `Menu` builds on CDK DataList + overlay triggers; `TreeMenu` renders hierarchical navigation with active-URL detection
- **Notifier** — signal-based toast stack with auto-dismiss

### Styling

The components package ships plain CSS as package exports:

```css
@import '@fibo-ui/components/theme' layer(theme);   /* CSS custom properties */
@import '@fibo-ui/components/styles/appearance';
@import '@fibo-ui/components/styles/form-field';
@import '@fibo-ui/components/styles/datalist';
@import '@fibo-ui/components/styles/overlay';
@import '@fibo-ui/components/styles/checkbox';
@import '@fibo-ui/components/styles/switch';
@import '@fibo-ui/components/styles/button';
```

Dark mode uses the `data-theme="dark"` attribute on `<html>` — all CSS custom properties switch automatically.

Icons: [Lucide Angular](https://lucide.dev/guide/packages/lucide-angular) — tree-shakeable, registered in `app.config.ts`.

## Usage Examples

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
<fibo-text-field [formField]="userForm.username" label="Username" iconStart="user" />
<fibo-datepicker [formField]="userForm.birthDate" label="Birth Date" />
```

### Dialog and Drawer

```html
<button fiboButton fiboDialogTrigger [content]="dialogTpl">Open Dialog</button>
<button fiboButton fiboDrawerTrigger [content]="drawerTpl">Open Drawer</button>

<ng-template #dialogTpl>Dialog body here</ng-template>
<ng-template #drawerTpl>Drawer body here</ng-template>
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
this.notifier.warning('Warning!', 8);     // seconds
```

### Tooltip

```html
<button [fiboTooltip]="'Save changes'" placement="top">Save</button>
```

For the complete API reference, run the demo app (`npm start`) — it serves the docs from [public/documentation](./public/documentation).

## Publishing

```bash
npm run build:libs
cd dist/fibo-ui/cdk && npm publish --access public
cd ../components && npm publish --access public
```

## License

[MIT](./LICENSE) © Denys Timanovskiy
