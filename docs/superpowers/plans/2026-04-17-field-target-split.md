# FieldTarget Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Розділити `FieldTarget` на дві concrete-primitive директиви `FieldInput` і `FieldButton` над спільною infrastructure-базою, усунути stringly-typed `fieldTargetMode`, мігрувати 5 споживачів form-field stack.

**Architecture:** `FieldTarget` стає hostDirective-only базою (ID + aria-*). `FieldInput` і `FieldButton` — concrete реалізатори `FieldTargetRef`, кожна з власною `activateFromShell` поведінкою. `FieldOverlay` переходить на `inject(FieldButton, optional)` замість mode-check. 6 атомарних комітів, кожен лишає репо compilable.

**Tech Stack:** Angular 21 (signals, hostDirectives, standalone), TypeScript, native CSS з `@layer field-rules`, Tailwind для layout utilities у демо.

**Referenced spec:** `docs/superpowers/specs/2026-04-17-field-target-split-design.md`

---

## File Structure

### Нові файли

| Path | Відповідальність |
|---|---|
| `projects/fibo-ui/components/src/lib/form-controls/form/field-input.ts` | Directive `[fiboFieldInput]` — focus-surface target для `<input>`/`<textarea>` |
| `projects/fibo-ui/components/src/lib/form-controls/form/field-button.ts` | Directive `[fiboFieldButton]` — activation-surface target для `<button>`/`<div>`/`<a>` |

### Змінювані файли

| Path | Зміна |
|---|---|
| `projects/fibo-ui/components/src/lib/form-controls/form/field-target.ts` | Стає чистою інфра-базою: видалено `fieldTargetMode`, `activateFromShell`, `registerInteractive` з конструктора. Перейменовано селектор на internal. |
| `projects/fibo-ui/components/src/lib/form-controls/form/field-overlay.ts` | Замість `inject(FieldTarget)` + `fieldTargetMode()` → `inject(ElementRef)` + `inject(FieldButton, optional)`. |
| `projects/fibo-ui/components/src/lib/form-controls/fields/text-field.ts` | `fiboFieldTarget` → `fiboFieldInput`. Прибрати `class="fibo-field-input"`. |
| `projects/fibo-ui/components/src/lib/form-controls/combobox/combobox.ts` | `fiboFieldTarget` → `fiboFieldInput`. Прибрати class. |
| `projects/fibo-ui/components/src/lib/form-controls/fields/datepicker-field.ts` | `fiboFieldTarget fieldTargetMode="click"` → `fiboFieldInput`. Спростити keydown handlers. Прибрати class. |
| `projects/fibo-ui/components/src/lib/form-controls/select/select.ts` | `fiboFieldTarget fieldTargetMode="click"` → `fiboFieldButton`. Прибрати `class="w-full text-left"`. |
| `projects/fibo-ui/components/src/lib/form-controls/select/multi-select.ts` | `fiboFieldTarget fieldTargetMode="click"` → `fiboFieldButton`. Прибрати manual tabindex, keydown enter/space, w-full, outline-none. |
| `projects/fibo-ui/components/src/styles/form-field.css` | Додати `.fibo-field-button` правила. |
| `projects/fibo-ui/components/src/public-api.ts` | Додати exports для `FieldInput`, `FieldButton`. |
| `docs/form-field-stack.md` | Переписати таблиці директив і споживачів, розширити розділ "Примітиви". Видалити TODO-2 (fibo-field-input). |
| `docs/styling-system.md` | Видалити TODO-2 (директива `[fiboFieldInput]` — завершено). |

---

## Commit Plan

| # | Сommit message | Tasks |
|---|---|---|
| 1 | `refactor(form-field): add FieldInput and FieldButton directives with shared base` | 1–4 |
| 2 | `refactor(text-field, combobox): migrate to FieldInput` | 5–7 |
| 3 | `refactor(datepicker-field): migrate to FieldInput with auto-open overlay on shell click` | 8–9 |
| 4 | `refactor(select, multi-select): migrate to FieldButton; refactor FieldOverlay to detect button` | 10–13 |
| 5 | `refactor(field-target): clean up base to pure infrastructure` | 14–15 |
| 6 | `docs: update form-field-stack and styling-system after FieldTarget split` | 16–18 |

---

## Task 1: Create FieldInput directive

**Files:**
- Create: `projects/fibo-ui/components/src/lib/form-controls/form/field-input.ts`

- [ ] **Step 1.1: Створити файл `field-input.ts` з повним вмістом**

```ts
import { Directive, ElementRef, inject } from '@angular/core';
import { FieldTarget } from './field-target';
import { FieldShellHost, type FieldTargetRef } from './field-shell-host';
import { FieldOverlay } from './field-overlay';

@Directive({
  selector: '[fiboFieldInput]',
  standalone: true,
  hostDirectives: [FieldTarget],
  host: {
    class: 'fibo-field-input',
  },
})
export class FieldInput implements FieldTargetRef {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly host = inject(FieldShellHost, { optional: true });
  private readonly overlay = inject(FieldOverlay, { optional: true, self: true });

  constructor() {
    this.host?.registerInteractive(this);
  }

  element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  focus(options?: FocusOptions): void {
    this.element().focus(options);
  }

  focusReturnTarget(): HTMLElement | null {
    return this.element();
  }

  activateFromShell(): void {
    this.focus();
    this.overlay?.open();
  }
}
```

- [ ] **Step 1.2: Верифікація build**

Run: `npm run build:components`
Expected: PASS (build completes without errors, FieldInput integrated)

---

## Task 2: Create FieldButton directive

**Files:**
- Create: `projects/fibo-ui/components/src/lib/form-controls/form/field-button.ts`

- [ ] **Step 2.1: Створити файл `field-button.ts`**

