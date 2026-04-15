# fibo-ui — Styling System Architecture

## Мета документа

Цей документ фіксує **архітектурний вибір системи стилізації** для `@fibo-ui/components`.

Його задача:

- визначити, **де саме живуть стилі** у бібліотеці;
- відокремити **design tokens**, **appearance primitives** та **global component rules**;
- зафіксувати, яку роль у цьому всьому відіграє Tailwind;
- узгодити підхід з головною філософією `fibo-ui`:  
  **CDK дає поведінку, components дає готові компоненти та blueprints, розробник або використовує as-is, або збирає своє.**

Це **не документ про конкретну тему чи палітру**. Це документ про **систему стилізації як частину архітектури бібліотеки**.

---

## Поточна точка

Сьогодні у `fibo-ui` вже є кілька правильних напрямків:

- є окремий шар **theme tokens** у [`projects/fibo-ui/components/src/theme.css`](../projects/fibo-ui/components/src/theme.css);
- є спроба виділити спільні UI-патерни у [`components.css`](../projects/fibo-ui/components/src/components.css), [`form-fields.css`](../projects/fibo-ui/components/src/form-fields.css), [`buttons.css`](../projects/fibo-ui/components/src/buttons.css);
- використовується `ViewEncapsulation.None`, що зручно для portal/overlay-контенту і для бібліотечного каскаду;
- частина компонентів вже стилізується через **semantic/data attributes** (`aria-selected`, `aria-disabled`, `data-error`, `data-pending`).

Але зараз система змішана:

- частина стилів живе у **Tailwind utilities прямо в шаблонах**;
- частина живе у **глобальних CSS-класах**;
- частина живе у **розрізнених CSS-правилах без чіткої шарової структури**;
- семантичні класи ще не всюди стабільні;
- Tailwind поки що виконує одразу три ролі:
  - token layer,
  - utility layer,
  - primary authoring layer.

Для демо або прикладів це нормально. Для **бібліотеки компонентів** це починає заважати.

---

## Яку задачу має вирішувати стилізація в fibo-ui

Стилізація в `fibo-ui` повинна підтримувати ті ж самі 3 рівні, що й самі компоненти:

1. **As-is usage**  
   Компонент має виглядати добре з коробки.

2. **Composition**
   Розробник має легко поєднувати компоненти та CDK-примітиви без боротьби зі специфічністю та utility-сміттям.

3. **Blueprint / build-your-own**
   Розробник має відкрити компонент, прочитати його за кілька хвилин і без болю адаптувати під свій продукт.

Звідси випливають критерії:

- стилі мають бути **читабельні як система**, а не як довгі рядки класів;
- markup має залишатись **семантичним і стабільним**;
- state styling має будуватись на **`data-*` та `aria-*`**, а не на випадкових класах;
- tokens мають бути **CSS-native**, доступні і з Tailwind, і з plain CSS;
- overlay, form fields, datalist, button appearance мають мати **окремий шар reusable primitives**;
- кастомізація не повинна примушувати користувача форкати весь стек стилів.

---

## Що показують сучасні бібліотеки

### 1. shadcn/ui

Що важливо у підході:

- це **не класична бібліотека**, а open-code distribution model;
- компоненти копіюються в проєкт і редагуються локально;
- Tailwind використовується дуже активно;
- для темізації рекомендуються **CSS variables з семантичними токенами** типу `background`, `foreground`, `primary`.

Що в цьому сильного:

- максимально швидкий старт;
- open code добре лягає на ідею blueprints;
- токени можна зробити семантичними, а не жорстко прив’язаними до `blue-500`.

Що в цьому слабкого для `fibo-ui`:

- utility-heavy markup швидко розростається;
- шаблон починає змішувати **структуру, стан і вигляд**;
- при масштабуванні бібліотеки важко тримати стабільний style contract;
- компонент виглядає простим, поки не накопичує 20-40 utility-класів.

Висновок для нас:

- **брати open-code / blueprint логіку — так**;
- **робити Tailwind основною мовою стилізації бібліотеки — ні**.

### 2. Base UI

Що важливо у підході:

- бібліотека **unstyled** і не нав’язує styling engine;
- state hooks даються через:
  - `className`,
  - `data-*`,
  - CSS variables;
