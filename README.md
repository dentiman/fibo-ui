# Fibo UI

[![Live Demo](https://img.shields.io/badge/Live%20Demo-fibo--ui-6366f1?logo=githubpages&logoColor=white)](https://dentiman.github.io/fibo-ui/)
[![CI](https://github.com/dentiman/fibo-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/dentiman/fibo-ui/actions/workflows/ci.yml)
[![npm @fibo-ui/cdk](https://img.shields.io/npm/v/%40fibo-ui%2Fcdk?label=%40fibo-ui%2Fcdk)](https://www.npmjs.com/package/@fibo-ui/cdk)
[![npm @fibo-ui/components](https://img.shields.io/npm/v/%40fibo-ui%2Fcomponents?label=%40fibo-ui%2Fcomponents)](https://www.npmjs.com/package/@fibo-ui/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

A signal-native UI component library for **Angular 21** — accessible, themeable, and pleasantly small. Ready-made components when you want to move fast, headless primitives when you want to build your own.

**🔗 Live demo & documentation → [dentiman.github.io/fibo-ui](https://dentiman.github.io/fibo-ui/)**

> **Status: beta.** APIs may change between minor versions until 1.0.

## Highlights

- 🎯 **Signal-native** — built on Angular signals and signal forms from top to bottom
- ⚡ **Zoneless-ready** — no Zone.js, no change-detection surprises
- ♿ **Accessible by default** — keyboard navigation, focus management, and ARIA baked in
- 🧩 **Two layers** — drop in styled components, or compose your own from headless primitives
- 🎨 **Themeable** — Tailwind CSS 4 design tokens with automatic light/dark mode
- 📖 **Readable** — most components are under 100 lines, so they double as blueprints

## Components

### Forms & Inputs

| Component | Description |
|---|---|
| **Text Field** | Labeled text input with leading icons and an optional clear button |
| **Password Field** | Password input with a show / hide toggle |
| **Select** | Single-choice dropdown with full keyboard navigation |
| **Multiple Select** | Multi-choice select with removable chips |
| **Combobox** | Autocomplete input that filters options as you type |
| **Datepicker** | Date field backed by a calendar popover |
| **Calendar** | Standalone, inline calendar for picking dates |
| **Checkbox** | Accessible checkbox with an indeterminate state |
| **Switch** | Toggle switch in multiple sizes |

### Overlays & Feedback

| Component | Description |
|---|---|
| **Dialog** | Modal dialog opened from any trigger |
| **Drawer** | Slide-in side panel for secondary content and forms |
| **Tooltip** | Lightweight hover / focus hint with smart positioning |
| **Confirmation** | Promise-based confirm dialogs from a single service |
| **Notifications** | Toast stack with success / error / warning / info and auto-dismiss |

### Navigation & Menus

| Component | Description |
|---|---|
| **Menu** | Dropdown menu with keyboard navigation and nested submenus |
| **Tree Menu** | Hierarchical navigation with active-route detection |
| **Side Menu** | Collapsible sidebar navigation |

### Data Display

| Component | Description |
|---|---|
| **Table** | Data table with sortable columns and single / multi row selection |
| **Listbox** | Selectable list, single or multiple choice |
| **Button** | Button styling across appearances and sizes |
| **Loading Spinner** | Inline loading indicator |

Every component is documented with live, editable examples in the **[demo app](https://dentiman.github.io/fibo-ui/)**.

## Installation

```bash
npm install @fibo-ui/components @fibo-ui/cdk
```

Import the theme and the styles for the components you use (in your global stylesheet):

```css
@import '@fibo-ui/components/theme' layer(theme);   /* design tokens + dark mode */
@import '@fibo-ui/components/styles/form-field';
@import '@fibo-ui/components/styles/overlay';
/* …see the docs for the full list of style entry points */
```

Dark mode is driven by a `data-theme="dark"` attribute on `<html>` — every token switches automatically. Icons come from [Lucide](https://lucide.dev/).

## Quick start

**Form fields with signal forms**

```typescript
userModel = signal({ username: '', birthDate: '' });
userForm = form(this.userModel, (path) => {
  required(path.username, { message: 'Username is required' });
});
```

```html
<fibo-text-field [formField]="userForm.username" label="Username" iconStart="user" />
<fibo-datepicker [formField]="userForm.birthDate" label="Birth Date" />
```

**Dialogs and drawers from any trigger**

```html
<button fiboButton fiboDialogTrigger [content]="dialogTpl">Open Dialog</button>
<button fiboButton fiboDrawerTrigger [content]="drawerTpl">Open Drawer</button>

<ng-template #dialogTpl>Dialog body here</ng-template>
<ng-template #drawerTpl>Drawer body here</ng-template>
```

**Notifications**

```typescript
private notifier = inject(Notifier);

this.notifier.success('Saved!');
this.notifier.error('Something went wrong.', 0);   // 0 = stays until dismissed
```

## Two packages, three ways to use them

> "The CDK does the hard part. A component is a simple blueprint. Developers use it as-is — or compose their own."

- **[`@fibo-ui/components`](https://www.npmjs.com/package/@fibo-ui/components)** — the ready-to-use, styled components above.
- **[`@fibo-ui/cdk`](https://www.npmjs.com/package/@fibo-ui/cdk)** — the headless behavior primitives underneath them (overlays, keyboard navigation, selection models, form-field composition, accessibility). No styles, so you can build a design system of your own.

That gives you three levels: **use** a component directly, **compose** components together, or **build** your own from the same CDK blocks. More on the thinking behind it in [docs/philosophy.md](./docs/philosophy.md).

## Documentation

- **[Live docs & examples](https://dentiman.github.io/fibo-ui/)** — the primary, user-facing reference
- **[docs/](./docs)** — architecture notes and subsystem deep dives for contributors

## Development

```bash
npm install
npm start              # dev server at http://localhost:4200
npm run build:libs     # build both libraries (CDK → Components)
npm test               # run unit tests
```

Contributions are welcome — the codebase is intentionally small and readable.

## License

[MIT](./LICENSE) © Denys Timanovskiy
