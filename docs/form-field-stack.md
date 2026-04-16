# Form Field Stack — Директиви, стилізація та уніфікація

Цей документ описує повну архітектуру field-примітивів у `@fibo-ui/components`: перелік директив, їх Angular-селектори, host-bindings, CSS-хуки, де і як застосовуються стилі — а також пропозицію уніфікації naming-конвенції.

---

## Огляд: для чого взагалі field primitives?

Базова проблема: **shell поля візуально ширший за реальний контрол**.

```
┌─────────────────────────────────────────────┐
│ 🔍  [  input / button / composite div  ]  ✕ │
│     label                                   │
│     hint / error                            │
└─────────────────────────────────────────────┘
  ↑                ↑                       ↑
icon (chrome)  primary control         clear (chrome)
```

Без розподілу ролей одна сутність мала б бути одночасно:
- focusable primary element
- overlay trigger
- visual wrapper з іконками
- aria-label provider

Поточна архітектура розбиває цей моноліт на окремі директиви з єдиною відповідальністю кожна.

---

## Директиви: повна таблиця

| Клас | Angular selector | CSS клас | Де ставиться клас | Host data-attrs | Host aria-attrs |
|---|---|---|---|---|---|
| `FieldUiState` | `[fiboFieldUiState]` | — | — | — | — |
| `FieldShellHost` | `[fiboFieldShellHost]` | — | — | — | — |
| `FieldContext` | `[fiboFieldContext]` | — | — | `data-density`, `data-label-layout` | — |
| `FieldContainer` | `[fiboFieldContainer]` | `fibo-field-container` | **host** (директива) | `data-invalid`, `data-readonly`, `data-pending` | `aria-disabled` |
| `FieldLabel` | `[fiboFieldLabel]` | `fibo-field-label` | **host** (директива) | — | — |
| `FieldAuxiliary` | `[fiboFieldAuxiliary]` | `form-field-clear` | **шаблон** `FieldShell` | `data-field-auxiliary` | — |
| `FieldTarget` | `[fiboFieldTarget]` | — | — | `data-field-target` | `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-readonly` |
| `FieldOverlay` | `[fiboFieldOverlay]` | — | — | — | `aria-expanded`, `aria-controls` |
| `Button` | `[fiboButton]` | `fibo-btn` | **host** (директива) | — | — |

`FieldAuxiliary` — виняток: директива (`data-field-auxiliary`) і CSS-клас (`form-field-clear`) залишені окремо навмисно, бо вони різнорідні — директива є behavioral marker для click delegation, клас — візуальний стиль конкретної кнопки очищення.

---

## DOM структура

```
fibo-field-shell                           ← FieldShell component
  [fiboFieldShellHost]                     ← hostDirective (ID hub, DI bridge)
  class="block"                            ← Tailwind layout

  └── <div [fiboFieldContainer]            ← FieldContainer directive
            class="fibo-field-container"   ← CSS: автоматично від host directive
            aria-disabled data-invalid …>

        <lucide-icon class="form-field-icon shrink-0">  ← icon start

        <div class="form-field-body">
          <label [fiboFieldLabel]           ← FieldLabel directive
                 class="fibo-field-label">  ← CSS: автоматично від host directive
          </label>

          <div class="form-field-content">
            <ng-content>                   ← Primary control:
              input[fiboFieldTarget]        ←   FieldTarget: id, aria-*, data-field-target
              button[fiboFieldTarget        ←   (Select, DatePicker)
                     fiboFieldOverlay]      ←   FieldOverlay: open/close, aria-expanded
            </ng-content>
          </div>
        </div>

        <button [fiboFieldAuxiliary]        ← FieldAuxiliary directive
                class="form-field-clear">  ← CSS: clear button styles
        </button>

        <lucide-icon class="form-field-icon form-field-icon-end">  ← icon end

  └── <div class="form-field-error">       ← помилка під полем
  └── <div class="form-field-hint">        ← hint під полем
```

`FieldContext` (`[fiboFieldContext]`) ставиться **на зовнішньому обгортці** споживача (наприклад, `<form [fiboFieldContext] density="compact">`), і його `data-density` / `data-label-layout` атрибути каскадуються через CSS descendant selectors всередину `.form-field-control`.

---

## Як стилізація застосовується зараз

### CSS-хуки по елементах

| Елемент у DOM | CSS селектор | Джерело атрибуту/класу |
|---|---|---|
| `.form-field-control` | `.form-field-control` | клас у шаблоні FieldShell |
| `.form-field-control` — disabled | `[aria-disabled="true"]` | host binding у FieldContainer |
| `.form-field-control` — invalid | `[data-invalid]` | host binding у FieldContainer |
| `.form-field-control` — readonly | `[data-readonly]` | host binding у FieldContainer |
| `.form-field-control` — pending | `[data-pending]` | host binding у FieldContainer |
| `.form-field-label` | `.form-field-label` | клас у шаблоні FieldShell |
| `.form-field-clear` | `.form-field-clear` | клас у шаблоні FieldShell |
| `[data-field-target]` | `[data-field-target]` | host binding у FieldTarget |
| `[data-label-layout]` | `[data-label-layout] .form-field-control` | host binding у FieldContext |
| `[data-density]` | `[data-density] .form-field-control` | host binding у FieldContext |

