# Form Field Stack — Внутрішня архітектура

Цей документ описує архітектуру field-примітивів у `@fibo-ui/components`, зв'язок між директивами, та пропозиції рефакторингу термінології.

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

Це призводить до `FormFieldControl` — god component, який робить все і нічого добре.

Поточна архітектура розбиває цей моноліт на окремі директиви з єдиною відповідальністю кожна.

---

## Data Flow

```
Angular Signal Forms FieldTree
  │
  │  ([formField] directive від @angular/forms/signals)
  │  автоматично прив'язує FieldState → inputs директиви
  ▼
FieldUiState / FormUiState  (hostDirective на компоненті)
  │
  │  inject(FormUiState, { optional: true })
  ▼
FieldShell  (fibo-field-shell)
  │
  │  contentChild(FieldTargetDirective)
  │  contentChild(FieldOverlayAnchorDirective)
  ▼
FieldTargetDirective [fiboFieldTarget]
  │
  │  inject(FieldShell, { optional: true })
  │  inject(FormUiState, { optional: true })
  ▼
  auto-wires: id, aria-labelledby, aria-describedby

FieldActionDirective [fiboFieldAction]  (незалежно, паралельно до FieldTarget)
  → просто маркує елемент data-field-action="true"
  → FieldShell перевіряє цей атрибут у onContainerClick()
```

---

## Примітиви: детальний опис

### `FormUiState` (`[fiboFormUiState]`)

**Де**: `form/form-ui-state.ts`  
**Роль**: bridge між Angular Signal Forms і візуальним шаром  
**Використовується як**: `hostDirectives` на кожному field-компоненті

```ts
@Component({
  hostDirectives: [{ directive: FormUiState, inputs: [...FORM_UI_STATE_INPUTS] }]
})
export class TextField { }
```

Коли на компоненті є `[formField]="myField"`, Angular автоматично прив'язує
`FieldState` з дерева форм до цих inputs. Компоненти читають стан через `inject(FormUiState)`.

**Inputs** (16 штук):

| Input | Тип | Джерело у Signal Forms |
|---|---|---|
| `disabled` | `boolean` | `disabledReasons.length > 0` |
| `readonly` | `boolean` | `FieldState.readonly` |
| `hidden` | `boolean` | `FieldState.hidden` |
| `invalid` | `boolean` | `FieldState.invalid` |
| `pending` | `boolean` | `FieldState.pending` |
| `touched` | `model(boolean)` | `FieldState.touched` — **єдиний model, бо UI може мутувати** |
| `dirty` | `boolean` | `FieldState.dirty` |
| `required` | `boolean` | metadata `REQUIRED` |
| `name` | `string` | для `name` атрибуту input |
| `errors` | `ValidationError[]` | `FieldState.errors` |
| `disabledReasons` | `DisabledReason[]` | для custom disabled tooltips |
| `min` / `max` | `number` | validation constraints |
| `minLength` / `maxLength` | `number` | validation constraints |
| `pattern` | `RegExp[]` | validation constraints |

**Derived**:
- `errorMessage` — computed: перший `errors[0].message` якщо `invalid && touched`

**Чому `touched` — model, а решта — input?**  
Тільки `touched` мутується з боку UI (event `blur` → `uiState.touched.set(true)`).
Всі інші стани — читаються тільки з форм-дерева.

---

### `FieldShell` (`fibo-field-shell`)

**Де**: `form/field-shell.ts`  
**Роль**: візуальний контейнер поля — "chrome" навколо реального контролу  
**Він НЕ є**: form control, focusable element, overlay trigger

**Що рендерить**:
- `form-field-control` wrapper div з aria/data атрибутами
- іконку start (`iconStart`)
- label (`label`) з auto-generated `id` для `for` зв'язку
- `<ng-content>` — слот для primary control
- clear button (`canClear`) — маркований `fiboFieldAction`
- іконку end (`iconEnd`)
- hint або error text під полем