- офіційно показують і Tailwind, і CSS Modules, і plain CSS.

Що в цьому сильного:

- чітке розділення між **behavior layer** та **styling layer**;
- state styling будується на структурі, а не на magic classes;
- CSS variables дають хороший контракт між behavior та presentation.

Що в цьому слабкого:

- з коробки немає візуальної системи;
- потрібна власна design language і власний appearance layer;
- якщо не дисциплінувати API слотів і станів, легко отримати хаос.

Висновок для нас:

- це дуже близько до духу `fibo-ui/cdk`;
- **підхід Base UI до styling hooks варто брати як референс**:
  - semantic parts,
  - `data-*` state,
  - CSS variables,
  - styling-engine agnostic thinking.

### 3. Mantine

Що важливо у підході:

- Mantine рекомендує **CSS Modules** як основний спосіб стилізації;
- theme values віддаються через **CSS variables**;
- є `className`, `classNames`, `styles`, `data-*` і headless/unstyled сценарії.

Що в цьому сильного:

- стиль компонентів живе в **окремих CSS-файлах**, а не в шаблоні;
- легко стилізувати стани через `data-*`;
- тема виражена через native CSS variables;
- це дуже підтримувано на великій бібліотеці.

Що в цьому слабкого для нас:

- сам підхід зав’язаний на React ecosystem та CSS Modules;
- `styles/classNames prop API` легко розростається, якщо його зробити основним способом кастомізації;
- Angular не дає такого ж нативного DX з CSS Modules, як React/Vite стек.

Висновок для нас:

- **не копіювати API Mantine буквально**;
- **взяти їхню дисципліну**:
  - static CSS first,
  - theme via CSS variables,
  - state via attributes,
  - minimal inline styling.

### 4. Taiga UI v5

Що видно по коду:

- є окремий **styles package**: `projects/styles/taiga-ui-theme.less`;
- theme layer зібраний окремо: `variables.less`, `palette.less`, `appearance.less`;
- окремо існує **appearance layer** для типових оболонок, наприклад `theme/appearance/textfield.less`;
- окремо існує **component layer**, наприклад `styles/components/button.less`, `styles/components/textfield.less`;
- компоненти підтягують стилі як library-level styles і працюють через `ViewEncapsulation.None`;
- state і variants кодуються через:
  - `data-size`,
  - `data-appearance`,
  - `data-state`,
  - theme attributes;
- великий обсяг кастомізації проходить через CSS variables виду `--tui-*`.

Що в цьому сильного:

- чітке розділення:
  - tokens,
  - appearance,
  - component styling;
- CSS — основна мова системи;
- markup не перевантажений utility-класами;
- стилі масштабуються на велику бібліотеку;
- `hostDirectives` використовуються як справжній composition mechanism для style/behavior API;
- публічний visual API зводиться до малого набору осей типу `appearance`, `size`, `state`, а CSS читає вже `data-*`.

Що в цьому слабкого:

- система стає великою і місцями важкою;
- appearance API може перетворитись на окрему mini-framework;
- з часом росте кількість legacy-сумісності та службових токенів;
- стилі підтягуються з компонентів через `styles: @import ...`, що робить зв'язок Angular-коду і style package занадто прихованим;
- багато проміжних thin-wrapper директив, які дають сильну композицію, але ускладнюють навігацію по коду.

Висновок для нас:

- **Taiga UI v5 — найкорисніший референс саме по архітектурі стилів**;
- брати треба не їхній обсяг, а їхню **шарову модель**:
  - theme tokens,
  - reusable appearance primitives,
  - global component rules;
- окремо варто взяти їхню ідею **спільних директив осей стилізації**:
  - `appearance`
  - `size`
  - state binding через `data-*`;
- але **не** варто копіювати їхній спосіб підключення стилів через `@import` всередині кожного Angular-компонента.

---

## Що саме беремо з Taiga

### 1. Спільні осі стилізації через директиви

У `fibo-ui` варто ввести загальні директиви рівня design system:

- `appearance`
- `size`

Робочий вигляд API:

- `fiboAppearance`
- `fiboSize`

