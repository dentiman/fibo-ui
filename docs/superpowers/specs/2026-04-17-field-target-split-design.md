# Form Field Target Split — Design Spec

**Дата:** 2026-04-17
**Статус:** Draft для review
**Scope:** B — split + нормалізація DatePickerField (без зміни Combobox overlay)
**Автор:** brainstorming session

---

## Мотивація

У поточній архітектурі `FieldTarget` — єдина директива для PRIMARY interactive element у form-field stack. Її поведінка керується string input `fieldTargetMode: 'focus' | 'click'`. Це stringly-typed union двох концептуально різних контрактів:

- **focus surface** (input, textarea) — клік фокусує, не активує.
- **activation surface** (button, div[tabindex]) — клік = активація, toggle overlay.

Конкретні проблеми, що виникли:

1. **DatePickerField**: в коді `<input fiboFieldTarget fieldTargetMode="click">`. Через `FieldOverlay.onHostClick` будь-який click на input (включно з поставленням курсора у середину тексту) тригерить `toggle()` overlay. Typing UX ламається.
2. **Документація розходиться з кодом**: в `docs/form-field-stack.md` DatePickerField зазначений як "button (click)", реальний код — `<input>`.
3. **`fibo-field-input` дублюється в шаблонах** трьох компонентів (TextField, DatePickerField, Combobox) — не закрито TODO з form-field-stack.md.
4. **MultiSelect руками керує** `tabindex`, `(keydown.enter)`, `(keydown.space)`, `outline-none` — хоча це загальний контракт button-подібної поверхні.
5. **FieldOverlay coupled з mode** — інжектить `FieldTarget` і читає `fieldTargetMode()` для вирішення, чи реагувати на click.

## Мета

Розділити `FieldTarget` на **дві concrete-primitive директиви** (`FieldInput`, `FieldButton`) над спільною infrastructure-базою (`FieldTarget`). Виразити семантику через вибір директиви, не через string input.

## Non-goals

- Combobox overlay refactor (залишається власний `createOverlay`, не переходить на `FieldOverlay`).
- Content projection для icons (TODO з form-field-stack.md лишається окремою ініціативою).
- Backward-compat `[fiboFieldTarget]` селектор — **видаляється**. Бібліотека ще без зовнішніх споживачів; API можна ламати.
- Додавання unit-тестів для директив (scope тримаємо).
- Performance/SSR оптимізації.

---

## Секція 1. Архітектура директив

```
FieldTarget (base, hostDirective-only, pure infrastructure)
  inject:
    - ElementRef
    - FieldShellHost (optional)  — для idFor(), hasLabel()
    - FieldUiState (optional)    — для invalid(), readonly(), errorMessage()
  host:
    - 'data-field-target': 'true'
    - [id]:                     controlId()
    - [attr.aria-labelledby]:   ariaLabelledBy()
    - [attr.aria-describedby]:  ariaDescribedBy()
    - [attr.aria-invalid]:      ariaInvalid()
    - [attr.aria-readonly]:     ariaReadonly()
  features:
    - controlId(), ariaLabelledBy(), ariaDescribedBy(), ariaInvalid(), ariaReadonly() computed
    - element(): HTMLElement getter
  НЕ:
    - не реєструється в FieldShellHost (це роблять підкласи)
    - не має fieldTargetMode
    - не має activateFromShell

FieldInput [fiboFieldInput]   implements FieldTargetRef
  hostDirectives: [FieldTarget]
  host:
    - class: 'fibo-field-input'
  inject:
    - FieldShellHost (optional)
    - FieldOverlay (optional, { self: true })
  constructor:
    - host?.registerInteractive(this)
  activateFromShell():
    - this.element().focus()
    - this.overlay?.open()     ← ключова інтеграція: shell click відкриває overlay
  застосовне до: <input>, <textarea>

FieldButton [fiboFieldButton]   implements FieldTargetRef
  hostDirectives: [FieldTarget]
  host:
    - class: 'fibo-field-button'
    - [attr.tabindex]: tabindex()   ← 0 за замовчуванням, -1 якщо disabled
    - (keydown.enter): activate($event)
    - (keydown.space): activate($event)
  inject:
    - FieldShellHost (optional)
    - FieldUiState (optional) — для disabled-aware tabindex
  constructor:
    - host?.registerInteractive(this)
  activateFromShell():
    - this.element().focus()
    - this.element().click()   ← native click event → FieldOverlay.onHostClick → toggle
  застосовне до: <button>, <div>, <a>

FieldOverlay [fiboFieldOverlay]  (refactored)
  inject:
    - ElementRef                      ← замість FieldTarget для positioning
    - FieldShellHost (optional)
    - FieldButton (optional)          ← detection activation-surface
    - FieldUiState (optional)
  onHostClick(event):
    - if (!this.button) return        ← на FieldInput — no-op
    - if closest('[data-field-auxiliary]') return
    - toggle()
  public API (без змін):
    - open(), close(), toggle()
    - panelId computed
    - isOpen signal
```