**Зчитує з `FormUiState`** (inject, optional):
- `disabled`, `required`, `readonly`, `pending` → data/aria атрибути на wrapper
- `hasError` = `invalid && touched` → `data-error`
- `errorMessage` → рендер під полем

**Управління ID**:
```ts
readonly baseId = computed(() => this.id() || this.generatedBaseId);
idFor(suffix: string) { return `${this.baseId()}-${suffix}`; }

// Генерує: field-0-label, field-0-control, field-0-error, field-0-hint
```

**Методи для overlay-контролів**:

| Метод | Що повертає |
|---|---|
| `overlayReferenceElement()` | `FieldOverlayAnchorDirective.element()` або весь wrapper div |
| `overlayInteractionRoot()` | корінь host element (для close-on-outside-click) |
| `overlayFocusReturnTarget()` | `FieldTargetDirective.focusReturnTarget()` |

**Click delegation** (`onContainerClick`):
```
клік на shell?
  └─ потрапив на button/input/a/label/[data-field-interactive]/[data-field-action]?
       ├─ ТАК → нічого не робити (браузер сам обробить)
       └─ НІ → activatePrimaryFromShell()
                  └─ FieldTarget існує?
                       ├─ ТАК → focus() або focus()+click() залежно від fieldTargetMode
                       └─ НІ → emit focusRequested
```

---

### `FieldTargetDirective` (`[fiboFieldTarget]`)

**Де**: `form/field-target.ts`  
**Роль**: маркує PRIMARY interactive element всередині shell  
**Data attribute**: `data-field-interactive="true"` (увага: невідповідність назви — see нижче)

**Що надає автоматично через host bindings**:
```ts
host: {
  '[id]': 'controlId()',               // field-0-control
  '[attr.aria-labelledby]': 'labelledBy()',   // field-0-label (якщо є label)
  '[attr.aria-describedby]': 'describedBy()', // field-0-error або field-0-hint
}
```

**Input `fieldTargetMode`**:
| Значення | Використовується для | Поведінка shell-click |
|---|---|---|
| `'focus'` (default) | `<input>`, `<textarea>` | shell click → `element.focus()` |
| `'click'` | `<button>`, `<div tabindex>` | shell click → `element.focus()` + `element.click()` |

**Inject**:
- `inject(FieldShell, { optional: true })` — для отримання ID системи
- `inject(FormUiState, { optional: true })` — для `describedBy()` логіки

**`describedBy()` логіка**:
```ts
// Пріоритет: error > hint > null
if (formUiState?.errorMessage()) return fieldShell.idFor('error');
if (fieldShell.hint()) return fieldShell.idFor('hint');
return null;
```

---

### `FieldActionDirective` (`[fiboFieldAction]`)

**Де**: `form/field-action.ts`  
**Роль**: маркер, що означає "цей елемент є вторинною дією — shell не перехоплює кліки по ньому"  
**Data attribute**: `data-field-action="true"`

Директива робить рівно одну річ: ставить атрибут. Вся логіка — у `FieldShell.onContainerClick()`.

**Без цього маркера**: click на "clear" кнопку в Select → shell перехопить → активує primary button → відкриє dropdown → помилка UX.

**З маркером**: `closest('[data-field-action]')` знаходить елемент → shell виходить без дій.

**Типові сценарії використання**:
- clear button у `FieldShell` (вбудований)
- chip-remove button у `MultiSelect`
- будь-яка secondary action button всередині shell

---

### `FieldOverlayAnchorDirective` (`[fiboFieldOverlayAnchor]`)

**Де**: `form/field-overlay-anchor.ts`  
**Роль**: opt-in перевизначення reference element для overlay позиціонування  
**Використовується**: рідко, тільки коли overlay має якоритись до inner-елементу, а не до кореня shell

**Без нього**: `overlayReferenceElement()` повертає `controlContainer` — весь `form-field-control` div.  
**З ним**: повертає вказаний елемент.

Приклад: якщо потрібно щоб overlay відкривався від input'у, а не від всього поля з іконками.

---

## Споживачі: як компоненти використовують примітиви