або thin-wrapper рівня:

- `FiboWithAppearance`
- `FiboWithSize`

Їхня задача:

- нормалізувати публічний visual API;
- переводити Angular inputs у стабільний CSS contract;
- ставити на host:
  - `data-appearance`
  - `data-size`

Мінімальний перший кандидат на впровадження:

- `FormField`

Далі:

- `Button`
- `Select`
- `Listbox item`
- `Popover / Dialog surfaces`

### 2. Appearance як спільний visual contract

Як і в Taiga, `appearance` має означати:

- тип візуальної оболонки;
- спосіб поводження surface у normal/hover/focus/active states;
- спільний контракт, який може використовуватись у різних компонентах.

Наприклад:

- `default`
- `primary`
- `secondary`
- `outline`
- `ghost`
- `field`

Тобто `appearance` у нас має бути **cross-component axis**, а не приватна властивість лише однієї кнопки.

### 3. Size як окрема системна вісь

`size` теж варто винести в спільний контракт:

- `sm`
- `md`
- `lg`

або іншу малу шкалу, але **одну на всю бібліотеку**, а не різну в кожному компоненті.

`size` має задавати:

- height / min-height;
- paddings;
- radius, якщо це справді частина scale;
- icon size;
- typography slot.

### 4. State styling через `data-*` як норму

Як і в Taiga, стани мають бути описані не через випадкові класи, а через узгоджені атрибути:

- `data-state`
- `data-appearance`
- `data-size`
- `data-invalid`
- `data-pending`
- `data-readonly`

Плюс нативні ARIA/state атрибути:

- `aria-disabled`
- `aria-selected`
- `aria-expanded`
- `aria-checked`

### 5. Поділ на tokens / appearance / component rules

Це головне, що точно варто перенести з Taiga:

- окремий token layer;
- окремий appearance layer;
- окремий шар правил для конкретних component roots/slots.

---

## Що саме НЕ беремо з Taiga

### 1. Не імпортуємо стилі з Angular-компонентів

У `fibo-ui` **не буде** підходу:

- `styles: "@import ..."`
- `styleUrl/styleUrls` як primary mechanism для library styles

Рішення:

- усі library styles живуть у **глобальному style package бібліотеки**;
- компоненти і директиви лише ставлять:
  - класи,
  - `data-*`,
  - `aria-*`;
- ніяких імпортів CSS з TS-компонентів.

Це окрема принципова відмінність від Taiga.

### 2. Не будуємо надто велику appearance matrix

У Taiga багато appearance-комбінацій:

- `primary`
- `primary-destructive`
- `primary-grayscale`
- `outline-grayscale`
- `secondary-destructive`
- і т.д.

Для `fibo-ui` це надлишково на старті.

Рішення:

- тримаємо **невеликий набір appearance values**;
- destructive / success / warning вирішуємо тільки там, де це реально системна потреба;
- не множимо visual matrix завчасно.

### 3. Не дублюємо API thin-wrapper-ами без потреби

`hostDirectives` треба використовувати архітектурно, але не плодити багато проміжних обгорток без необхідності.

Для нас правило таке:

- якщо wrapper реально:
  - переекспортує API,
  - знімає boilerplate,
  - стабілізує контракт,
  - або інкапсулює tricky host logic,
  то він виправданий;
- якщо він лише додає ще один рівень непрозорості, його не робимо.

### 4. Не тягнемо Less/SCSS

`fibo-ui` використовує **тільки native CSS**.

Без:

- Less
- SCSS

Усе, що нам потрібно, має вирішуватись через:

- CSS custom properties;
- cascade layers;
- `:where`, `:is`, `:focus-visible`;
- logical properties;
- modern color functions;
- native nesting, якщо вона підтримується нашим toolchain.

---

## Висновок по ринку

Сильні сучасні системи сходяться в одному:

- **tokens живуть у CSS variables**;
- **state styling кодується через data/aria attributes**;
- **стилі компонентів краще жити окремо від markup**;
- utility-класи добрі як інструмент, але погані як **єдина архітектура бібліотеки**;
- headless/composable системи виграють, коли між behavior і styling є чіткий контракт.

---

## Архітектурний вибір для fibo-ui

