# fibo-ui — Styling System Architecture

## Мета документа

Фіксує **архітектурний вибір системи стилізації** для `@fibo-ui/components`:

- де саме живуть стилі у бібліотеці;
- як розділяються design tokens, appearance primitives і component rules;
- яку роль відіграє Tailwind;
- яка конвенція naming для CSS класів і директив.

Це документ про **систему як частину архітектури**, а не про конкретну тему чи палітру.

---

## Поточний стан (2026-04-17)

Система стилізації побудована і функціонує. Ключові речі вже зроблені:

**Структура CSS:**
- `theme.css` — design tokens, CSS custom properties, `@theme` Tailwind integration
- `styles/appearance.css` — shared appearance primitives, keyframe animations
- `styles/button.css` — кнопки: native CSS, `@layer components`, `--btn-*` tokens
- `styles/form-field.css` — form field layout, state, density, label rules
- `styles/checkbox.css`, `styles/switch.css`, `styles/datalist.css`, `styles/overlay.css`

**Примітивні директиви:**
- `lib/primitives/appearance.ts` — `[fiboAppearance]` → `[attr.data-appearance]`
- `lib/primitives/size.ts` — `[fiboSize]` → `[attr.data-size]`

**Naming конвенція:**
- Всі CSS класи бібліотеки мають префікс `fibo-`: `fibo-btn`, `fibo-field-container`, `fibo-field-label`
- Директива з власною стилізацією несе CSS-клас через `host: { class: '...' }` — шаблони не ставлять CSS-класи для директив вручну

**Що вже НЕ існує:**
- `buttons.css` з `@apply` — видалено, замінено на `styles/button.css` з native CSS
- `components.css`, `form-fields.css` — видалено, замінено на `styles/*.css` з `@layer`
- `.form-field-*` класи без prefix — перейменовано на `fibo-field-*`

---

## Архітектурний вибір

> **Tailwind не є primary styling architecture бібліотеки.**
>
> **Primary styling layer — native CSS, побудований на design tokens, semantic slots і state attributes.**
>
> **Tailwind залишається як token/build layer і utility layer для demo app та локальних layout-задач.**

Це означає:

- бібліотека **token-driven**, **CSS-native**, **composition-friendly**
- Tailwind — **інструмент**, а не архітектурна залежність

---

## Шарова модель

### 1. Theme Tokens Layer — `theme.css`

Тільки design tokens у CSS custom properties:
- color roles, spacing, radius, typography, shadow, z-index, motion
- semantic aliases для field / overlay / datalist / button
- світла/темна тема через `[data-theme]`

Правило: **ніяких component-specific layout rules у token layer**.

### 2. Appearance / Primitives Layer — `styles/*.css`

Повторювані візуальні патерни, незалежні від конкретних компонентів:
- interactive surface, field shell, datalist item, button surface, overlay surface
- focus ring, invalid / disabled / pending states
- density variants, size variants

Правило: примітиви знають про **surface roles** і **state contracts**, але не про `Select` чи `DatePicker` зокрема.

### 3. Global Component Rules Layer — `styles/*.css`

Global rules для component roots і semantic slots. Не через `styleUrls` з Angular-компонентів — одна точка входу.

Правило: **компоненти не імпортують свої стилі з TS**. Усі library rules підключаються один раз на рівні бібліотечного style package.

---

## Конвенція стилізації

### Naming: директива = CSS-ідентифікатор

Директива з власною стилізацією **сама додає** CSS-клас через `host: { class }`:

```ts
// Button
@Directive({ host: { class: 'fibo-btn' } })
// CSS: .fibo-btn[data-appearance="primary"] { ... }

// FieldContainer
@Directive({ host: { class: 'fibo-field-container' } })
// CSS: .fibo-field-container[data-invalid] { ... }
```

Шаблони не дублюють CSS-класи поряд з директивами.

### State styling через `data-*` і `aria-*`

Стани — не через випадкові класи, а через узгоджені атрибути:

```css
/* Visual axes */
[data-appearance="primary"] { ... }
[data-size="sm"] { ... }

/* Domain states */
[data-invalid] { ... }
[data-pending] { ... }
[data-readonly] { ... }

/* Native ARIA */
[aria-disabled="true"] { ... }
[aria-selected="true"] { ... }
[aria-expanded="true"] { ... }
```

`data-variant` — **не вводимо**. `data-appearance` покриває роль візуальної оболонки.

### CSS custom properties як token API

Кожен компонент має свій namespace токенів:
```css
/* Button */
--btn-bg, --btn-bg-hover, --btn-text, --btn-ring, --btn-radius

/* Form field */
--ff-control-min-height, --ff-body-direction, --ff-label-font-size
```

Appearance variants і size variants **переозначають токени**, а не hardcode-ять значення напряму:
```css
.fibo-btn[data-size="sm"] {
  --btn-radius: var(--radius-sm);  /* переозначення токена */
  height: 1.5rem;
}
```

### Cascade layers

```css
@layer theme, base, appearance, field-rules, components, utilities
```

---

## Реальна структура файлів