| Компонент | FormUiState | FieldShell | FieldTarget | FieldAction | Overlay |
|---|---|---|---|---|---|
| `TextField` | hostDirective | ✅ | input (focus mode) | — | — |
| `DatePickerField` | hostDirective | ✅ | input (click mode) | — | `createConnectedOverlay` |
| `Select` | hostDirective | ✅ | button (click mode) | — | `createConnectedOverlay` |
| `MultiSelect` | hostDirective | ✅ | div[tabindex] (click) | chip-remove btn | `createConnectedOverlay` |
| `Combobox` | hostDirective | ✅ | input (focus mode) | — | `createConnectedOverlay` |
| `Checkbox` | ❌ власні inputs | — | — | — | — |
| `Switch` | ❌ власні inputs | — | — | — | — |

**Паттерн для простого поля** (`TextField`):
```
FormUiState (hostDirective)
└─ FieldShell
   └─ input[fiboFieldTarget]
```

**Паттерн для overlay поля** (`Select`, `DatePickerField`):
```
FormUiState (hostDirective)
└─ FieldShell
   └─ button[fiboFieldTarget fieldTargetMode="click"]
      overlay = createConnectedOverlay(
        isOpen,
        () => ({ referenceElement: fieldShell.overlayReferenceElement(), matchWidth: true }),
        template,
        { restoreFocusTo: () => fieldShell.overlayFocusReturnTarget() }
      )
```

---

## Аналіз naming: порівняння з ref-libs

### Angular Material

| Material | fibo-ui аналог | Різниця |
|---|---|---|
| `MatFormField` | `FieldShell` | Material: component-as-shell; fibo: shell окремо від control |
| `MatFormFieldControl` (interface) | `FieldTargetDirective` | Material: control реєструє себе через DI; fibo: директива маркує елемент |
| `MatPrefix` / `MatSuffix` | `iconStart` / `iconEnd` inputs | Material: content projection; fibo: input string → Lucide icon |
| немає | `FieldActionDirective` | Material не потребує — shell не перехоплює кліки |
| немає | `FieldOverlayAnchorDirective` | Material: overlay вбудований в кожен control |

**Ключова різниця архітектур**: у Material батько (`MatFormField`) шукає дитину через `ContentChild(MatFormFieldControl)`. У fibo-ui — навпаки: дитина (`FieldTarget`) inject-ить батька. Це менший coupling.

### Taiga UI v5

| Taiga | fibo-ui аналог | Різниця |
|---|---|---|
| `tui-textfield` (TuiTextfieldComponent) | `FieldShell` | Аналог. Taiga: hostDirectives TuiAppearance, TuiDropdown; fibo: окремі системи |
| `input[tuiInput]` (TuiInputDirective) | `[fiboFieldTarget]` | Taiga: "input" — конкретний тип; fibo: "target" — абстрактна роль |
| `TUI_TEXTFIELD_ACCESSOR` token | `FieldTargetDirective` | Taiga: DI token-based реєстрація; fibo: директива-маркер |
| `TUI_AUXILIARY` + `tuiAsAuxiliary()` | `FieldActionDirective` | **Taiga назва точніша**: "auxiliary" vs "action" |
| `[tuiButtonX]` | clear button в FieldShell | Taiga: специфічна X-кнопка; fibo: вбудована в shell |

---

## Пропозиції перейменування

### Резюме аналізу

Поточний namespace має одну ключову проблему: **`FormUiState` порушує `Field*` консистентність**.
Друга проблема: **невідповідність між назвою класу і data-атрибутом** у `FieldTargetDirective`.
Третя проблема: **`FieldAction` — надто широке поняття**, підтверджено порівнянням з Taiga.

### Таблиця варіантів