### Чому `FieldTarget` більше не реєструється сам

Підкласи (`FieldInput`, `FieldButton`) — це ті, хто знає контракт activation (різний `activateFromShell`). База тримає тільки інфраструктуру (ID, aria, element-access). Реєстрація у `FieldShellHost` йде **від реалізатора `FieldTargetRef`**, а не від інфра-бази.

### FieldTargetRef контракт (без змін)

```ts
export interface FieldTargetRef {
  element(): HTMLElement;
  focus(options?: FocusOptions): void;
  focusReturnTarget(): HTMLElement | null;
  activateFromShell(): void;
}
```

---

## Секція 2. Карта споживачів

| Споживач | Target | Overlay | Shell click behavior |
|---|---|---|---|
| `TextField` | `<input fiboFieldInput>` | — | focus |
| `Combobox` | `<input fiboFieldInput fiboComboboxInput>` | власний `createOverlay` | focus (overlay керується через query) |
| `DatePickerField` | `<input fiboFieldInput [fiboFieldOverlay]="calendarTpl">` | ✅ | **focus + open calendar** (через `activateFromShell`) |
| `Select` | `<button fiboFieldButton [fiboFieldOverlay]="selectTpl">` | ✅ | focus + click → toggle |
| `MultiSelect` | `<div fiboFieldButton [fiboFieldOverlay]="multiSelectTpl">` | ✅ | focus + click → toggle |

### Розв'язання DatePickerField тепер

**Click на shell whitespace / iconEnd / label** → `FieldContainer.onContainerClick` → `activatePrimary()` → `FieldInput.activateFromShell()` → `focus() + overlay.open()`. Calendar відкривається.

**Click всередині input тексту** → `closest('input')` у `onContainerClick` → early return → браузер ставить курсор, overlay **не** тригериться. Typing зберігається.

**Typing у input** → `onInput` оновлює `value` signal.

**Keyboard Enter / ArrowDown** → викликають `fieldOverlay().open()` у компоненті явно.

**Новий шаблон DatePickerField**:
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
  (keydown.arrowdown)="fieldOverlay().open(); $event.preventDefault()"
  (blur)="onBlur()"
/>
```

### MultiSelect — що прибирається

```html
<!-- До -->
<div
  fiboFieldTarget
  fieldTargetMode="click"
  [fiboFieldOverlay]="multiSelectTpl"
  [attr.tabindex]="uiState.disabled() ? -1 : 0"
  (keydown.enter)="openFromKeyboard($event)"
  (keydown.space)="openFromKeyboard($event)"
  (keydown.arrowdown)="openFromKeyboard($event)"
  class="w-full flex flex-wrap gap-x-1 gap-y-1 -mx-1 outline-none"
>

<!-- Після -->
<div
  fiboFieldButton
  [fiboFieldOverlay]="multiSelectTpl"
  (keydown.arrowdown)="openFromKeyboard($event)"
  class="flex flex-wrap gap-x-1 gap-y-1 -mx-1"