```text
projects/fibo-ui/components/src/
  theme.css                    # design tokens (CSS custom properties + @theme)
  styles/
    appearance.css             # shared appearance primitives, keyframes
    button.css                 # .fibo-btn: base + size + appearance variants
    form-field.css             # .fibo-field-*: layout, state, density, label
    datalist.css               # datalist item rules
    overlay.css                # modal, popover, tooltip surfaces
    checkbox.css               # checkbox component rules
    switch.css                 # switch component rules
  lib/
    primitives/
      appearance.ts            # [fiboAppearance] → data-appearance
      size.ts                  # [fiboSize] → data-size
    buttons/
      button.ts                # [fiboButton] hostDirectives: Appearance + Size
    form-controls/
      form/                    # FieldShell, FieldContainer, FieldLabel, FieldContext, …
      fields/                  # TextField, DatePickerField
      select/                  # Select, MultiSelect
      ...
```

---

## Роль Tailwind

### Залишається корисним

- `@theme` для генерації частини токенів
- `@layer` для організації стилів
- Demo app та examples — utility-first вільно
- Layout-задачі споживача (`flex flex-wrap gap-2`) — через Tailwind напряму

### Більше НЕ є центром бібліотечного API

Ми **не хочемо**:
- `@apply` у library CSS — видалено з `button.css`, в інших файлах не використовується
- utility soup у library templates: `flex gap rounded bg text shadow hover disabled dark`
- Tailwind як **єдину архітектуру** бібліотеки

Ми **хочемо**:
- шаблон описує **структуру та semantic parts**
- глобальні CSS-шари описують **presentation rules**
- токени задають **системні значення**
- `data-*` / `aria-*` задають **стани**

---

## Що залишається зробити

### 1. Підключити CSS tokens у form-field.css

`theme.css` має `--fibo-field-bg`, `--fibo-field-text`, `--fibo-field-outline` та ін. Але `form-field.css` поки що **не використовує** більшість з них — хардкодить значення. Єдиний підключений token — `--fibo-field-placeholder`.

Наступний крок: wire up tokens так само як це зроблено в `button.css` через `--btn-*`. Тоді dark mode оверрайди теж підуть через tokens, а не дублювання selector-ів.

### 2. Content projection для іконок

`iconStart` / `iconEnd` — string inputs → Lucide icon name. Жорстке обмеження: не можна передати кастомну SVG або компонент.

Варіант: `@ContentChild` з маркерами `[fiboFieldIconStart]` / `[fiboFieldIconEnd]` за аналогією з `MatPrefix`/`MatSuffix`. `FieldShell` залишається backward-compatible через збереження string inputs як fallback.

### 3. Публічний theming contract

Зафіксувати, які CSS variables є публічним API для споживачів бібліотеки, а які є внутрішніми деталями імплементації.

---

## Що НЕ беремо

### Не `@apply` у library CSS

Всі нові CSS-файли — native CSS без `@apply`. `button.css` вже переписаний. Це правило на майбутнє.

### Не надто велика appearance matrix

Trimmed набір: `primary`, `secondary`, `danger`, `inverse`, `chip`, `text`. `primary-destructive`, `outline-grayscale` та подібні — надлишок на старті.

### Не `hostDirectives` без потреби

`hostDirectives` виправдані коли:
- переекспортують API,
- знімають boilerplate,
- стабілізують контракт,
- інкапсулюють tricky host logic.

Не плодимо обгортки тільки для "чистоти" структури.

### Не Less/SCSS

Тільки native CSS: custom properties, cascade layers, `:where`, `:is`, `:focus-visible`, logical properties, modern color functions, native nesting.

### Не layout-класи бібліотеки для споживачів

`fibo-field-filter-bar` видалено. Для layout груп полів — Tailwind utilities (flex, gap) + `[fiboFieldContext]` для поведінки. Бібліотека не диктує, як споживач розташовує поля на сторінці.

---

## Антипатерни, яких уникаємо

| Антипатерн | Чому ні |
|---|---|
| Utility soup у library templates | Погано для читабельності, масштабування, blueprint use case |
| `@apply` у library CSS | Ховає справжні значення, ускладнює override |
| `styleUrl`/`styleUrls` у компонентах | Ховає стилізаційну систему, ускладнює картину |
| `!important` і висока специфічність | `@layer` вирішує це структурно |
| Всі variants через Angular inputs | Веде до конфігураційного монстра — краще CSS contract |
| Один великий `components.css` | Стає глобальним монолітом |

---

## Джерела та референси

**Внутрішні:**
- [`docs/philosophy.md`](./philosophy.md)
- [`docs/form-field-stack.md`](./form-field-stack.md)
- [`projects/fibo-ui/components/src/theme.css`](../projects/fibo-ui/components/src/theme.css)
- [`projects/fibo-ui/components/src/styles/button.css`](../projects/fibo-ui/components/src/styles/button.css)
- [`projects/fibo-ui/components/src/styles/form-field.css`](../projects/fibo-ui/components/src/styles/form-field.css)

**Референсні бібліотеки (`/Users/dentiman/dev/projects/fibo-stack/`):**
- `taiga-ui-5/` — найкорисніший референс по шаровій моделі стилів
- `components/` — Angular Material, CDK patterns
- `spartan/` — Angular headless, signal-based