```ts
import { computed, Directive, ElementRef, inject } from '@angular/core';
import { FieldTarget } from './field-target';
import { FieldShellHost, type FieldTargetRef } from './field-shell-host';
import { FieldUiState } from './field-ui-state';

@Directive({
  selector: '[fiboFieldButton]',
  standalone: true,
  hostDirectives: [FieldTarget],
  host: {
    class: 'fibo-field-button',
    '[attr.tabindex]': 'tabindex()',
    '(keydown.enter)': 'activate($event)',
    '(keydown.space)': 'activate($event)',
  },
})
export class FieldButton implements FieldTargetRef {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly host = inject(FieldShellHost, { optional: true });
  private readonly fieldUiState = inject(FieldUiState, { optional: true });

  readonly tabindex = computed(() => (this.fieldUiState?.disabled() ? -1 : 0));

  constructor() {
    this.host?.registerInteractive(this);
  }

  element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  focus(options?: FocusOptions): void {
    this.element().focus(options);
  }

  focusReturnTarget(): HTMLElement | null {
    return this.element();
  }

  activateFromShell(): void {
    this.focus();
    this.element().click();
  }

  activate(event: Event): void {
    if (this.element() instanceof HTMLButtonElement) return;
    event.preventDefault();
    this.element().click();
  }
}
```

**Примітка**: `activate()` має guard для native `<button>` — браузер сам конвертує Enter/Space у click, дубльоване `element.click()` спричинить подвійне спрацювання. Для `<div>`/`<a>` — нам потрібен manual click.

- [ ] **Step 2.2: Верифікація build**

Run: `npm run build:components`
Expected: PASS

---

## Task 3: Додати CSS `.fibo-field-button`

**Files:**
- Modify: `projects/fibo-ui/components/src/styles/form-field.css`

- [ ] **Step 3.1: Додати правила після `.fibo-field-input` блоку (після рядка 205)**

Додати у `@layer field-rules` блок, після секції "── Input ─":

```css
  /* ── Button ─────────────────────────────────────────────── */

  .fibo-field-button {
    appearance: none;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    text-align: inherit;
    cursor: inherit;
    width: 100%;
  }

  .fibo-field-button:focus,
  .fibo-field-button:focus-visible {
    outline: none;
  }

  .fibo-field-button:disabled {
    cursor: not-allowed;
  }
```

- [ ] **Step 3.2: Верифікація build (CSS потрапляє у bundle)**

Run: `npm run build:components`
Expected: PASS

---

## Task 4: Export FieldInput та FieldButton з public API + Commit 1

**Files:**
- Modify: `projects/fibo-ui/components/src/public-api.ts`

- [ ] **Step 4.1: Додати експорти**

Знайти блок з `field-*` експортами (після `field-target` рядка):
```ts
export * from './lib/form-controls/form/field-target';
export * from './lib/form-controls/form/field-auxiliary';
```

Вставити одразу після `field-target` рядка:
```ts
export * from './lib/form-controls/form/field-input';
export * from './lib/form-controls/form/field-button';
```

Фінальний фрагмент public-api.ts виглядає так:
```ts
export * from './lib/form-controls/form/field-target';
export * from './lib/form-controls/form/field-input';
export * from './lib/form-controls/form/field-button';
export * from './lib/form-controls/form/field-auxiliary';
export * from './lib/form-controls/form/field-label';
export * from './lib/form-controls/form/field-overlay';
```

- [ ] **Step 4.2: Верифікація build components + build app**

Run: `npm run build:components`
Expected: PASS

Run: `npm run build`
Expected: PASS (демо-app теж компілюється)

- [ ] **Step 4.3: Commit 1**

```bash
git add projects/fibo-ui/components/src/lib/form-controls/form/field-input.ts \
        projects/fibo-ui/components/src/lib/form-controls/form/field-button.ts \
        projects/fibo-ui/components/src/styles/form-field.css \
        projects/fibo-ui/components/src/public-api.ts
git commit -m "refactor(form-field): add FieldInput and FieldButton directives with shared base

- FieldInput implements FieldTargetRef for <input>/<textarea> focus-surface.
- FieldButton implements FieldTargetRef for <button>/<div>/<a> activation-surface.
- Both use FieldTarget base via hostDirectives for ID/aria-* infrastructure.
- FieldInput auto-opens overlay on activateFromShell via self-scope inject.
- FieldButton auto-manages tabindex and keyboard activation for non-button hosts.
- .fibo-field-button CSS: invisible focus (container handles :focus-within).

Old fiboFieldTarget still works — migration happens in follow-up commits."
```

Expected: commit succeeds, working tree clean after.

---

## Task 5: Migrate TextField to FieldInput

**Files:**
- Modify: `projects/fibo-ui/components/src/lib/form-controls/fields/text-field.ts`

- [ ] **Step 5.1: Оновити imports**

Замінити рядок:
```ts
import { FieldTarget } from '../form/field-target';
```

На:
```ts
import { FieldInput } from '../form/field-input';
```

- [ ] **Step 5.2: Оновити `imports: [...]` у декораторі**

Замінити `FieldTarget` на `FieldInput` у масиві `imports` компонента:
```ts
imports: [FieldShell, FieldInput],
```

- [ ] **Step 5.3: Оновити template — замінити селектор і прибрати class**

У template знайти блок `<input fiboFieldTarget ... class="fibo-field-input" />` (рядки ~36-55).

Замінити:
```html
<input
  fiboFieldTarget
  #inputElement
  [type]="type()"
  [value]="value()"
  [placeholder]="placeholder()"
  [disabled]="uiState.disabled()"
  [readOnly]="uiState.readonly()"
  [required]="uiState.required()"
  [attr.name]="uiState.name() || null"
  [attr.aria-required]="uiState.required() || null"
  [attr.min]="uiState.min() ?? null"
  [attr.max]="uiState.max() ?? null"
  [attr.minlength]="uiState.minLength() ?? null"
  [attr.maxlength]="uiState.maxLength() ?? null"
  [attr.data-invalid]="(uiState.invalid() && uiState.touched()) || null"
  (input)="onInput($event)"
  (blur)="onBlur()"
  class="fibo-field-input"
/>
```

На:
```html
<input
  fiboFieldInput
  #inputElement
  [type]="type()"
  [value]="value()"
  [placeholder]="placeholder()"
  [disabled]="uiState.disabled()"
  [readOnly]="uiState.readonly()"
  [required]="uiState.required()"
  [attr.name]="uiState.name() || null"
  [attr.aria-required]="uiState.required() || null"
  [attr.min]="uiState.min() ?? null"
  [attr.max]="uiState.max() ?? null"
  [attr.minlength]="uiState.minLength() ?? null"
  [attr.maxlength]="uiState.maxLength() ?? null"
  [attr.data-invalid]="(uiState.invalid() && uiState.touched()) || null"
  (input)="onInput($event)"
  (blur)="onBlur()"
/>
```

