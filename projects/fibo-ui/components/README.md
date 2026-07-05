# @fibo-ui/components

Signal-native **Angular UI components** built on [`@fibo-ui/cdk`](https://www.npmjs.com/package/@fibo-ui/cdk) and styled with **Tailwind CSS 4** design tokens. Zoneless-ready, accessible, and intentionally readable — most components are under 100 lines, so they double as blueprints for your own.

**🔗 Live demo & docs → [dentiman.github.io/fibo-ui](https://dentiman.github.io/fibo-ui/)**

> **Status: beta.** APIs may change between minor versions until 1.0.

## Components

| Category | Components |
|---|---|
| Form controls | `TextField`, `PasswordField`, `DatePickerField`, `Select`, `MultiSelect`, `Combobox`, `Calendar`, `Checkbox`, `Switch` |
| Overlays | Dialog & Drawer (via CDK triggers), `Tooltip`, `Confirmation`, `Notifier` (toasts) |
| Navigation | `Menu`, `TreeMenu`, `SideMenu` |
| Data | `Table` (sorting, selection), `Listbox` |
| Misc | `Button`, `LoadingSpin`, `Appearance`/`Size` styling directives |

## Installation

```bash
npm install @fibo-ui/components @fibo-ui/cdk
```

Peer dependencies: Angular 21+, `@floating-ui/dom`, `date-fns`, `lucide-angular`, `rxjs`, `tailwindcss` 4.

## Setup

**1. Providers** (`app.config.ts`):

```typescript
import { provideOverlays } from '@fibo-ui/components';
import { LUCIDE_ICONS, LucideIconProvider, User, Mail, X } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideOverlays(),
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ User, Mail, X }) },
  ],
};
```

Any overlay shell can be replaced: `provideOverlays(withShell(DRAWER_SHELL_TOKEN, MyDrawerShell))`.

**2. Styles** (`styles.css`, Tailwind CSS 4):

```css
@layer theme, base, appearance, field-rules, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css' layer(utilities);

@import '@fibo-ui/components/theme' layer(theme);
@import '@fibo-ui/components/styles/appearance';
@import '@fibo-ui/components/styles/form-field';
@import '@fibo-ui/components/styles/datalist';
@import '@fibo-ui/components/styles/overlay';
@import '@fibo-ui/components/styles/checkbox';
@import '@fibo-ui/components/styles/switch';
@import '@fibo-ui/components/styles/button';
```

Dark mode: set `data-theme="dark"` on `<html>` — all design tokens switch automatically.

## Usage

### Form fields with signal forms

```typescript
import { signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';

userModel = signal({ username: '', email: '', birthDate: '' });
userForm = form(this.userModel, (path) => {
  required(path.username, { message: 'Username is required' });
});
```

```html
<fibo-text-field [formField]="userForm.username" label="Username" iconStart="user" />
<fibo-text-field [formField]="userForm.email" label="Email" type="email" />
<fibo-datepicker [formField]="userForm.birthDate" label="Birth Date" />
```

### Dialog and drawer

```html
<button fiboButton fiboDialogTrigger [content]="dialogTpl">Open Dialog</button>
<ng-template #dialogTpl>Dialog body</ng-template>
```

### Notifications

```typescript
private notifier = inject(Notifier);

this.notifier.success('Saved!');
this.notifier.error('Failed.', 0); // 0 = no auto-dismiss
```

### Tooltip

```html
<button [fiboTooltip]="'Save changes'" placement="top">Save</button>
```

## Documentation

Full guides with live examples are served by the [demo app](https://github.com/dentiman/fibo-ui) (`npm start`).

## License

[MIT](https://github.com/dentiman/fibo-ui/blob/main/LICENSE) © Denys Timanovskiy
