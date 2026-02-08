# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

fibo-ui is an Angular 21 component library monorepo containing two publishable libraries (`@fibo-ui/cdk` and `@fibo-ui/components`) and a demo application that showcases them. The app uses zoneless change detection, signal-based state management, and Tailwind CSS 4.

## Commands

- `npm start` — Dev server at http://localhost:4200
- `npm test` — Run unit tests (Karma + Jasmine)
- `npm run build` — Build all projects (CDK → Components → App, in dependency order)
- `npm run build:prod` — Production build
- `ng test @fibo-ui/cdk` — Test only CDK library
- `ng test @fibo-ui/components` — Test only Components library

## Architecture

### Monorepo Structure

```
projects/fibo-ui/
├── cdk/          → @fibo-ui/cdk — Low-level directives, utilities, and base controls
│                   (popover, portal, form controls, data-list, utils)
└── components/   → @fibo-ui/components — UI components built on CDK
                    (calendar, checkbox, dialog, form fields, menu, notification,
                     select, switch, table, tooltip, data-list/listbox)

src/app/          → Demo application
├── pages/        → Component demo pages (one per component)
├── common/       → Shared services (theme, code highlighting, form examples)
└── layout/       → App layout and navigation
```

**Build dependency chain:** CDK → Components → App. The `angular.json` `dependsOn` config handles this automatically.

**Path aliases** (tsconfig.json): `@fibo-ui/cdk` and `@fibo-ui/components` point to local source for development.

### Key Architectural Patterns

**Popover/Portal system (CDK):** Components like Select, DatePicker, and Menu render floating content through `PortalContent` + `PortalOutlet` with positioning via `@floating-ui/dom`. `PopoverTrigger` manages open/close state.

**Data list + selection model:** `DataList` directive manages collections of `Option` items. Selection behavior is composed via `SelectOne` or `SelectMulti` models. Used by Select, Listbox, and Menu.

**Form system:** Signal-based forms using `@angular/forms/signals`. Components implement `FormValueControl<T>` interface with `value`, `required`, `disabled`, `touched`, `invalid`, `dirty`, and `errors` signals. `FormFieldControl` provides the container with label and icon support. `TextField` and `DatePickerField` are the main field components.

**Dialog/Notification services:** `DialogService` manages modal state. `Notifier` service provides `success()`, `error()`, `warning()`, `info()` methods with signal-based state and auto-dismiss.

**Theme system:** `ThemeService` supports light/dark/system modes, persisted to localStorage, applied via `data-theme` attribute on `<html>`.

## Code Conventions

- **Standalone components only** — do NOT set `standalone: true` (it's the default in Angular 21)
- **Signals everywhere** — use `signal()` for state, `computed()` for derived state, `model()` for two-way binding
- **`input()` / `output()` functions** — not `@Input()` / `@Output()` decorators
- **`inject()` function** — not constructor injection
- **`ChangeDetectionStrategy.OnPush`** on all components
- **Native control flow** — `@if`, `@for`, `@switch` (not `*ngIf`, `*ngFor`)
- **`host` object** in decorator — not `@HostBinding` / `@HostListener`
- **Class/style bindings** — not `ngClass` / `ngStyle`
- **`ViewEncapsulation.None`** on components that need global styling
- **Inline templates** preferred for small components
- **Icons:** Lucide Angular, registered in `app.config.ts` — tree-shakeable, use `<lucide-icon name="..." />`
- **Prettier:** 100 char width, single quotes, Angular HTML parser
- **Indentation:** 2 spaces