Зміни: `fiboFieldTarget` → `fiboFieldInput`, видалено рядок `class="fibo-field-input"`.

- [ ] **Step 5.4: Верифікація build**

Run: `npm run build:components`
Expected: PASS

---

## Task 6: Migrate Combobox to FieldInput

**Files:**
- Modify: `projects/fibo-ui/components/src/lib/form-controls/combobox/combobox.ts`

- [ ] **Step 6.1: Оновити imports**

Замінити рядок:
```ts
import { FieldTarget } from '../form/field-target';
```

На:
```ts
import { FieldInput } from '../form/field-input';
```

- [ ] **Step 6.2: Оновити `imports: [...]` у декораторі**

У масиві `imports` компонента замінити `FieldTarget` на `FieldInput`:
```ts
imports: [
  FieldShell,
  FieldInput,
  DataList,
  DataListItem,
  SelectOne,
  ComboboxInput,
  ComboboxList,
],
```

- [ ] **Step 6.3: Оновити template**

У template знайти `<input fiboFieldTarget ... class="fibo-field-input" fiboComboboxInput />` (рядки ~66-73).

Замінити:
```html
<input
  fiboFieldTarget
  #inputElement
  [placeholder]="placeholder()"
  (blur)="uiState.touched.set(true)"
  class="fibo-field-input"
  fiboComboboxInput
/>
```

На:
```html
<input
  fiboFieldInput
  #inputElement
  [placeholder]="placeholder()"
  (blur)="uiState.touched.set(true)"
  fiboComboboxInput
/>
```

Зміни: `fiboFieldTarget` → `fiboFieldInput`, видалено рядок `class="fibo-field-input"`.

- [ ] **Step 6.4: Верифікація build**

Run: `npm run build:components`
Expected: PASS

---

## Task 7: Manual regression test + Commit 2

- [ ] **Step 7.1: Запустити dev-server**

Run: `npm start`
Expected: app piднімається на localhost:4200 без errors.

- [ ] **Step 7.2: Manual regression — сторінка `input-page`**

Відкрити `http://localhost:4200/components/input` у браузері. Перевірити:
- Typing у TextField працює.
- Shell click (біля icon / label) → focus на input.
- Label click → focus на input.
- Clear button (`×`) — прибирає значення.
- Disabled state — field виглядає приглушеним, click не фокусує.
- Invalid state (після submit з помилкою) — контейнер червоний, error message з'являється.
- DevTools: на input є class `fibo-field-input` (ставиться host директиви, НЕ template).
- DevTools: НЕ має подвійного focus ring (один лише на контейнері через `:focus-within`).

Expected: всі пункти pass.

- [ ] **Step 7.3: Manual regression — сторінка `combobox-page`**

Відкрити `http://localhost:4200/components/combobox`. Перевірити:
- Typing query → з'являється dropdown.
- Вибір item — закриває dropdown і встановлює value.
- Shell click → focus input.
- Arrow keyboard navigation у dropdown.
- Clear button працює.

Expected: всі пункти pass.

- [ ] **Step 7.4: Commit 2**

```bash
git add projects/fibo-ui/components/src/lib/form-controls/fields/text-field.ts \
        projects/fibo-ui/components/src/lib/form-controls/combobox/combobox.ts
git commit -m "refactor(text-field, combobox): migrate to FieldInput

- Replace fiboFieldTarget with fiboFieldInput.
- Remove manual class=\"fibo-field-input\" from templates (handled by host).
- Behavior unchanged: input remains focus-surface, no overlay coupling."
```

---

## Task 8: Migrate DatePickerField to FieldInput

**Files:**
- Modify: `projects/fibo-ui/components/src/lib/form-controls/fields/datepicker-field.ts`

- [ ] **Step 8.1: Оновити imports**

Замінити рядок:
```ts
import { FieldTarget } from '../form/field-target';
```

На:
```ts
import { FieldInput } from '../form/field-input';
```

- [ ] **Step 8.2: Оновити `imports: [...]` у декораторі**

У масиві `imports` компонента замінити `FieldTarget` на `FieldInput`:
```ts
imports: [FieldShell, FieldInput, FieldOverlay, Calendar, SelectDate, OverlayPanel],
```

- [ ] **Step 8.3: Оновити template**

Знайти блок `<input fiboFieldTarget fieldTargetMode="click" ... class="fibo-field-input" />` (рядки ~41-60).

Замінити:
```html
<input
  fiboFieldTarget
  fieldTargetMode="click"
  [fiboFieldOverlay]="calendarTpl"
  #inputElement
  aria-haspopup="dialog"
  [value]="value()"
  [placeholder]="placeholder()"
  [disabled]="uiState.disabled()"
  [readOnly]="uiState.readonly()"
  [required]="uiState.required()"
  [attr.name]="uiState.name() || null"
  [attr.aria-required]="uiState.required() || null"
  [attr.data-invalid]="(uiState.invalid() && uiState.touched()) || null"
  (input)="onInput($event)"
  (keydown.enter)="openCalendar()"
  (keydown.arrowdown)="openCalendar($event)"
  (blur)="onBlur()"
  class="fibo-field-input"
/>
```

На:
```html
<input
  fiboFieldInput
  [fiboFieldOverlay]="calendarTpl"
  #inputElement
  aria-haspopup="dialog"
  [value]="value()"
  [placeholder]="placeholder()"
  [disabled]="uiState.disabled()"
  [readOnly]="uiState.readonly()"
  [required]="uiState.required()"
  [attr.name]="uiState.name() || null"
  [attr.aria-required]="uiState.required() || null"
  [attr.data-invalid]="(uiState.invalid() && uiState.touched()) || null"
  (input)="onInput($event)"
  (keydown.enter)="fieldOverlay().open()"
  (keydown.arrowdown)="openOnArrowDown($event)"
  (blur)="onBlur()"
/>
```

Зміни:
- `fiboFieldTarget` → `fiboFieldInput`
- видалено `fieldTargetMode="click"`
- видалено `class="fibo-field-input"`
- `(keydown.enter)="openCalendar()"` → `(keydown.enter)="fieldOverlay().open()"`
- `(keydown.arrowdown)="openCalendar($event)"` → `(keydown.arrowdown)="openOnArrowDown($event)"`