### Коротко

Для `fibo-ui` цільовий підхід такий:

> **Tailwind не є primary styling architecture бібліотеки.**
>  
> **Primary styling layer для library components — native CSS, побудований на design tokens, semantic slots і state attributes.**
>  
> **Tailwind залишається як token/build layer і як зручний utility layer для demo app, прикладів і локальних layout-задач.**

Це означає:

- **не концентруємось на тому, що бібліотека "Tailwind-based"**;
- концентруємось на тому, що бібліотека:
  - **token-driven**,
  - **CSS-native**,
  - **composition-friendly**,
  - **open-code / blueprint-friendly**.

---

## Цільова модель шарів

### 1. Theme Tokens Layer

Тут живуть тільки design tokens:

- color roles;
- spacing;
- radius;
- typography;
- shadow;
- z-index;
- motion;
- density;
- semantic aliases для form field / overlay / datalist / card / button.

Формат:

- CSS custom properties;
- світла/темна тема через `data-theme`;
- Tailwind `@theme` можна використовувати як зручний спосіб генерації частини токенів, **але CSS variables є джерелом правди**.

Правило:

- **ніяких component-specific layout rules у token layer**.

### 2. Appearance / Primitives Layer

Тут живуть повторювані візуальні патерни, які не належать одному компоненту:

- interactive surface;
- field shell;
- datalist item;
- button surface;
- popover surface;
- modal surface;
- focus ring;
- invalid / disabled / pending states;
- density variants;
- size variants;
- elevation primitives.

Це аналог того, що в Taiga рознесено між `theme/appearance/*` та `styles/components/*`, але в меншій і простішій формі.

Правило:

- primitives не знають про конкретний `Select` чи `DatePicker`;
- вони знають про **surface roles** і **state contracts**.

### 3. Global Component Rules Layer

Тут живуть **глобальні rules для component roots і semantic slots**, але не у вигляді імпортів з Angular-компонентів.

Приклади:

- `.fibo-form-field`
- `.fibo-button`
- `.fibo-select`
- `.fibo-checkbox`
- `.fibo-listbox`
- `.fibo-dialog`

У цьому шарі:

- описується layout компонентних root/slot селекторів;
- використовуються appearance primitives;
- задаються component-level CSS vars;
- оформлюються внутрішні semantic slots.

Правило:

- **компоненти не імпортують свої стилі з TS**;
- усі library rules підключаються один раз на рівні бібліотечного style package.

---

## Що це означає для Tailwind

### Tailwind залишається

Tailwind нам все ще корисний:

- `@theme` для частини токенів;
- `@layer` для організації стилів;
- `@apply` для швидкого складання простих primitives;
- demo app та examples можуть спокійно лишатись utility-first;
- прототипування нових blueprints може починатися з utilities.

### Tailwind перестає бути центром API бібліотеки

Ми **не хочемо**, щоб library component читався так:

- структура елемента;
- бізнес-ролі;
- accessibility;
- state;
- spacing/color/focus/disabled/hover;
- все це в одному шаблоні через 20 utility-класів.

Ми **хочемо**, щоб library component читався так:

- шаблон описує **структуру та semantic parts**;
- глобальні CSS-шари бібліотеки описують **presentation rules**;
- токени задають **системні значення**;
- `data-*` / `aria-*` задають **стани**.

### Практичне правило

У `@fibo-ui/components`:

- **нові компоненти не пишемо utility-first у шаблоні за замовчуванням**;
- для library markup використовуємо:
  - semantic class names,
  - host classes,
  - `data-*`,
  - `aria-*`;
- Tailwind utilities у шаблоні допустимі лише як тимчасовий крок або для дуже дрібних layout detail, але не як основна стратегія.

У demo app:

- Tailwind можна використовувати вільно.

---

## Семантичний контракт між markup і CSS

### Базовий принцип

Шаблон має говорити:

- що є root;
- що є trigger;
- що є label;
- що є content;
- що є icon;
- що є item;
- що є overlay;
- що є selected / disabled / active / invalid.

А не:

- який тут `px-3`;
- який тут `rounded-md`;
- який тут `text-gray-500`;
- який тут `dark:hover:bg-white/8`.

