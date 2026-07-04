# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

fibo-ui is an Angular 21 component library monorepo containing two publishable libraries (`@fibo-ui/cdk` and `@fibo-ui/components`) and a demo application that showcases them. The app uses zoneless change detection, signal-based state management, and Tailwind CSS 4.

## Library Philosophy

> **"CDK робить важке. Компонент — простий blueprint. Розробник або використовує as-is, або збирає своє."**

Signal-native, composition-first бібліотека. CDK дає headless behavior primitives (навігація, selection, overlay, a11y). Components — повноцінний набір готових компонентів (Select, Table, DatePicker, Menu, Dialog...) і водночас читабельні blueprints до 100 рядків. Три рівні: використовуй напряму, композиціюй, або будуй бізнес-компоненти з тих самих CDK-блоків.

Детальний розбір: **[docs/philosophy.md](docs/philosophy.md)**

## Architecture


**Build dependency chain:** CDK → Components → App. The `angular.json` `dependsOn` config handles this automatically.

**Path aliases** (tsconfig.json): `@fibo-ui/cdk` and `@fibo-ui/components` point to local source for development.

### Key Architectural Patterns

**Overlay system (CDK):** Components like Select, DatePicker, Menu, dialogs, and tooltips render floating content through the unified overlay API — `createOverlay(factory)` with overlay sessions, shells (modal/drawer/connected/plain), triggers, and positioning via `@floating-ui/dom`.

**Data list + selection model:** `DataList` directive manages collections of items with keyboard navigation. Selection behavior is composed via `SelectOne` or `SelectMulti` models. Used by Select, Listbox, and Menu.

**Form system:** Signal-based forms using `@angular/forms/signals`. Components implement `FormValueControl<T>` interface with `value`, `required`, `disabled`, `touched`, `invalid`, `dirty`, and `errors` signals. The CDK field stack (`FieldContainer`, `FieldLabel`, `FieldInput`, `FieldInteractive`, `FieldOverlay`, `FieldUiState`, `FieldTarget`) provides composition primitives; `TextField`, `PasswordField`, and `DatePickerField` are the main field components.

**Confirmation/Notification services:** `ConfirmationService` and `ConfirmationTrigger` handle confirm dialogs. `Notifier` service provides `success()`, `error()`, `warning()`, `info()` methods with signal-based state and auto-dismiss.

**Theme system:** `ThemeService` supports light/dark/system modes, persisted to localStorage, applied via `data-theme` attribute on `<html>`.

## Documentation Structure

Two separate documentation directories with different purposes:

**`public/documentation/`** — Public-facing docs served by the demo app. This is the user-facing API reference. Each subdirectory maps to a page rendered by `doc-viewer` in the app.
- `public/documentation/cdk/` — CDK public API docs (`overlays.md`, `data-list.md`, `selection-model.md`, `composition.md`)
- `public/documentation/<component>/` — Component-level docs (dialog, menu, select, etc.)
- Rules: Keep concise, user-oriented, no internal implementation details.

**`docs/`** — Internal developer documentation. Not served publicly. For architectural decisions, code reviews, proposals, implementation analysis, and developer notes.
- `docs/philosophy.md` — library philosophy and layering
- `docs/form-field-stack.md`, `docs/styling-system.md` — subsystem deep dives
- Rules: Detailed, can reference internal code paths, intended for team and AI context.

## Local Machine Context

Machine-specific notes (reference library checkouts, local paths) live in `CLAUDE.local.md`, which is gitignored. See it for the **ref-libs** setup if present.