- [ ] **Step 8.4: Оновити class методи**

Знайти метод `openCalendar` (рядки ~99-103):
```ts
openCalendar(event?: Event) {
  event?.preventDefault();
  this.focus();
  this.fieldOverlay().open();
}
```

Замінити на:
```ts
openOnArrowDown(event: Event) {
  event.preventDefault();
  this.fieldOverlay().open();
}
```

Зміни: перейменовано і спрощено — тільки для ArrowDown (де треба `preventDefault` щоб не скрол сторінки). Enter викликає `fieldOverlay().open()` напряму у шаблоні.

- [ ] **Step 8.5: Верифікація build**

Run: `npm run build:components`
Expected: PASS

---

## Task 9: Manual regression DatePickerField + Commit 3

- [ ] **Step 9.1: Manual regression — сторінка `datepicker`**

Відкрити `http://localhost:4200/components/datepicker` у браузері (якщо dev-server запущено) або запустити `npm start` заново. Перевірити:

**Critical — це регресія, яку треба перевірити в першу чергу**:
- У input вже є значення (наприклад "2026-04-17") → **click ВСЕРЕДИНУ тексту**. Курсор має поставитись у позиції кліку. Overlay **НЕ має відкриватись**.
- Ще раз click у інше місце того ж input тексту. Overlay **НЕ має перевідкриватись**.