### Що вважати правильним API

Правильний public/internal style contract:

- `.fibo-select`
- `.fibo-select__trigger`
- `.fibo-select__value`
- `.fibo-select__panel`
- `.fibo-checkbox`
- `.fibo-checkbox__control`
- `.fibo-checkbox__indicator`
- `.fibo-datalist-item`

І стани:

- `[data-size='sm' | 'md' | 'lg']`
- `[data-appearance='primary' | 'secondary' | 'outline' | 'ghost']`
- `[data-state='open' | 'closed']`
- `[data-active='true']`
- `[data-invalid='true']`
- `[aria-disabled='true']`
- `[aria-selected='true']`

### `data-appearance` vs `data-variant`

Для `fibo-ui` базове рішення таке:

- використовуємо **`data-appearance`**
- **не вводимо `data-variant`**

Почему:

- у більшості дизайн-систем `variant` і `appearance` починають означати одне й те саме;
- це створює другу вісь без реальної користі;
- CSS contract стає менш очевидним;
- компонентам доводиться вирішувати, де саме зберігати візуальну оболонку.

В `fibo-ui`:

- `data-appearance` = тип визуальной оболочки/surface;
- `data-size` = размерная шкала;
- `data-state` = интерактивное состояние;
- отдельные `data-invalid`, `data-pending`, `data-readonly` = доменные/форменные состояния.

`data-variant` можна буде ввести тільки якщо пізніше з’явиться **справді окрема вісь**, не зводима до `appearance`. На поточному етапі вона не потрібна.

### Чому це важливо

Такий контракт:

- добре читається;
- стабільний для кастомізації;
- добре лягає на `ViewEncapsulation.None`;
- переносимий між компонентами;
- легко комбінується з CDK primitives.

---

## Native CSS можливості, на які варто спертись

`fibo-ui` має будуватись навколо сучасного CSS, а не навколо workaround-ів:

- CSS custom properties як головний token API;
- cascade layers (`@layer`) для керованого порядку стилів;
- logical properties (`inline-size`, `block-size`, `padding-inline`) для RTL-friendly системи;
- `:focus-visible` замість hover-only мислення;
- `color-mix()` / OKLCH-палітра для системної роботи з кольором;
- `:where()` для зниження специфічності;
- `:is()` для компактних state rules;
- `@starting-style` / transitions там, де це реально покращує overlays і entering states;
- container queries — точково, якщо з’являться компоненти, де це справді вигідніше за breakpoint logic.

Що не варто робити основою архітектури:

- надмірно покладатися на utility concatenation;
- шити тему через JS-only runtime;
- будувати кастомізацію виключно через inputs типу `size/variant/color/radius/elevation/fullWidth/...`.

---

## Рекомендована структура файлів

Поточна реальна структура `@fibo-ui/components` (після рефакторингу 2026-04-15):

```text
projects/fibo-ui/components/src/
  theme.css                   # global design tokens (CSS custom properties)
  buttons.css                 # button rules (тимчасово на @apply, буде переписано)
  styles/
    appearance.css            # shared appearance primitives + keyframe animations
    form-field.css            # form field layout, state, density, label rules
    datalist.css              # datalist item rules
    overlay.css               # modal, popover, tooltip, card surfaces
    checkbox.css              # checkbox component rules
    switch.css                # switch component rules (size via CSS vars + data-size)
  lib/
    primitives/               # (планується) cross-component directives: Appearance, Size
    form-controls/form/       # FieldShell, FieldTarget, FieldContainer, FieldContext, …
    ...
```

Каскадні шари: `@layer theme, base, appearance, field-rules, components, utilities`

Правила:

- компоненти не імпортують CSS із TS — усі стилі глобальні;
- CSS classes: flat namespace `.form-field-*`, `.checkbox-*`, `.switch-*` без brand prefix;
- CSS variables: short prefix `--ff-*` для field tokens;
- усі класи бібліотеки глобальні, namespaced і стабільні.

---

## Рекомендація по `ViewEncapsulation`

Для `fibo-ui` поточний напрямок з `ViewEncapsulation.None` загалом правильний, якщо дотримуватись дисципліни:

