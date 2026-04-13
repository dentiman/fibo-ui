# fibo-ui — Philosophy & Design Principles

## Core Identity

fibo-ui — це **signal-native, composition-first** UI-бібліотека для Angular. Вона не мігрувала зі старих паттернів — вона побудована з нуля на сучасному Angular (signals, zoneless, standalone).

Це одночасно **повноцінна бібліотека готових компонентів** і **будівельний набір для створення своїх**:

- **Використовуй as-is** — Select, DatePicker, Table, Menu, Dialog, Notifications працюють з коробки для типових сценаріїв
- **Композиціюй** — комбінуй готові компоненти і CDK-примітиви щоб зібрати складніші UI-патерни
- **Створюй свої** — бери blueprint як стартову точку і будуй бізнес-компоненти зі своїми типами, шаблонами та логікою

Головна ідея:

> **CDK дає поведінку. Components дає повний набір готових компонентів та blueprints. Розробник або використовує їх напряму, або збирає своє — без boilerplate і без зайвих абстракцій.**

---

## Два шари: CDK та Components

### @fibo-ui/cdk — headless behavior primitives

CDK — це набір директив, які інкапсулюють **складну поведінку без жодного UI**:

- **DataList** — клавіатурна навігація (ArrowUp/Down, Home/End, Enter), tracking active item, дві стратегії (focus-based та aria-activedescendant)
- **SelectionModel** — pluggable моделі вибору (SelectOne, SelectMulti, RouterSelectOne, SelectDate, SelectDateRange) через InjectionToken
- **Overlay system** — позиціонування через floating-ui, focus trap, scroll blocking, escape/click-outside/focus-leave behaviors, parent-child tracking для вкладених overlay
- **MenuPanel + SubmenuTrigger** — ієрархічні меню з timing-логікою для hover, keyboard delegation між рівнями
- **Form primitives** — DI-хелпери для інтеграції з Angular signals forms (`FormValueControl<T>`)
- **Expandable** — стан розгортання з автоматичним `aria-expanded`
- **Table primitives** — типобезпечні column/row директиви через `ng-template` + generics

CDK — це **фундамент**. Він вирішує важкі задачі один раз: доступність, навігація клавіатурою, overlay lifecycle, selection state. Все інше будується поверх.

### @fibo-ui/components — готові компоненти та blueprints для своїх

Компоненти з `@fibo-ui/components` працюють на **трьох рівнях використання**:

**Рівень 1 — Використовуй напряму.** Select, Table, DatePicker, Menu, Dialog, Checkbox, Switch, Notifications — це повноцінні, робочі компоненти. Для типових сценаріїв вони працюють з коробки, без додаткового коду. Підключив — працює.

**Рівень 2 — Композиціюй.** Компоненти — це готові композиції з CDK-примітивів. Їх можна комбінувати між собою і з CDK-директивами, щоб зібрати складніші UI-патерни. Наприклад, DataList + Select + custom filter = фільтрований вибір з клавіатурною навігацією.

**Рівень 3 — Будуй бізнес-компоненти.** Кожен компонент — це ще й **blueprint**: простий, читабельний приклад того, як CDK-примітиви збираються разом. Його можна взяти як стартову точку, додати свої типи даних, шаблони та бізнес-логіку — і отримати свій `UserSelect`, `BookingDatePicker` чи `OrdersTable`.

#### Чому це не чорні скриньки

Компоненти в інших бібліотеках (Angular Material, PrimeNG, Taiga UI) — це чорні скриньки на 500-2000 рядків коду з десятками inputs: `size`, `variant`, `appearance`, `disableRipple`, `panelClass`, `overlayPanelClass`, `autoActiveFirstOption`, `requireSelection`, `hideSingleSelectionIndicator`... Розробник конфігурує компонент через пропси і молиться, що потрібна комбінація підтримується. Якщо ні — CSS-хаки або issue.

Компоненти у fibo-ui — **прості, читабельні файли до 100 рядків**:

- **Listbox** — ~50 рядків. DataList + SelectionModel + шаблон зі стилями.
- **Checkbox** — ~34 рядки. Чистий `<input type="checkbox">` + SVG + Tailwind.
- **Select** — ~80 рядків. FieldShell + DataList + SelectOne + createOverlay.
- **Table** — ~100 рядків. Columns через contentChildren + optional SelectMulti.

**Мінімум inputs** — компонент покриває один конкретний usecase добре, а не всі випадки через пропси.

**Легко прочитати** — будь-який Angular-розробник може відкрити файл, прочитати за 2 хвилини і повністю зрозуміти як він працює.

**Без boilerplate** — CDK бере на себе клавіатурну навігацію, a11y-атрибути, overlay positioning, focus management. Компонент пише лише те, що унікальне для нього.