**Новий функціонал з цього рефактору**:
- Click на shell whitespace (біля icon, label) → overlay відкривається (calendar з'являється).
- Click на iconEnd (calendar icon) → overlay відкривається.
- Click на label → focus input + overlay відкривається.

**Інші сценарії**:
- Enter на focused input → overlay відкривається.
- ArrowDown на focused input → overlay відкривається (без скрола сторінки).
- Вибір дати у calendar → закриває overlay, значення оновлюється.
- Typing дати вручну (наприклад "2026-05-20") працює, overlay не заважає.
- Clear button (`×`) працює.
- Disabled state.

Expected: всі пункти pass, особливо — click всередині тексту НЕ відкриває overlay.

- [ ] **Step 9.2: Commit 3**

```bash
git add projects/fibo-ui/components/src/lib/form-controls/fields/datepicker-field.ts
git commit -m "refactor(datepicker-field): migrate to FieldInput with auto-open overlay on shell click

- Replace fiboFieldTarget[fieldTargetMode=click] with fiboFieldInput.
- Shell whitespace / iconEnd / label click → auto-opens calendar via FieldInput.activateFromShell (self-inject FieldOverlay).
- Click inside input text → native caret placement, no overlay re-toggle (fixes regression where middle-of-text clicks re-opened overlay).
- Keydown Enter / ArrowDown → explicit overlay.open().
- Simplify openCalendar method → openOnArrowDown (Enter handled inline)."
```

---

## Task 10: Refactor FieldOverlay

**Files:**
- Modify: `projects/fibo-ui/components/src/lib/form-controls/form/field-overlay.ts`

- [ ] **Step 10.1: Замінити весь вміст файлу**

Файл `field-overlay.ts` зараз 64 рядки. Повністю переписати:

```ts
import { computed, Directive, ElementRef, inject, input, signal, TemplateRef } from '@angular/core';
import { createOverlay } from '@fibo-ui/cdk';
import { FieldButton } from './field-button';
import { FieldShellHost } from './field-shell-host';
import { FieldUiState } from './field-ui-state';

@Directive({
  selector: '[fiboFieldOverlay]',
  standalone: true,
  exportAs: 'fiboFieldOverlay',
  host: {
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-controls]': 'panelId()',
    '(click)': 'onHostClick($event)',
  },
})
export class FieldOverlay {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly host = inject(FieldShellHost, { optional: true });
  private readonly button = inject(FieldButton, { optional: true });
  private readonly fieldUiState = inject(FieldUiState, { optional: true });

  /** Template to render inside the overlay. Bound via `[fiboFieldOverlay]="tpl"`. */
  readonly overlayContent = input.required<TemplateRef<unknown>>({ alias: 'fiboFieldOverlay' });
  /** Match the width of the reference element. Default: false. */
  readonly matchWidth = input(false);

  readonly isOpen = signal(false);

  private readonly overlayHandle = createOverlay(() => ({
    state: this.isOpen,
    content: this.overlayContent(),
    position: {
      connectedTo: this.host?.referenceElement() ?? this.elementRef.nativeElement,
      matchWidth: this.matchWidth(),
    },
    focus: {
      restoreTo: () => this.host?.focusReturnTarget() ?? this.elementRef.nativeElement,
    },
  }));

  /** ID of the rendered overlay panel. Null when the overlay is closed. */
  readonly panelId = computed(() => this.overlayHandle()?.id ?? null);

  open(): void {
    if (this.fieldUiState?.disabled() || this.fieldUiState?.readonly()) return;
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    if (this.fieldUiState?.disabled() || this.fieldUiState?.readonly()) return;
    this.isOpen.update(v => !v);
  }

  onHostClick(event: MouseEvent): void {
    if (!this.button) return;
    if ((event.target as HTMLElement).closest('[data-field-auxiliary]')) return;
    this.toggle();
  }
}
```

**Ключові зміни** (для ревʼю):
- Імпорт `FieldTarget` замінено на `FieldButton`.
- `private readonly interactive = inject(FieldTarget);` → `private readonly elementRef = inject(ElementRef);` + `private readonly button = inject(FieldButton, { optional: true });`.
- `this.interactive.element()` → `this.elementRef.nativeElement`.
- `this.interactive.focusReturnTarget()` → `this.elementRef.nativeElement` (для Select/MultiSelect через `host.focusReturnTarget()` пріоритетний, цей — fallback).
- `onHostClick` guard: `if (this.interactive.fieldTargetMode() !== 'click') return` → `if (!this.button) return`.

- [ ] **Step 10.2: Верифікація build**

Run: `npm run build:components`
Expected: PASS

На цьому етапі `Select` і `MultiSelect` все ще використовують `fiboFieldTarget fieldTargetMode="click"`. FieldOverlay тепер НЕ реагує на їх клік (бо `FieldButton` не ін'єктиться). Це **очікувана тимчасова регресія** — вирішується в Task 11-12, які відбуваються у цьому ж коміті.

**НЕ коммітимо на цьому кроці** — чекаємо завершення Select і MultiSelect міграцій.

---

## Task 11: Migrate Select to FieldButton

**Files:**
- Modify: `projects/fibo-ui/components/src/lib/form-controls/select/select.ts`

- [ ] **Step 11.1: Оновити imports**

Замінити рядок:
```ts
import { FieldTarget } from '../form/field-target';
```

На:
```ts
import { FieldButton } from '../form/field-button';
```

- [ ] **Step 11.2: Оновити `imports: [...]` у декораторі**

У масиві imports замінити `FieldTarget` на `FieldButton`:
```ts
imports: [
  FieldShell,
  FieldButton,
  FieldOverlay,
  DataList,
  SelectOne,
  DataListItem,
],
```

- [ ] **Step 11.3: Оновити template**

Знайти блок `<button fiboFieldTarget fieldTargetMode="click" ... class="w-full text-left" ...>` (рядки ~54-70).

Замінити:
```html
<button
  fiboFieldTarget
  fieldTargetMode="click"
  [fiboFieldOverlay]="selectTpl"
  [matchWidth]="true"
  #triggerButton
  type="button"
  class="w-full text-left"
  role="combobox"
  [disabled]="uiState.disabled()"
  aria-haspopup="listbox"
  (blur)="uiState.touched.set(true)"
>
```

На:
```html
<button
  fiboFieldButton
  [fiboFieldOverlay]="selectTpl"
  [matchWidth]="true"
  #triggerButton
  type="button"
  role="combobox"
  [disabled]="uiState.disabled()"
  aria-haspopup="listbox"
  (blur)="uiState.touched.set(true)"
>
```

Зміни:
- `fiboFieldTarget` → `fiboFieldButton`
- видалено `fieldTargetMode="click"`
- видалено `class="w-full text-left"` (забезпечується `.fibo-field-button`)

- [ ] **Step 11.4: Верифікація build**

Run: `npm run build:components`
Expected: PASS

---

## Task 12: Migrate MultiSelect to FieldButton

**Files:**
- Modify: `projects/fibo-ui/components/src/lib/form-controls/select/multi-select.ts`

- [ ] **Step 12.1: Оновити imports**

Замінити рядок:
```ts
import { FieldTarget } from '../form/field-target';
```

На:
```ts
import { FieldButton } from '../form/field-button';
```

- [ ] **Step 12.2: Оновити `imports: [...]` у декораторі**

У масиві imports замінити `FieldTarget` на `FieldButton`:
```ts
imports: [
  DataList,
  SelectMulti,
  LucideAngularModule,
  DataListItem,
  FieldShell,
  FieldButton,
  FieldOverlay,
  FieldAuxiliary,
  Checkbox,
],
```

- [ ] **Step 12.3: Оновити template**

Знайти блок `<div fiboFieldTarget fieldTargetMode="click" ... class="w-full flex flex-wrap gap-x-1 gap-y-1 -mx-1 outline-none" ...>` (рядки ~52-68).

Замінити:
```html
<div
  fiboFieldTarget
  fieldTargetMode="click"
  [fiboFieldOverlay]="multiSelectTpl"
  [matchWidth]="true"
  #triggerSurface
  role="combobox"
  aria-haspopup="listbox"
  [attr.tabindex]="uiState.disabled() ? -1 : 0"
  [attr.aria-disabled]="uiState.disabled() || null"
  class="w-full flex flex-wrap gap-x-1 gap-y-1 -mx-1 outline-none"
  (focus)="onFocus()"
  (blur)="onBlur()"
  (keydown.enter)="openFromKeyboard($event)"
  (keydown.space)="openFromKeyboard($event)"
  (keydown.arrowdown)="openFromKeyboard($event)"
>
```

На:
```html
<div
  fiboFieldButton
  [fiboFieldOverlay]="multiSelectTpl"
  [matchWidth]="true"
  #triggerSurface
  role="combobox"
  aria-haspopup="listbox"
  [attr.aria-disabled]="uiState.disabled() || null"
  class="flex flex-wrap gap-x-1 gap-y-1 -mx-1"
  (focus)="onFocus()"
  (blur)="onBlur()"
  (keydown.arrowdown)="openFromKeyboard($event)"
>
```

Зміни:
- `fiboFieldTarget` → `fiboFieldButton`
- видалено `fieldTargetMode="click"`
- видалено `[attr.tabindex]="uiState.disabled() ? -1 : 0"` (керує `FieldButton.tabindex` computed)
- видалено `(keydown.enter)`, `(keydown.space)` (`FieldButton.activate` конвертує у click)
- з classes видалено `w-full` (у `.fibo-field-button`), `outline-none` (у `.fibo-field-button:focus`). Залишено component-specific flex layout.
- `(keydown.arrowdown)` **залишено** — це listbox-specific keyboard, не стосується button primitive.

- [ ] **Step 12.4: Верифікація build**

Run: `npm run build:components`
Expected: PASS

---

## Task 13: Manual regression Select/MultiSelect + Commit 4

- [ ] **Step 13.1: Manual regression — сторінка `select-page`**

Run: `npm start`
Open: `http://localhost:4200/components/select`

Перевірити:
- Click на shell → overlay відкривається (options list).
- Вибір option — закриває overlay, значення оновлюється.
- Keyboard: Enter на focused trigger → overlay. Space на focused trigger → overlay (native button behavior).
- Arrow keyboard navigation у options list.
- Click на clear button (`×`) (якщо є canClear) — прибирає значення, overlay НЕ відкривається.
- Disabled state.
- Invalid state.
- DevTools: на button класс `fibo-field-button`, text-align inherits left (від `.fibo-field-container`).
- DevTools: **немає подвійного focus ring** — тільки `:focus-within` на контейнері.

Expected: всі pass.

- [ ] **Step 13.2: Manual regression — сторінка `multiple-select-page`**

Open: `http://localhost:4200/components/multi-select`

Перевірити:
- Click на shell → overlay (options list з checkbox'ами).
- Click на option — toggle selection, overlay залишається відкритим.
- Chips відображаються після вибору.
- Click на chip `×` — прибирає item, overlay НЕ відкривається (data-field-auxiliary працює).
- Keyboard: Tab робить focus на div. Enter/Space на focused div → overlay (через `FieldButton.activate`).
- ArrowDown на focused div → overlay (через компонент `openFromKeyboard`).
- Disabled: tabindex -1, click no-op.
- Focus indication — на контейнері, не на div.

Expected: всі pass.

- [ ] **Step 13.3: Manual regression — переконайтесь що попередні сторінки не зламались**

Коротко перевірити:
- `input-page` — TextField працює.
- `datepicker` — DatePicker працює як у Task 9.
- `combobox-page` — Combobox працює.
- `form-examples-page` — різні поля в одній формі працюють.

- [ ] **Step 13.4: Commit 4**

```bash
git add projects/fibo-ui/components/src/lib/form-controls/form/field-overlay.ts \
        projects/fibo-ui/components/src/lib/form-controls/select/select.ts \
        projects/fibo-ui/components/src/lib/form-controls/select/multi-select.ts
git commit -m "refactor(select, multi-select): migrate to FieldButton; refactor FieldOverlay to detect button

FieldOverlay:
- Replace inject(FieldTarget) with inject(ElementRef) + inject(FieldButton, optional).
- onHostClick guard: 'if (!this.button) return' instead of mode check.
- Removes coupling to stringly-typed fieldTargetMode.

Select:
- Replace fiboFieldTarget[fieldTargetMode=click] with fiboFieldButton.
- Drop class='w-full text-left' (handled by .fibo-field-button).

MultiSelect:
- Replace fiboFieldTarget[fieldTargetMode=click] with fiboFieldButton.
- Drop [attr.tabindex] (FieldButton computes from disabled).
- Drop (keydown.enter)/(keydown.space) (FieldButton.activate converts to click for non-button hosts).
- Drop 'w-full outline-none' classes (handled by .fibo-field-button).
- Keep (keydown.arrowdown) — listbox-specific."
```

---

## Task 14: Clean up FieldTarget base to pure infrastructure

**Files:**
- Modify: `projects/fibo-ui/components/src/lib/form-controls/form/field-target.ts`

- [ ] **Step 14.1: Повністю переписати файл**

Поточний файл (72 рядки) має `fieldTargetMode`, `activateFromShell`, `focus`, `registerInteractive`. Замінити на мінімальну інфра-базу:

```ts
import { computed, Directive, ElementRef, inject } from '@angular/core';
import { FieldShellHost } from './field-shell-host';
import { FieldUiState } from './field-ui-state';

let nextFieldTargetId = 0;

@Directive({
  selector: '[fiboFieldTargetBase]',
  standalone: true,
  host: {
    'data-field-target': 'true',
    '[id]': 'controlId()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-invalid]': 'ariaInvalid()',
    '[attr.aria-readonly]': 'ariaReadonly()',
  },
})
export class FieldTarget {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly host = inject(FieldShellHost, { optional: true });
  private readonly fieldUiState = inject(FieldUiState, { optional: true });
  private readonly fallbackId = `field-target-${nextFieldTargetId++}`;

  readonly controlId = computed(() => this.host?.idFor('control') ?? this.fallbackId);

  readonly ariaLabelledBy = computed(() =>
    this.host?.hasLabel() ? this.host.idFor('label') : null,
  );

  readonly ariaDescribedBy = computed(() => {
    if (!this.host) return null;
    if (this.fieldUiState?.errorMessage()) return this.host.idFor('error');
    return null;
  });

  readonly ariaInvalid = computed(() => this.fieldUiState?.invalid() || null);
  readonly ariaReadonly = computed(() => this.fieldUiState?.readonly() || null);

  element(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
```

**Що видалено**:
- Селектор `[fiboFieldTarget]` → `[fiboFieldTargetBase]` (internal). Прямого використання в шаблонах більше немає — тільки як hostDirective.
- Input `fieldTargetMode`.
- Методи `focus()`, `focusReturnTarget()`, `activateFromShell()` — тепер у FieldInput/FieldButton.
- Helper `isDisabled()` — був лише для old activateFromShell логіки, більше непотрібен.
- `constructor() { this.host?.registerInteractive(this); }` — реєстрація тепер в підкласах.
- `implements FieldTargetRef` — база не реалізує цей контракт.
- Import `FieldTargetRef` — непотрібний.

- [ ] **Step 14.2: Верифікація build**

Run: `npm run build:components`
Expected: PASS

Якщо FAIL з помилкою типу "FieldTarget не має методу `fieldTargetMode`" або подібним — значить десь ще лишилось використання старого API. Перейти до Step 14.3.

- [ ] **Step 14.3: Grep-аудит — перевірка повної міграції**

Run всі три команди:
```bash
cd /Users/dentiman/dev/projects/fibo-stack/fibo-ui && \
  grep -rn "fiboFieldTarget\b" projects/ src/ --include="*.ts" --include="*.html" || echo "OK — no fiboFieldTarget usages"
```
Expected: `OK — no fiboFieldTarget usages`

```bash
grep -rn "fieldTargetMode" projects/ src/ --include="*.ts" --include="*.html" || echo "OK — no fieldTargetMode usages"
```
Expected: `OK — no fieldTargetMode usages`

```bash
grep -rn 'class="fibo-field-input"' projects/ src/ --include="*.ts" --include="*.html" || echo "OK — no manual fibo-field-input class"
```
Expected: `OK — no manual fibo-field-input class`

Якщо якась команда повертає результати — виправити відповідні файли перед продовженням.

---

## Task 15: Full regression + Commit 5

- [ ] **Step 15.1: Manual full regression**

Run: `npm start`

Пройти по всіх form-control сторінках:
- `input-page` → TextField.
- `datepicker` → DatePickerField (перевірити click-in-text НЕ відкриває overlay; shell click відкриває).
- `combobox-page` → Combobox.
- `select-page` → Select.
- `multiple-select-page` → MultiSelect.
- `form-examples-page` → всі types у формі.
- `form-field-control-page` → FormFieldControl контракт.

Для кожної сторінки — універсальний checklist:
- Shell click → правильна поведінка.
- Label click → focus + правильна поведінка.
- Tab → focus на target, container outline.
- Clear button → прибирає значення, overlay не реагує.
- Disabled / Readonly / Invalid states.

Expected: всі pass.

- [ ] **Step 15.2: Commit 5**

```bash
git add projects/fibo-ui/components/src/lib/form-controls/form/field-target.ts
git commit -m "refactor(field-target): clean up base to pure infrastructure

- Rename selector [fiboFieldTarget] to [fiboFieldTargetBase] (internal, never written in templates).
- Remove fieldTargetMode input (semantics moved to directive choice: FieldInput vs FieldButton).
- Remove activateFromShell, focus, focusReturnTarget methods (subclasses implement FieldTargetRef).
- Remove constructor registerInteractive call (subclasses register themselves).
- Base now purely holds ID, aria-* bindings, and element() accessor."
```

---

## Task 16: Update `docs/form-field-stack.md`

**Files:**
- Modify: `docs/form-field-stack.md`

- [ ] **Step 16.1: Оновити таблицю директив (рядки ~25-38)**

Знайти таблицю "Директиви: повна таблиця". Замінити її цілком:

```markdown
## Директиви: повна таблиця

| Клас | Angular selector | CSS клас | Host data-attrs | Host aria-attrs |
|---|---|---|---|---|
| `FieldUiState` | `[fiboFieldUiState]` | — | — | — |
| `FieldShellHost` | `[fiboFieldShellHost]` | — | — | — |
| `FieldContext` | `[fiboFieldContext]` | — | `data-density`, `data-label-layout` | — |
| `FieldContainer` | `[fiboFieldContainer]` | `fibo-field-container` | `data-invalid`, `data-readonly`, `data-pending` | `aria-disabled` |
| `FieldLabel` | `[fiboFieldLabel]` | `fibo-field-label` | — | — |
| `FieldAuxiliary` | `[fiboFieldAuxiliary]` | — | `data-field-auxiliary` | — |
| `FieldTarget` | `[fiboFieldTargetBase]` *(internal, hostDirective-only)* | — | `data-field-target` | `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-readonly` |
| `FieldInput` | `[fiboFieldInput]` | `fibo-field-input` | — | (наслідує від FieldTarget base) |
| `FieldButton` | `[fiboFieldButton]` | `fibo-field-button` | — | (наслідує від FieldTarget base) |
| `FieldOverlay` | `[fiboFieldOverlay]` | — | — | `aria-expanded`, `aria-controls` |

Конвенція: директива з власною стилізацією сама додає CSS-клас через `host: { class: '...' }`. Шаблони не ставлять CSS-класи для директив вручну.
```

- [ ] **Step 16.2: Оновити DOM структуру (рядки ~42-77)**

Знайти код-блок з DOM структурою. Замінити:

```
              input[fiboFieldTarget]           ←   FieldTarget: id, aria-*, data-field-target
              button[fiboFieldTarget           ←   (Select, DatePicker)
                     fiboFieldOverlay]         ←   FieldOverlay: open/close, aria-expanded
```

На:

```
              input[fiboFieldInput]            ←   FieldInput: id, aria-*, class="fibo-field-input"
              button[fiboFieldButton           ←   (Select) — FieldButton: tabindex, keyboard activation
                     fiboFieldOverlay]         ←   FieldOverlay: open/close, aria-expanded
              div[fiboFieldButton              ←   (MultiSelect) — composite activation-surface
                  fiboFieldOverlay]
```

- [ ] **Step 16.3: Оновити секцію "Примітиви: детальний опис"**

Знайти підсекцію `### `FieldTarget` (`[fiboFieldTarget]`)` (рядки ~189-196). Замінити весь блок на три підсекції:

```markdown
### `FieldTarget` (base, `[fiboFieldTargetBase]` — internal)

Infrastructure база для primary interactive targets. Hostdirective-only — користувачі не пишуть селектор вручну.

**Відповідальність**:
- Генерує `id` через `FieldShellHost.idFor('control')`.
- Ставить `aria-labelledby` / `aria-describedby` / `aria-invalid` / `aria-readonly` на host.
- Ставить `data-field-target="true"` для click-delegation у `FieldContainer`.
- Експонує `element()` getter.

**НЕ реєструється** у `FieldShellHost` — це робить реалізатор (`FieldInput` або `FieldButton`).

---

### `FieldInput` (`[fiboFieldInput]`)

Primary target для `<input>` / `<textarea>`. Focus-surface контракт.

**Що робить**:
- Ставить `class="fibo-field-input"` на host (замість ручного class у шаблоні).
- Реєструє себе в `FieldShellHost` як `FieldTargetRef`.
- Інжектить `FieldOverlay` з `{ self: true }` — якщо поруч є overlay, `activateFromShell()` відкриває його.

**Shell click behavior**:
- Без overlay — `focus()`.
- З overlay на тому ж елементі (DatePicker) — `focus() + overlay.open()`.
- Click всередині input тексту — native browser caret placement, overlay не тригериться.

---

### `FieldButton` (`[fiboFieldButton]`)

Primary target для `<button>` / `<div>` / `<a>`. Activation-surface контракт.

**Що робить**:
- Ставить `class="fibo-field-button"` на host (invisible focus, inherits alignment).
- Керує `tabindex` — `0` або `-1` за `disabled`.
- Мапить `keydown.enter` / `keydown.space` на `element.click()` для не-button хостів (native button обробляє сам).
- Реєструє себе в `FieldShellHost` як `FieldTargetRef`.

**Shell click behavior**:
- `activateFromShell()` → `focus() + element.click()` → `FieldOverlay.onHostClick` детектить `FieldButton` → `toggle()`.
```

- [ ] **Step 16.4: Оновити таблицю споживачів (рядки ~226-234)**

Знайти таблицю "Споживачі". Замінити:

```markdown
## Споживачі

| Компонент | FieldUiState | FieldShell | Target | Overlay | FieldAuxiliary |
|---|---|---|---|---|---|
| `TextField` | hostDirective | ✅ | `<input fiboFieldInput>` | — | — |
| `DatePickerField` | hostDirective | ✅ | `<input fiboFieldInput>` | ✅ (auto-open на shell click) | — |
| `Select` | hostDirective | ✅ | `<button fiboFieldButton>` | ✅ | — |
| `MultiSelect` | hostDirective | ✅ | `<div fiboFieldButton>` | ✅ | chip-remove |
| `Combobox` | hostDirective | ✅ | `<input fiboFieldInput>` | ✅ (власний createOverlay) | — |
| `Checkbox` | власні inputs | — | — | — | — |
| `Switch` | власні inputs | — | — | — | — |
```

- [ ] **Step 16.5: Видалити TODO-2 з "Куди рухатись далі"**

Знайти розділ "### 2. `fibo-field-input` — перенести в директиву?" (рядки ~246-250). Видалити весь цей підрозділ цілком.

Перенумерувати наступні пункти:
- "### 3. Content projection для іконок" → "### 2. Content projection для іконок"

- [ ] **Step 16.6: Перевірити інтеграцію**

Run: `cat docs/form-field-stack.md | head -50`
Переконатись що markdown валідний (таблиці, заголовки).

---

## Task 17: Update `docs/styling-system.md`

**Files:**
- Modify: `docs/styling-system.md`

- [ ] **Step 17.1: Видалити TODO-2**

Знайти розділ "### 2. Директива `[fiboFieldInput]` для `<input>` / `<textarea>`" (рядки ~212-216) у секції "## Що залишається зробити".

Видалити весь блок:

```markdown
### 2. Директива `[fiboFieldInput]` для `<input>` / `<textarea>`

`fibo-field-input` зараз ставиться вручну в шаблонах `TextField`, `DatePickerField`, `Combobox`. `FieldTarget` не може нести цей клас у host, бо він використовується і для `<button>` (Select), якому стиль input'а не потрібен.

Рішення: `[fiboFieldInput]` — комбінований маркер для полів введення, `host: { class: 'fibo-field-input' }` + `fieldTargetMode='focus'` за замовчуванням.
```

- [ ] **Step 17.2: Перенумерувати наступні TODO**

Після видалення блоку "### 2":
- "### 3. Content projection для іконок" → "### 2. Content projection для іконок"
- "### 4. Публічний theming contract" → "### 3. Публічний theming contract"

- [ ] **Step 17.3: Перевірити**

Run: `grep -n "^### " docs/styling-system.md`
Expected: нумерація у "Що залишається зробити" йде послідовно 1, 2, 3 без пропусків.

---

## Task 18: Final verification + Commit 6

- [ ] **Step 18.1: Final build перевірка**

Run: `npm run build:components`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 18.2: Final grep audit**

```bash
cd /Users/dentiman/dev/projects/fibo-stack/fibo-ui && \
  grep -rn "fiboFieldTarget\b" projects/ src/ docs/ --include="*.ts" --include="*.html" --include="*.md" \
  | grep -v "fiboFieldTargetBase"
```
Expected: **пусто** (єдині згадки `fiboFieldTarget` — це `fiboFieldTargetBase` у field-target.ts).

Якщо щось повертає — виправити перед коммітом.

- [ ] **Step 18.3: Manual smoke test всіх сторінок**

Run: `npm start`
Пройти по всіх 7 сторінках (input, datepicker, combobox, select, multi-select, form-examples, form-field-control). Переконатись що нічого не поламалось за час рефактору.

- [ ] **Step 18.4: Commit 6**

```bash
git add docs/form-field-stack.md docs/styling-system.md
git commit -m "docs: update form-field-stack and styling-system after FieldTarget split

- form-field-stack.md: full refresh of directives table, DOM structure, primitives detail, and consumers table. FieldTarget documented as internal infra base. FieldInput and FieldButton get their own sections. TODO-2 (fibo-field-input directive) removed — completed.

- styling-system.md: TODO-2 (fiboFieldInput directive) removed — completed. Remaining TODOs renumbered."
```

- [ ] **Step 18.5: Перегляд git log**

```bash
git log --oneline refactor_form_fields_style | head -10
```

Expected: бачимо 6 нових комітів зверху (у зворотньому порядку — 6, 5, 4, 3, 2, 1).

---

## Spec coverage checklist (self-check)

Прохід по секціях spec:

| Spec section | Requirement | Implemented у | Status |
|---|---|---|---|
| §1 | FieldTarget базa — pure infra, аrа-*, controlId | Task 14 | ✅ |
| §1 | FieldInput implements FieldTargetRef, `{self}` inject FieldOverlay | Task 1 | ✅ |
| §1 | FieldButton implements FieldTargetRef, tabindex, keydown | Task 2 | ✅ |
| §1 | FieldOverlay — inject ElementRef + FieldButton optional | Task 10 | ✅ |
| §2 | TextField → FieldInput | Task 5 | ✅ |
| §2 | Combobox → FieldInput | Task 6 | ✅ |
| §2 | DatePickerField → FieldInput + keydown handlers + auto shell→overlay | Task 8 | ✅ |
| §2 | Select → FieldButton | Task 11 | ✅ |
| §2 | MultiSelect → FieldButton (прибрати tabindex/keydown/classes) | Task 12 | ✅ |
| §3 | FieldContainer без змін | — | ✅ (документовано у spec) |
| §3 | FieldShellHost без змін публічно | — | ✅ |
| §4 | Додати `.fibo-field-button` CSS | Task 3 | ✅ |
| §4 | Прибрати `class="fibo-field-input"` з шаблонів | Tasks 5, 6, 8 | ✅ |
| §4 | Прибрати `w-full text-left` з Select | Task 11 | ✅ |
| §4 | Прибрати tabindex/keydown/w-full/outline-none з MultiSelect | Task 12 | ✅ |
| §5 | Manual regression checklist | Tasks 7, 9, 13, 15, 18 | ✅ |
| §5 | Grep audit | Tasks 14, 18 | ✅ |
| §6 | 6 атомарних комітів, кожен compilable | Tasks 4, 7, 9, 13, 15, 18 | ✅ |
| §6 (open question 1) | PoC self-scope inject FieldOverlay у FieldInput | Task 9 (manual verify DatePicker calendar auto-open) | ✅ |
| §6 (open question 2) | Double Enter на native `<button>` | Task 13 (Select manual test) + guard у FieldButton.activate | ✅ |
| §6 (open question 3) | FieldButton.tabindex configurable | **НЕ реалізовано** — спец не вимагав, тільки YAGNI-hint | — (YAGNI) |

Всі вимоги спеки покриті.