- styles мають бути **namespaced селекторами**;
- public/root selectors мають бути стабільні;
- specificity має бути низькою і передбачуваною;
- overlay/portal контент не повинен залежати від випадкового локального scope.

Тобто:

- `ViewEncapsulation.None` — **так**;
- глобальний CSS без неймінгу і без шарів — **ні**.

---

## Що саме варто змінити у fibo-ui

### 1. Прибрати Tailwind class soup з library templates

Насамперед із компонентів на кшталт:

- `Checkbox`
- `Select`
- `Listbox`
- `Switch`
- `FieldShell`-пов’язані компоненти

Там, де зараз у шаблоні багато utilities, треба залишити:

- semantic classes;
- host classes;
- state attributes.

А presentation перенести у глобальні CSS-шари бібліотеки: `appearance`, `component rules` і shared primitives.

### 2. Зробити явний appearance layer

Окремо виділити спільні візуальні ролі:

- interactive surface;
- field surface;
- option/item surface;
- button surface;
- overlay surface.

Це зменшить копіпаст між `buttons.css`, `form-fields.css`, `components.css`.

### 3. Ввести спільні директиви `appearance` і `size`

Початкове рішення:

- зробити загальну директиву appearance;
- зробити загальну директиву size;
- як мінімум інтегрувати їх у `FormField`.

Що вони мають робити:

- приймати публічний Angular input;
- ставити на host:
  - `data-appearance`
  - `data-size`;
- за потреби читати defaults із DI/config.

Це дасть:

- однаковий visual API між компонентами;
- менше локальних ad-hoc inputs;
- прямий і читабельний CSS contract.

### 4. Уніфікувати state attributes

Бажаний набір:

- `data-size`
- `data-appearance`
- `data-state`
- `data-invalid`
- `data-pending`
- `data-readonly`

Плюс native:

- `aria-disabled`
- `aria-selected`
- `aria-expanded`
- `aria-checked`

### 5. Зафіксувати глобальність класів і правил

У `fibo-ui`:

- усі стилі бібліотеки глобальні;
- усі класи бібліотеки глобальні;
- усі селектори бібліотеки namespaced;
- компоненти не мають локальних style imports.

Тобто ми свідомо обираємо модель:

- **global theme + global component rules**

а не:

- **component-local imported styles**, як у Taiga.

### 6. Залишити Tailwind у ролі token/build helper

`theme.css` і `@theme` лишаються корисними, але логіка має бути такою:

- якщо стиль описує **системне значення** — це token;
- якщо стиль описує **поведінку surface/item/control** — це CSS rule;
- якщо стиль описує **одноразову демо-розкладку** — це Tailwind utility.

---

## Антипатерни, яких варто уникати

### 1. Компонент = utility-рядок

Погано, коли компонент читається як набір `flex gap rounded bg text shadow hover disabled dark`.

Це зручно в моменті, але погано:

- для читабельності;
- для масштабування;
- для variants;
- для API стабільності;
- для blueprint use case.

### 2. Варіанти тільки через Angular inputs

Якщо кожну візуальну відмінність зашивати в `@Input()`, компонент дуже швидко стане конфігураційним монстром.

Краще:

- базові public variants — через невеликий API;
- все інше — через CSS contract і composition.

### 3. Імпорт стилів із компонентів

Ми не хочемо, щоб library component був точкою входу для CSS через:

- `styles: "@import ..."`
- `styleUrl`
- `styleUrls`

Для бібліотеки це ускладнює картину і приховує справжню стилізаційну систему.

### 4. Один великий `components.css`

На старті це зручно, але далі перетворюється на невидимий глобальний моноліт.

### 5. Непрозора специфічність

`ViewEncapsulation.None` без дисципліни швидко породжує проблеми, якщо селектори:

- занадто загальні;
- не namespaced;
- вимагають `!important`;
- залежать від випадкової структури DOM.

---

## Остаточне рішення

### Рішення

Для `fibo-ui` приймаємо **hybrid CSS-native architecture**:

1. **Design tokens**  
   у CSS custom properties, з можливим використанням Tailwind `@theme` як генератора частини токенів.