### Головне призначення — стартова точка для бізнес-компонентів

Задача готових компонентів типу Select, DatePicker — **не** покрити всі можливі варіації використання (свій шаблон, різні типи даних, кастомні inputs, складна фільтрація). Це шлях до god-component з 50 пропсами.

Задача — **дати простий, робочий приклад**, який розробник бере і перетворює у свій бізнес-компонент:

| Blueprint з бібліотеки | Бізнес-компонент у проєкті |
|----------------------|---------------------------|
| `Select` | `UserSelect` — з аватаркою, пошуком по імені, lazy-load юзерів |
| `Select` | `CurrencyPicker` — з прапорцями, форматуванням, grouped options |
| `DatePicker` | `BookingDatePicker` — з blocked dates, pricing per day |
| `Combobox` | `AddressAutocomplete` — з API Google Maps, debounce |
| `Table` | `OrdersTable` — з inline editing, status badges, row actions |
| `Listbox` | `PermissionsList` — з grouped permissions, descriptions, icons |

**Як це працює на практиці:**

1. Розробник дивиться на `Select` (~80 рядків) — бачить як CDK-примітиви (DataList, SelectOne, createOverlay, FieldShell) зібрані разом
2. Копіює його в свій проєкт як `UserSelect`
3. Замінює generic `items: SelectItem[]` на `users: User[]` з конкретними типами
4. Додає свій шаблон з аватаркою та роллю замість простого label
5. Інкапсулює бізнес-логіку (фільтрація, HTTP-запити, валідація) прямо в компонент
6. CDK-примітиви (навігація клавіатурою, overlay, a11y) працюють автоматично — їх не потрібно переписувати