| Поточна назва | Варіант A | Варіант B | Рекомендація |
|---|---|---|---|
| `FormUiState` | `FieldUiState` | `FieldState` | **`FieldUiState`** — зберігає "UI", вирівнює namespace |
| `FieldShell` | без змін | `FieldWrapper` | **залишити** — точна і унікальна назва |
| `FieldTargetDirective` + `data-field-interactive` | `FieldTarget` + `data-field-target` | `FieldInteractive` + `data-field-interactive` | **узгодити**: або клас, або атрибут |
| `FieldActionDirective` | `FieldAuxiliaryDirective` | `FieldPassthroughDirective` | **`FieldAuxiliary`** — підтверджено Taiga |
| `FieldOverlayAnchorDirective` | `FieldAnchorDirective` | `FieldOverlayOriginDirective` | **`FieldAnchor`** — коротше, в namespace ясно |

### Деталі по кожному

**`FormUiState` → `FieldUiState`**

Причина: `FormUiState` створює когнітивне навантаження — "це частина Form системи чи Field системи?". Весь решта namespace `Field*`. Зміна мінімальна — тільки ім'я класу і selector, логіка не змінюється.

Пов'язано: Angular `FormUiControl` — наш клас реалізує цей інтерфейс, назва "успадкована". Але це не обов'язково означає, що наш клас повинен мати ту саму назву.

---

**`FieldTargetDirective` + атрибут `data-field-interactive`**

Зараз є прихована невідповідність:

```ts
// field-target.ts
@Directive({ host: { 'data-field-interactive': 'true' } })  // атрибут: "interactive"
export class FieldTargetDirective { }                        // клас: "Target"

// field-shell.ts
target.closest('..., [data-field-interactive], [data-field-action]')
```

Два шляхи виправлення:

**Варіант A**: Уніфікувати під "target"
- клас: `FieldTarget` (без змін)
- атрибут: `data-field-target` (змінити)
- `closest('[data-field-target]')` у shell

**Варіант B**: Уніфікувати під "interactive"
- клас: `FieldInteractive` (перейменувати)
- атрибут: `data-field-interactive` (без змін)
- selector: `[fiboFieldInteractive]`

Рекомендація: **Варіант A** — "target" точніше описує роль у системі (shell делегує до цього елемента), а "interactive" — занадто широке поняття в ARIA (interactive content включає майже всі елементи форми).

---

**`FieldActionDirective` → `FieldAuxiliaryDirective`**

Проблема "action": будь-яка кнопка є "action". Це не відрізняє clear button від primary button.

"Auxiliary" (допоміжний):
- точно описує роль: другорядний елемент, що допомагає primary control
- Taiga UI використовує `TUI_AUXILIARY` для того самого концепту
- HTML glossary: "auxiliary" = element that assists the primary interaction
- відмінно від "action" передає: "я другорядний, не основний"

Зміна: `FieldActionDirective` → `FieldAuxiliaryDirective`, selector `[fiboFieldAction]` → `[fiboFieldAuxiliary]`, атрибут `data-field-action` → `data-field-auxiliary`.

---

**`FieldOverlayAnchorDirective` → `FieldAnchorDirective`**

Назва `FieldOverlayAnchor` надмірно довга при тому, що в контексті field primitives "anchor" однозначно означає overlay anchor. Альтернатива: `FieldOverlayOrigin` — відсилає до Angular CDK `OverlayOrigin` token, знайомий Angular розробникам.

---

## Вплив перейменування на public API

| Примітив | Поточний selector | Новий selector | Breaking? |
|---|---|---|---|
| `FormUiState` | `[fiboFormUiState]` | `[fiboFieldUiState]` | ✅ breaking — якщо хтось використовує selector напряму (рідко, тільки через hostDirectives) |
| `FieldTarget` | `[fiboFieldTarget]` | `[fiboFieldTarget]` | ✅ **без змін** (тільки data-атрибут) |
| `FieldAction` | `[fiboFieldAction]` | `[fiboFieldAuxiliary]` | ✅ breaking — зміна selector |
| `FieldOverlayAnchor` | `[fiboFieldOverlayAnchor]` | `[fiboFieldAnchor]` | ✅ breaking — зміна selector |

`FormUiState` використовується тільки через `hostDirectives inputs` — selector не використовується в шаблонах. Реальний breaking тільки для `FieldAction` і `FieldOverlayAnchor` selectors у шаблонах споживачів.