2. **Shared appearance primitives**  
   у окремих глобальних CSS-файлах, незалежно від конкретних компонентів.

3. **Global component rules**  
   у глобальних CSS-файлах бібліотеки, без імпортів з Angular-компонентів.

4. **Template markup**  
   semantic-first, з мінімумом utility-класів у library code.

5. **State styling**  
   через `data-*` та `aria-*`.

6. **Common styling directives**  
   `appearance` і `size` як спільні осі стилізації, починаючи з `FormField`.

7. **Tailwind**  
   не прибираємо, але переводимо з ролі primary styling language у роль:
   - token/build helper,
   - utility layer для app/examples,
   - іноді helper для простих shared primitives.

8. **CSS syntax**  
   тільки native CSS, без Less і SCSS.

### У чому головний сенс

`fibo-ui` не має виглядати як "Angular-бібліотека на Tailwind".

`fibo-ui` має виглядати як:

- **signal-native** бібліотека,
- **composition-first** бібліотека,
- **CSS-native** бібліотека,
- де **Tailwind є інструментом**, а не архітектурною залежністю.

---

## Практичний migration path

**Завершено (2026-04-15):**

1. ✅ FormField + field-like consumers (`TextField`, `Select`, `MultiSelect`, `DatePickerField`, `Combobox`) переведено на semantic CSS, `data-*` / `aria-*` contract, `@layer` структуру.
2. ✅ `Checkbox` + `Switch` переведено на semantic CSS, `data-checked` / `aria-disabled` / `data-size`.
3. ✅ `components.css` та `form-fields.css` видалено — замінено на `styles/*.css` файли з @layer.
4. ✅ State attribute contract зафіксовано: `aria-*` для native states, `data-*` для domain/visual states.
5. ✅ `data-variant` — не вводимо.

**Залишається:**

6. [ ] Директиви `Appearance` (`[fiboAppearance]` → `data-appearance`) і `Size` (`[fiboSize]` → `data-size`) у `lib/primitives/` — cross-component styling axes для Button, Listbox, Popover.
7. [ ] `Button` — переписати `buttons.css` з `@apply` на native CSS, ввести `Appearance` + `Size` осі *(окремий PR)*.
8. [ ] Публічний theming contract — зафіксувати які CSS variables є публічним API.
9. У demo app Tailwind залишаємо як є.

---

## Джерела та референси

### Поточний fibo-ui

- [`docs/philosophy.md`](./philosophy.md)
- [`docs/styling-refactor-plan.md`](./styling-refactor-plan.md) — progress document з деталями рефакторингу
- [`projects/fibo-ui/components/src/theme.css`](../projects/fibo-ui/components/src/theme.css)
- [`projects/fibo-ui/components/src/styles/form-field.css`](../projects/fibo-ui/components/src/styles/form-field.css)
- [`projects/fibo-ui/components/src/styles/appearance.css`](../projects/fibo-ui/components/src/styles/appearance.css)
- [`projects/fibo-ui/components/src/buttons.css`](../projects/fibo-ui/components/src/buttons.css)

### Taiga UI v5

- `taiga-ui-5/projects/styles/taiga-ui-theme.less`
- `taiga-ui-5/projects/styles/theme/appearance.less`
- `taiga-ui-5/projects/styles/theme/appearance/textfield.less`
- `taiga-ui-5/projects/styles/components/button.less`
- `taiga-ui-5/projects/styles/components/textfield.less`

### Офіційні зовнішні референси

- shadcn/ui introduction: https://ui.shadcn.com/docs
- shadcn/ui theming: https://ui.shadcn.com/docs/theming
- shadcn/ui components.json: https://ui.shadcn.com/docs/components-json
- Base UI styling: https://base-ui.com/react/handbook/styling
- Base UI quick start: https://base-ui.com/react/overview/quick-start
- Mantine styles overview: https://mantine.dev/styles/styles-overview/
- Mantine CSS modules: https://mantine.dev/styles/css-modules/
- Mantine unstyled/headless: https://mantine.dev/styles/unstyled
- Tailwind CSS theme/configuration: https://tailwindcss.com/docs/configuration
- Tailwind CSS functions and directives: https://tailwindcss.com/docs/functions-and-directives/