### Два патерни разом в одному шаблоні

```html
<!-- Шаблон field-shell.ts -->
<div fiboFieldContainer class="form-field-control" ...>    ← директива + клас поряд
  <label fiboFieldLabel class="form-field-label">          ← директива + клас поряд
  <button fiboFieldAuxiliary class="form-field-clear">     ← директива + клас поряд
```

CSS таргетує клас:
```css
.form-field-control { ... }
.form-field-control[data-invalid] { ... }   /* data-* від директиви, клас від шаблону */
```

---

## Конвенція: директива = CSS-ідентифікатор

Єдиний патерн для всіх директив з власною стилізацією:

```ts
// Button
host: { class: 'fibo-btn' }
// CSS: .fibo-btn[data-appearance="primary"] { ... }

// FieldContainer
host: { class: 'fibo-field-container' }
// CSS: .fibo-field-container[data-invalid] { ... }

// FieldLabel
host: { class: 'fibo-field-label' }
// CSS: .fibo-field-container:focus-within .fibo-field-label { ... }
```

Директива завжди несе свій CSS-ідентифікатор. Шаблон `FieldShell` не дублює жодних CSS-угод.

---

## Уніфікація: `fibo` prefix + host class

`FieldContainer` і `FieldLabel` уніфіковані: CSS-клас перенесений з шаблону в `host` директиви. `FieldAuxiliary` + `form-field-clear` — **навмисний виняток**: директива є behavioral marker для click delegation, клас — візуальний стиль конкретної кнопки очищення; об'єднання не доцільне.

### Що було зроблено

```ts
// field-container.ts
host: {
  class: 'fibo-field-container',   // ← додано
  '[attr.aria-disabled]': '...',
  ...
}

// field-label.ts
host: {
  class: 'fibo-field-label',       // ← додано
  '[id]': '...',
  ...
}
```

```html
<!-- field-shell.ts — до -->
<div fiboFieldContainer class="form-field-control" ...>
<label fiboFieldLabel class="form-field-label">

<!-- field-shell.ts — після -->
<div fiboFieldContainer ...>   ← клас більше не потрібен
<label fiboFieldLabel>
```

```css
/* form-field.css — до */
.form-field-control { ... }
.form-field-control[data-invalid] { ... }
.form-field-label { ... }

/* form-field.css — після */
.fibo-field-container { ... }
.fibo-field-container[data-invalid] { ... }
.fibo-field-label { ... }
```

### Що НЕ змінювалось

- `form-field-clear`, `form-field-icon`, `form-field-input` — залишаються як є
- Data-attributes: `data-field-target`, `data-field-auxiliary`, `data-invalid` — без змін
- Angular selectors — без змін
- DOM structure і CSS логіка — без змін

---

## Data Flow

```
Angular Signal Forms FieldTree
  │
  │  ([formField] directive від @angular/forms/signals)
  │  автоматично прив'язує FieldState → inputs директиви
  ▼
FieldUiState  (hostDirective на компоненті)
  │
  │  inject(FieldUiState, { optional: true })
  ▼
FieldContainer [fiboFieldContainer]
  │  читає: disabled, readonly, pending, invalid, touched
  │  ставить: aria-disabled, data-invalid, data-readonly, data-pending
  ▼
FieldTarget [fiboFieldTarget]
  │  inject(FieldShellHost) → id системи
  │  inject(FieldUiState) → describedBy логіка
  ▼
  auto-wires: id, aria-labelledby, aria-describedby, aria-invalid, aria-readonly
```

---

## Примітиви: детальний опис

### `FieldUiState` (`[fiboFieldUiState]`)

Bridge між Angular Signal Forms і візуальним шаром. Використовується як `hostDirectives` на кожному field-компоненті.

**Inputs** (16 штук): `disabled`, `disabledReasons`, `readonly`, `hidden`, `invalid`, `pending`, `touched` (model — бо UI може мутувати), `dirty`, `name`, `required`, `min`, `minLength`, `max`, `maxLength`, `pattern`, `errors`.

**Derived**: `errorMessage` — computed: перший `errors[0].message` якщо `invalid && touched`.

---

### `FieldShellHost` (`[fiboFieldShellHost]`)

DI-хаб, провайдер ID системи. Використовується як `hostDirectives` на `FieldShell`.

- Зберігає `_containerEl` (реєструє `FieldContainer`)
- Зберігає `_interactive` (реєструє `FieldTarget`)
- Генерує `idFor(suffix)` → `field-N-label`, `field-N-control`, `field-N-error`, `field-N-hint`
- Методи: `activatePrimary()`, `focusReturnTarget()`, `referenceElement()`

---

### `FieldShell` (`fibo-field-shell`)

