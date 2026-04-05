# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

fibo-ui is an Angular 21 component library monorepo containing two publishable libraries (`@fibo-ui/cdk` and `@fibo-ui/components`) and a demo application that showcases them. The app uses zoneless change detection, signal-based state management, and Tailwind CSS 4.

## Architecture


**Build dependency chain:** CDK → Components → App. The `angular.json` `dependsOn` config handles this automatically.

**Path aliases** (tsconfig.json): `@fibo-ui/cdk` and `@fibo-ui/components` point to local source for development.

### Key Architectural Patterns

**Popover/Portal system (CDK):** Components like Select, DatePicker, and Menu render floating content through `PortalContent` + `PortalOutlet` with positioning via `@floating-ui/dom`. `PopoverTrigger` manages open/close state.

**Data list + selection model:** `DataList` directive manages collections of `Option` items. Selection behavior is composed via `SelectOne` or `SelectMulti` models. Used by Select, Listbox, and Menu.

**Form system:** Signal-based forms using `@angular/forms/signals`. Components implement `FormValueControl<T>` interface with `value`, `required`, `disabled`, `touched`, `invalid`, `dirty`, and `errors` signals. `FormFieldControl` provides the container with label and icon support. `TextField` and `DatePickerField` are the main field components.

**Dialog/Notification services:** `DialogService` manages modal state. `Notifier` service provides `success()`, `error()`, `warning()`, `info()` methods with signal-based state and auto-dismiss.

**Theme system:** `ThemeService` supports light/dark/system modes, persisted to localStorage, applied via `data-theme` attribute on `<html>`.

## Documentation Structure

Two separate documentation directories with different purposes:

**`public/documentation/`** — Public-facing docs served by the demo app. This is the user-facing API reference. Each subdirectory maps to a page rendered by `doc-viewer` in the app.
- `public/documentation/cdk/` — CDK public API docs (`overlays.md`, `data-list.md`, `selection-model.md`, `composition.md`)
- `public/documentation/<component>/` — Component-level docs (dialog, menu, select, etc.)
- Rules: Keep concise, user-oriented, no internal implementation details.

**`docs/`** — Internal developer documentation. Not served publicly. For architectural decisions, code reviews, proposals, implementation analysis, and developer notes.
- `docs/overlay/` — Overlay system internals: code review, FocusTrap proposal, improvements status, full architecture guide
- `docs/combobox-*.md` — Combobox pattern research and implementation analysis
- Rules: Detailed, can reference internal code paths, intended for team and AI context.

## Reference Libraries (ref-libs)

Соседние репозитории в `/Users/dentiman/dev/projects/fibo-stack/` — популярные Angular design system библиотеки для справки и изучения паттернов. Обращайся к ним по ключевому слову **ref-libs**.

| Папка        | Библиотека              | Описание |
|--------------|-------------------------|----------|
| `angular`    | Angular (angular/angular) | Исходники Angular core, CDK, forms, compiler-cli |
| `components` | Angular Components (angular/components) | Angular Material + CDK |
| `spartan`    | Spartan (spartan-ng/spartan) | Headless UI для Angular, сигналы, SSR, zoneless |
| `taiga-ui`   | Taiga UI v4 (taiga-family/taiga-ui) | Полноценная UI-система, ng-polymorpheus (стара версія) |
| `taiga-ui-5` | Taiga UI v5 (taiga-family/taiga-ui) | Taiga UI 5.0.0 — нова мажорна версія |
| `zart`       | Zard UI (zard-ui/zardui) | Angular компоненты на базе Shadcn/ui + ng-zorro |

Чтобы поискать паттерн во всех ref-libs: `grep -r "паттерн" /Users/dentiman/dev/projects/fibo-stack/{angular,components,spartan,taiga-ui,taiga-ui-5,zart}`.
