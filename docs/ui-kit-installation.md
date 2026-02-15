---
title: Fibo UI Kit Installation
description: Short setup guide for @fibo-ui/cdk and @fibo-ui/components.
status: draft
last_updated: 2026-02-15
---

# Fibo UI Kit Installation (Short)

## 1. Required stack

- Angular 21+
- Tailwind CSS 4.0.0 or newer
- `lucide-angular`

## 2. Install packages

Install both libraries:

- `@fibo-ui/cdk`
- `@fibo-ui/components`

Install peer dependencies required by the libraries (Angular packages, `@floating-ui/dom`, `date-fns`, `ngxtension`, `rxjs`, `tailwindcss`, `lucide-angular`).

## 3. Initial app setup (mandatory)

### 3.1 Global style imports

In your global stylesheet, import:

- `@fibo-ui/components/theme`
- `@fibo-ui/components/buttons`
- `@fibo-ui/components/components`
- `@fibo-ui/components/src/form-fields.css`

### 3.2 Root overlay/portal containers

In the root app template, render:

- `<fibo-tooltip-container>`
- `<fibo-dialog>`
- `<fibo-drawer>`
- `<fibo-confirmation>`
- `<fibo-notification>`
- `<fibo-portal-outlet>`

### 3.3 Icons registration

Register required Lucide icons in `app.config.ts` with `LUCIDE_ICONS` + `LucideIconProvider`.

## 4. Important note

`@fibo-ui/components` depends on `@fibo-ui/cdk`, so CDK must always be installed and available.