>
```

Прибрано: `fieldTargetMode`, `tabindex`, `(keydown.enter)`, `(keydown.space)`, `w-full`, `outline-none`. Залишено: component-specific layout (`flex flex-wrap gap-x-1 gap-y-1 -mx-1`), listbox-specific `(keydown.arrowdown)`, `(focus)`/`(blur)` для model updates.

---

## Секція 3. Зміни в FieldOverlay та FieldContainer

### FieldOverlay

```ts
@Directive({
  selector: '[fiboFieldOverlay]',
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

  readonly overlayContent = input.required<TemplateRef<unknown>>({ alias: 'fiboFieldOverlay' });
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

**Net changes**:
- `inject(FieldTarget)` → `inject(ElementRef)` для positioning.
- Новий `inject(FieldButton, { optional: true })` — signal "activation-surface поруч".
- Guard: `if (!this.button) return` замість `if (mode !== 'click') return`.

### FieldContainer

**Без змін.** Делегація у `onContainerClick` уже правильно розділяє:
- `closest('button,input,textarea,select,a,label,[data-field-target],[data-field-auxiliary]')` → early return.
- Інакше → `host.activatePrimary()`.

`data-field-target` продовжує ставити `FieldTarget` base через hostDirective у FieldInput/FieldButton.

### FieldShellHost

**Без змін** (публічного API). Метод `registerInteractive(ref: FieldTargetRef)` тепер викликається з підкласів.

---

## Секція 4. CSS зміни

### Додається `.fibo-field-button`

```css
/* styles/form-field.css — @layer field-rules */

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

Прибираємо і `:focus`, і `:focus-visible` — фокус-індикація малюється контейнером через `:focus-within`. Аналогічно до вже існуючого `.fibo-field-input`.

### `.fibo-field-input` — CSS без змін

Правила у `form-field.css` (lines 156-205) залишаються. Змінюється тільки місце застосування: класу `fibo-field-input` більше немає у шаблонах споживачів — його ставить host директиви `FieldInput`.

### Наслідки для шаблонів споживачів

- `TextField`, `Combobox`, `DatePickerField`: прибирається `class="fibo-field-input"` з `<input>`.
- `Select`: прибирається `class="w-full text-left"` — забезпечує `.fibo-field-button`.
- `MultiSelect`: прибирається `w-full` і `outline-none` utility — забезпечує `.fibo-field-button`. Component-specific flex layout залишається.

---

## Секція 5. Верифікація

### Статичні перевірки (обов'язкові)

1. `npm run build:components` — проходить без errors.
2. `npm run build` (app) — проходить без errors (FormExamplesPage та інші демо-сторінки).
3. Grep-аудит: після рефактору у `projects/` і `src/` не лишається:
   - `fiboFieldTarget` (селектор)
   - `fieldTargetMode` (атрибут)
   - `class="fibo-field-input"` (вручну у шаблонах)

### Ручний regression checklist

Універсальні сценарії (застосовні до кожної демо-сторінки):
- Shell click на whitespace → правильна поведінка (focus або toggle overlay).
- Label click → focus на primary target.
- Tab → фокус на target, container показує `:focus-within` outline.
- Disabled: shell click no-op, target не фокусується.
- Readonly: shell click фокусує, overlay не відкривається.
- Invalid (touched): контейнер і label — правильний колір.
- Clear button: click на `×` — value очищається, overlay не реагує.

Специфіка по сторінках:

| Сторінка | Перевірка |
|---|---|
| `input-page` | Typing, shell click = focus, жодних подвійних ring. |
| `datepicker` | **Click у текст input → курсор ставиться, overlay НЕ reopens** (був bug). **Click на shell whitespace АБО iconEnd → overlay відкривається**. Enter/ArrowDown → overlay. Typing дати вручну працює. |
| `select-page` | Click → overlay toggle. Enter/Space на focused button → overlay. ArrowDown у списку. Жодного подвійного focus ring. |
| `multiple-select-page` | Chips clickable (x видаляє chip, overlay НЕ відкривається). Shell click → overlay toggle. ArrowDown → overlay. Focus indication на контейнері. Tabindex 0/-1 за disabled. |
| `combobox-page` | Typing відкриває dropdown. Shell click → focus. Keyboard nav. |
| `form-examples-page` | Submit, валідація, touched states каскадуються правильно. |
| `form-field-control-page` | Generic FormFieldControl контракт для всіх типів. |

### Не перевіряємо

- Unit-тести — не додаємо в цьому PR.
- Performance regression.
- SSR.

---

## Секція 6. Порядок міграції та ризики

### Послідовність кроків (кожен крок — compilable state)

**Крок 1. Нова інфраструктура** (старий API ще не видалений)
- `form/field-target.ts`: прибрати `fieldTargetMode`, `activateFromShell`, `registerInteractive` із конструктора. Залишити як чисту інфру, селектор internal/видалений.
- `form/field-input.ts`: створити `FieldInput` (implements `FieldTargetRef`).
- `form/field-button.ts`: створити `FieldButton` (implements `FieldTargetRef`).
- `form/field-overlay.ts`: refactor — inject `ElementRef` + `FieldButton` (optional).
- `styles/form-field.css`: додати `.fibo-field-button` правила.

**Крок 2. Міграція споживачів** (кожен незалежно)
- `text-field.ts`: `fiboFieldTarget` → `fiboFieldInput`; прибрати `class="fibo-field-input"`.
- `combobox.ts`: `fiboFieldTarget` → `fiboFieldInput`; прибрати `class`.
- `datepicker-field.ts`: `fiboFieldTarget[fieldTargetMode="click"]` → `fiboFieldInput`; keydown handlers для overlay open; прибрати `class`.
- `select.ts`: `fiboFieldTarget[fieldTargetMode="click"]` → `fiboFieldButton`; прибрати `class="w-full text-left"`.
- `multi-select.ts`: `fiboFieldTarget[fieldTargetMode="click"]` → `fiboFieldButton`; прибрати `tabindex`, `(keydown.enter/space)`, `w-full`, `outline-none`.

**Крок 3. Видалити старий публічний API**
- Перевірити grep — жодного `fiboFieldTarget` чи `fieldTargetMode` у шаблонах.
- Оновити `public-api.ts` — експортувати `FieldInput`, `FieldButton`.
- `FieldTarget` селектор остаточно internal або видалений.

**Крок 4. Документація**
- `docs/form-field-stack.md`: повний апдейт (таблиця директив, споживачів, прибрати TODO-2).
- `docs/styling-system.md`: прибрати TODO-2 про `[fiboFieldInput]`.

### Ризики та пом'якшення

| Ризик | Ймовірність | Пом'якшення |
|---|---|---|
| **DatePickerField regression**: typing ламається, overlay відкривається при клікі у текст | Середня | Obов'язковий manual test: click у середину "2026-04-17" — курсор ставиться, overlay не reopens. `closest('input')` у FieldContainer гарантує. |
| **Подвійний focus ring** (Select, MultiSelect) | Низька | `.fibo-field-button { outline: none; }` + `:focus-visible { outline: none; }`. Browser dev tools check. |
| **A11y regression** — aria-* зіпсується | Низька | `FieldTarget` base зберігає host bindings без змін. Axe / screen reader check на `input-page`, `select-page`. |
| **`inject(FieldOverlay, { self: true })` повертає null в Angular hostDirectives scope** | Середня | **PoC-перевірка у Кроці 1**: невеликий тест чи `FieldInput` бачить `FieldOverlay` через self-inject. Fallback — передавати overlay через `FieldShellHost` signal. |
| **MultiSelect keyboard подвійний Enter на native `<button>`** | Середня | `FieldButton` додає `(keydown.enter)` → `this.element().click()`. На native `<button>` browser вже обробляє Enter — треба перевірити чи двох click events не тригериться. Workaround: guard у `activate()` handler якщо `document.activeElement` вже опрацював. |
| **FieldOverlay `inject(FieldButton, optional)` не спрацьовує** на некоректній DI scope | Низька | Обидва директиви на одному елементі — default scope знаходить. PoC-перевірка у Кроці 1. |

### Комітова стратегія

Один PR, ~5-6 атомарних комітів:
1. `refactor(form-field): extract FieldTarget base, add FieldInput and FieldButton directives`
2. `refactor(field-overlay): inject FieldButton instead of FieldTarget mode`
3. `refactor(text-field, combobox): migrate to FieldInput`
4. `refactor(datepicker-field): migrate to FieldInput with keydown overlay triggers`
5. `refactor(select, multi-select): migrate to FieldButton`
6. `docs(form-field-stack): update after FieldTarget split`

Кожен комміт — репо компільоване, demo-app працює.

---

## Відкриті питання для implementation phase

1. **PoC перевірка self-scope injection**: `inject(FieldOverlay, { optional: true, self: true })` у `FieldInput` — чи спрацьовує через hostDirectives chain. Якщо ні — alternative: `FieldShellHost` тримає `overlay` signal, `FieldInput` читає звідти.
2. **FieldButton на native `<button>` — чи подвоюються Enter keyboard events**: треба переконатись що `(keydown.enter)` → `element.click()` не викликає double-activation, бо браузер уже конвертує Enter у click для `<button>`. Якщо так — guard `if (element instanceof HTMLButtonElement && event.type === 'keydown') return`.
3. **Чи `FieldButton.tabindex` має бути input-configurable** для кейсів типу `tabindex="-1"` у специфічних контекстах. За замовчуванням — 0/-1 за disabled; можливо input `fieldButtonTabindex`.