**Результат:** бізнес-компонент `UserSelect` на ~100 рядків, який:
- Має конкретні типи даних (`User`, не `any`)
- Має свій шаблон (аватарка + ім'я + роль, не generic label)
- Інкапсулює свою логіку (пошук, lazy-load)
- Отримує a11y, клавіатурну навігацію та overlay "безкоштовно" від CDK
- Читабельний для будь-кого в команді

Це принципово інший підхід від "візьми mat-select і конфігуруй його через 20 inputs". Тут ти **створюєш свій компонент**, а бібліотека дає тобі CDK-інструменти і blueprint як приклад.

---

## Ключові принципи

### 1. Composition over Inheritance — директиви як LEGO-блоки

Жодних базових класів. Кожна фіча — це окрема директива, яка додається через `hostDirectives`. Компоненти збираються як конструктор:

```
DataList + SelectOne + MenuPanel = меню з навігацією та вибором
DataList + SelectMulti + createOverlay + FieldShell = мультиселект
DataList + SelectDate + Calendar grid = DatePicker
```

InjectionTokens забезпечують зв'язок між шарами без жорсткої прив'язки. Директива `DataListItem` інжектить `SELECTION_MODEL` optional — їй байдуже, чи це SelectOne, SelectMulti чи SelectDate. Вона просто запитує `isSelected(value)`.

### 2. Signal-native reactivity — ніякого legacy

Signals (`signal()`, `computed()`, `model()`, `linkedSignal()`, `effect()`) — єдина модель реактивності в компонентному шарі. RxJS використовується лише точково у сервісах (таймери tooltip, debounce).

Це не "Angular Material переписаний на signals". Це архітектура, де signals є фундаментом:
- `model()` для two-way binding стану (expanded, value, checked)
- `computed()` для derived state (isActive, isSelected, errorMessage)
- `effect()` для side effects (auto-expand on route change, focus management)
- `linkedSignal()` для залежного стану (lastSelection слідкує за value)
- `contentChildren()` для reactive discovery дочірніх елементів

### 3. Accessibility as structure — не opt-in, а built-in

A11y вбудована в кожну директиву CDK на рівні архітектури:
- `aria-expanded` автоматично в Expandable
- `aria-activedescendant` або focus management в DataList (через NavigationStrategy)
- `role="dialog"` + `aria-modal` + focus trap в Overlay
- `aria-labelledby` / `aria-describedby` через FieldInteractiveDirective
- `aria-haspopup="menu"` в SubmenuTrigger

Доступність не можна забути підключити — вона є частиною примітиву. Якщо ти використовуєш DataList, клавіатурна навігація вже працює. Якщо ти використовуєш Expandable, `aria-expanded` вже прив'язаний.

### 4. Pluggable behavior через Strategy + Token patterns

Поведінка підключається як плагін через InjectionToken:

**SelectionModel** — один інтерфейс, шість реалізацій:
| Модель | Використання |
|--------|-------------|
| `SelectOne` | Select, Listbox (single) |
| `SelectMulti` | Listbox (multi), Table |
| `RouterSelectOne` | Sidebar menu з routing |
| `SelectDate` | DatePicker (single date) |
| `SelectDateRange` | DatePicker (range) |

**NavigationStrategy** — як переміщується фокус:
- Focus navigation: DOM focus рухається на active item
- Active descendant: focus залишається на контейнері, оновлюється `aria-activedescendant`

**Overlay Shell** — як рендериться overlay:
- `MODAL_SHELL_TOKEN` — глобальне позиціонування, backdrop, focus trap
- `CONNECTED_SHELL_TOKEN` — біля reference element, без trap
- `DRAWER_SHELL_TOKEN` — бічна панель
- `TOOLTIP_SHELL_TOKEN` — легкий tooltip без backdrop
- `NOTIFICATION_SHELL_TOKEN` — стек нотифікацій

Один примітив DataList працює і в Select, і в Menu, і в Table, і в DatePicker — змінюється лише SelectionModel.

### 5. Reactive overlay system з session lifecycle

Overlay API побудоване навколо `createOverlay()` factory:

```typescript
readonly overlay = createOverlay(() => ({
  state: this.isOpen,                    // WritableSignal<boolean>
  content: this.templateRef(),           // TemplateRef | string
  position: { connectedTo: element },    // floating-ui positioning
  shell: CONNECTED_SHELL_TOKEN,          // shell component token
  close: { escape: true, outsideClick: true, focusLeave: true },
  setup: (session) => {
    session.canClose((reason) => reason !== 'outside-click');
    session.onCleanup(() => cleanup());
  },
}));
```

Декларативний конфіг замість імперативного `.open()/.close()`. Session API дає lifecycle hooks. Parent-child tracking підтримує вкладені overlay (меню → підменю → діалог).

### 6. Tailwind CSS 4 + ViewEncapsulation.None

Стилізація через Tailwind utility classes прямо в шаблонах. `ViewEncapsulation.None` дозволяє каскад стилів без Shadow DOM бар'єрів. Критичні анімації (spinner, transitions) — у component styles. Custom CSS classes (`datalist-item`, `form-field-*`) — для повторюваних UI-паттернів.

---

## Чим відрізняється від інших

| Аспект | fibo-ui | Angular Material / CDK | Spartan | Taiga UI |
|--------|---------|----------------------|---------|----------|
| **Філософія** | CDK-примітиви + прості blueprints | Feature-rich чорні скриньки | Headless primitives (схожий) | Повна UI-система |
| **Реактивність** | Signal-native з нуля | RxJS → поступова міграція | Signals (нова бібліотека) | RxJS + Observables |
| **Композиція** | `hostDirectives` + tokens | Abstract base classes | `hostDirectives` (схожий) | Декоратори + polymorpheus |
| **Компонент** | ~50-100 рядків, мінімум inputs | 500+ рядків, десятки inputs | Мінімалістичний | Великий, конфігурований |
| **Кастомізація** | Використовуй as-is, композиціюй, або будуй своє | Конфігуруй через пропси/CSS | Стилізуй через Tailwind | Конфігуруй через tokens |
| **Overlay** | `createOverlay()` + floating-ui | Imperative Overlay service | CDK overlay wrapper | Custom portal system |
| **Selection** | Pluggable models (6 варіантів) | Baked into ListKeyManager | Окремі директиви | Вбудована в компоненти |
| **Форми** | `FormValueControl<T>` (signals) | `ControlValueAccessor` | `ControlValueAccessor` | `ControlValueAccessor` + custom |

### Ключова різниця

Більшість бібліотек намагаються **передбачити всі варіації** через конфігурацію: додають input за input, варіант за варіантом, поки компонент не стає монстром на тисячу рядків.

fibo-ui йде іншим шляхом. Бібліотека дає **повний набір готових компонентів**, які працюють з коробки. Але кожен з них — це водночас читабельна, проста композиція з CDK-примітивів. Три шляхи використання:

1. **Підходить as-is** — підключив `<fibo-select>` і працює. Більшість типових сценаріїв покриті.
2. **Потрібно більше** — композиціюй готові компоненти з CDK-директивами. Додай DataList до свого layout, підключи SelectionModel до існуючого списку.
3. **Потрібно своє** — візьми blueprint компонента як стартову точку, додай свої типи, шаблони та бізнес-логіку. CDK-примітиви (навігація, a11y, overlay) працюють автоматично.

Бібліотека не змушує обирати між "використовуй наше" та "пиши своє з нуля". Вона дає спектр: від готового компонента до повного контролю — і на кожному рівні CDK робить важку роботу за тебе.

---

## Design Mantra

> **"CDK робить важке. Компонент — простий blueprint. Розробник або використовує as-is, або збирає своє."**