Візуальний контейнер поля — "chrome" навколо реального контролу.

**Що рендерить**: icon start, label slot, `<ng-content>`, clear button, icon end, error/hint text.

**Inputs**: `label`, `hint`, `iconStart`, `iconEnd`, `canClear`.

**Output**: `clearRequested`.

---

### `FieldContainer` (`[fiboFieldContainer]`)

Ставить aria/data стани на wrapper div. Делегує кліки до `FieldTarget` через `FieldShellHost.activatePrimary()`.

**Click delegation логіка**:
```
клік на контейнер?
  └─ target.closest('button,input,textarea,select,a,label,[data-field-target],[data-field-auxiliary]')?
       ├─ ТАК → браузер обробить сам
       └─ НІ → host.activatePrimary()
```

---

### `FieldLabel` (`[fiboFieldLabel]`)

Маркує `<label>`. Автоматично прив'язує `id` і `for` через `FieldShellHost` ID систему. Сповіщає `FieldShellHost.setHasLabel(true)` — `FieldTarget` використовує це для `aria-labelledby`.

---

### `FieldAuxiliary` (`[fiboFieldAuxiliary]`)

Маркер secondary action (`data-field-auxiliary="true"`). `FieldContainer.onContainerClick()` і `FieldOverlay.onHostClick()` перевіряють цей атрибут і пропускають кліки без перехоплення.

---

### `FieldTarget` (`[fiboFieldTarget]`)

Маркує PRIMARY interactive element. Реєструє себе в `FieldShellHost`.

**Input `fieldTargetMode`**:
- `'focus'` (default) — для `<input>`, `<textarea>`: shell click → `focus()`
- `'click'` — для `<button>`, `<div tabindex>`: shell click → `focus()` + `click()`

**Host bindings**: `data-field-target`, `[id]`, `[aria-labelledby]`, `[aria-describedby]`, `[aria-invalid]`, `[aria-readonly]`.

---

### `FieldContext` (`[fiboFieldContext]`)

Ставиться на зовнішньому контейнері (форма, фільтр-бар). Контролює density і label-layout через descendant CSS selectors.

```html
<form [fiboFieldContext] density="compact" labelLayout="inline">
  <fibo-text-field ... />
  <fibo-select ... />
</form>
```

CSS реагує:
```css
[data-density="compact"] .fibo-field-control { --ff-control-min-height: 2rem; }
[data-label-layout="inline"] .fibo-field-control { --ff-body-direction: row; }
```

---

### `FieldOverlay` (`[fiboFieldOverlay]`)

Управляє lifecycle overlay для полів типу Select, DatePicker. Потребує `FieldTarget` в тому ж елементі.

```html
<button fiboFieldTarget fieldTargetMode="click"
        [fiboFieldOverlay]="dropdownTpl">
```

**Методи**: `open()`, `close()`, `toggle()`. `open()`/`toggle()` перевіряють `disabled`/`readonly` перед відкриттям.

---

## Споживачі: як компоненти використовують примітиви

| Компонент | FieldUiState | FieldShell | FieldTarget | FieldOverlay | FieldAuxiliary |
|---|---|---|---|---|---|
| `TextField` | hostDirective | ✅ | input (focus mode) | — | — |
| `DatePickerField` | hostDirective | ✅ | button (click mode) | ✅ | — |
| `Select` | hostDirective | ✅ | button (click mode) | ✅ | — |
| `MultiSelect` | hostDirective | ✅ | div[tabindex] (click) | ✅ | chip-remove btn |
| `Combobox` | hostDirective | ✅ | input (focus mode) | ✅ | — |
| `Checkbox` | власні inputs | — | — | — | — |
| `Switch` | власні inputs | — | — | — | — |

---

## Порівняння naming з ref-libs

### Angular Material

| Material | fibo-ui | Різниця |
|---|---|---|
| `MatFormField` | `FieldShell` | Material: component-as-shell; fibo: shell окремо від control |
| `MatFormFieldControl` (interface) | `FieldTarget` | Material: control реєструє себе через DI; fibo: директива маркує елемент — менший coupling |
| `MatPrefix` / `MatSuffix` | `iconStart` / `iconEnd` inputs | Material: content projection; fibo: input string → Lucide icon |
| немає | `FieldAuxiliary` | Material shell не перехоплює кліки |
| немає | `FieldContext` | Material: density через `appearance` input |

### Taiga UI v5

| Taiga | fibo-ui | Різниця |
|---|---|---|
| `tui-textfield` | `FieldShell` | Аналог |
| `input[tuiInput]` | `[fiboFieldTarget]` | Taiga: "input" — конкретний тип; fibo: "target" — абстрактна роль |
| `TUI_AUXILIARY` + `tuiAsAuxiliary()` | `FieldAuxiliary` | Taiga назва точніша — обидва використовують "auxiliary" |
| `[tuiButtonX]` | clear button в FieldShell | Taiga: специфічна X-кнопка; fibo: вбудована в shell |
