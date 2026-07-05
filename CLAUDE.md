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

## Deployment (GitHub Pages)

The demo app is deployed to **GitHub Pages** at **https://dentiman.github.io/fibo-ui/** (a sub-path, not the domain root). Deployment is **fully automatic**: `.github/workflows/deploy.yml` runs on every push to `main` — it builds the libraries, builds the app with `--base-href /fibo-ui/`, adds a SPA fallback, and deploys. There is no manual build or upload step.

### Updating the docs

Public docs live in `public/documentation/**/*.md` and are **static assets copied verbatim into the build** — the app fetches them at runtime, it does not compile them. So to change documentation:

1. Edit the `.md` file under `public/documentation/`.
2. Commit and push to `main`.
3. The deploy workflow rebuilds and publishes automatically (~2–3 min). Nothing else is required — no code changes, no manual deploy.

To verify a docs change is live, fetch the raw file: `curl -s https://dentiman.github.io/fibo-ui/documentation/<path>.md`.

### Gotchas (do not regress these)

- **CI/deploy must run on Node 24.** The lockfile is generated with npm 11 (Node 24). Node 22 (npm 10) computes a different dependency tree and fails `npm ci` with a phantom "Missing chokidar@5.0.0 / readdirp@5.0.0". Both `ci.yml` and `deploy.yml` pin `node-version: 24`.
- **Doc URLs must resolve against `<base href>`.** Pages use root-relative `docUrl="/documentation/..."`, which would 404 under the `/fibo-ui/` sub-path. This is handled centrally by `resolveAssetUrl()` in `src/app/common/shiki-highlighter.service.ts` (`new URL(path, document.baseURI)`), applied in both `createMarkdownResource` and `createDocResource`. Keep new doc pages using the `/documentation/...` form — the service normalizes them; do not hardcode `/fibo-ui/`.
- **SPA fallback.** The workflow copies `index.html` → `404.html`, so deep links work. Deep links return HTTP 404 *status* but serve the Angular shell (cosmetic only).
- **Transient deploy failures.** The `build` job can succeed while the `deploy` step fails with "Deployment failed, try again later" (a GitHub Pages API hiccup). Re-run just the failed job: `gh run rerun <run-id> --failed`. Do not re-push.
- **`github-pages` environment** must allow deploys from `main` (deployment branch policy). Already configured.

## Local Machine Context

Machine-specific notes (reference library checkouts, local paths) live in `CLAUDE.local.md`, which is gitignored. See it for the **ref-libs** setup if present.
