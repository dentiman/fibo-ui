# Taiga UI v5 — устройство системы стилизации и component API

## Цель

Этот документ фиксирует, как в `Taiga UI v5` устроены:

- общий слой стилизации;
- theme tokens и appearance layer;
- кнопки;
- form/textfield primitives;
- использование `hostDirectives` для styling API и кастомной логики.

Исследование основано на локальном коде из `ref-libs`:

- `/Users/dentiman/dev/projects/fibo-stack/taiga-ui-5/projects/styles`
- `/Users/dentiman/dev/projects/fibo-stack/taiga-ui-5/projects/core`
- `/Users/dentiman/dev/projects/fibo-stack/taiga-ui-5/projects/kit`

---

## 1. Общая архитектура стилей в Taiga UI v5

### Главная идея

В `Taiga UI v5` стилизация построена как **несколько слоёв**, а не как "стили рядом с каждым компонентом без системы":

1. **Theme tokens**
2. **Appearance layer**
3. **Component styles**
4. **Локальные component-specific styles**, если базового style package недостаточно

Ключевой вывод:

> В Taiga основной язык дизайн-системы — это **Less + CSS custom properties + data attributes**, а не utility classes.

---

## 2. Где живут стили

### 2.1. Центральный theme entrypoint

Файл:

- `taiga-ui-5/projects/styles/taiga-ui-theme.less`

Он собирает theme layer:

```less
@import 'theme/variables.less';
@import 'theme/palette.less';
@import 'theme/appearance.less';
@import 'theme/appearance/textfield.less';
```

То есть theme package явно разделён на:

- базовые переменные;
- палитру и semantic colors;
- appearance rules;
- специализированные appearance overrides, например для textfield.

### 2.2. Design tokens

Файлы:

- `projects/styles/theme/variables.less`
- `projects/styles/theme/palette.less`

Что хранится в `variables.less`:

- typography tokens (`--tui-typography-*`);
- radii (`--tui-radius-*`);
- heights (`--tui-height-*`);
- paddings (`--tui-padding-*`);
- misc tokens (`--tui-duration`, `--tui-disabled-opacity`);
- RTL/logical tokens (`--tui-inline-start`, `--tui-inline-end`, `--tui-inline`).

Что хранится в `palette.less`:

- background roles;
- text roles;
- status colors;
- border colors;
- elevation colors;
- shadows;
- light/dark theme branches через `[tuiTheme='light']` / `[tuiTheme='dark']`.

Вывод:

- Taiga не держит тему в TS;
- тема строится через **CSS variables как source of truth**;
- theme switching реализован на уровне атрибутов, не на уровне utility-классов.

---

## 3. Appearance layer

### 3.1. Базовый appearance primitive

Файлы:

- `projects/core/directives/appearance/appearance.directive.ts`
- `projects/core/directives/appearance/with-appearance.ts`
- `projects/styles/components/appearance.less`
- `projects/styles/theme/appearance/*.less`

`TuiAppearance` — это базовая директива, которая вешает на host:

- `data-appearance`
- `data-state`
- `data-focus`
- `data-mode`
- `data-tui-version`

и одновременно подтягивает library CSS:

```ts
styles: `
  [data-tui-version='${TUI_VERSION}'] {
    @import '@taiga-ui/styles/components/appearance.less';
  }
`,
encapsulation: ViewEncapsulation.None,
```

Это очень важный паттерн Taiga:

> Angular-компонент/директива служит точкой подключения style package, а реальные visual rules живут в `@taiga-ui/styles`.

### 3.2. Зачем нужен `TuiWithAppearance`

`TuiWithAppearance` — это thin wrapper над `TuiAppearance` через `hostDirectives`:

```ts
@Directive({
  hostDirectives: [
    {
      directive: TuiAppearance,
      inputs: [
        'tuiAppearance: appearance',
        'tuiAppearanceState',
        'tuiAppearanceFocus',
        'tuiAppearanceMode',
      ],
    },
  ],
})
```

Смысл:

- наружу компонент получает удобный API `appearance="primary"`;
- внутри всё сводится к единой директиве `TuiAppearance`.

Это хороший пример того, как `hostDirectives` используются не только для поведения, но и для **нормализации component API**.

### 3.3. Как закодированы варианты

Appearance-варианты живут в theme-файлах:

- `theme/appearance/primary.less`
- `theme/appearance/outline.less`
- `theme/appearance/secondary.less`
- `theme/appearance/flat.less`
- `theme/appearance/floating.less`
- `theme/appearance/action.less`
- `theme/appearance/status.less`

Например, `primary.less` стилизует:

```less
[tuiAppearance][data-appearance='primary'] { ... }
```

а `outline.less` использует комбинации:

- `data-appearance='outline'`
- `data-mode~='checked'`
- invalid states
- hover/active helpers

Вывод:

- вариант в Taiga — это **не ветка в Angular template**;
- вариант — это **CSS rule на основе data attributes**.

---

## 4. Как устроены кнопки

### 4.1. Кнопка — это directive, а не большой компонент

Файлы:

- `projects/core/components/button/button.directive.ts`
- `projects/core/components/button/button.options.ts`
- `projects/styles/components/button.less`

`TuiButton` — это директива на:

- `a[tuiButton]`
- `button[tuiButton]`
- `a[tuiIconButton]`
- `button[tuiIconButton]`

Кнопка не рендерит собственный шаблон. Она:

- добавляет host bindings;
- подключает styling package;
- подключает appearance API;
- подключает icon API.

### 4.2. Какие пропсы есть у кнопки

По факту публичный API кнопки строится так:

- `appearance` — через `TuiWithAppearance`
- `size` — через input самой директивы `TuiButton`

`button.options.ts`:

```ts
export const TUI_BUTTON_DEFAULT_OPTIONS = {
  appearance: 'primary',
  size: 'l',
};
```

Наружное использование в demo:

```html
<button size="m" tuiButton>Medium</button>
<button appearance="outline" tuiButton>Outline</button>
```

Поддерживаемые кнопочные размеры по коду/demo:

- `xs`
- `s`
- `m`
- `l`

Поддерживаемые appearance-варианты по demo/theme:

- `primary`
- `accent`
- `secondary`
- `flat`
- `outline`
- `floating`
- также destructive / grayscale-ветки через theme rules

### 4.3. Как кнопка подключает стили

В `button.directive.ts`:

```ts
styles: `
  [data-tui-version='${TUI_VERSION}'] {
    @import '@taiga-ui/styles/components/button.less';
  }
`,
encapsulation: ViewEncapsulation.None,
```

И на host:

```ts
host: {'[attr.data-size]': 'size()'}
```

То есть CSS читается так:

- `[tuiButton]`
- `[tuiIconButton]`
- `[data-size='xs' | 's' | 'm' | 'l']`
- плюс `data-appearance` от `TuiAppearance`

### 4.4. Что делает `button.less`

`projects/styles/components/button.less` задаёт:

- внутренние CSS vars:
  - `--t-size`
  - `--t-radius`
  - `--t-gap`
  - `--t-padding`
- базовую геометрию и типографику;
- branching по `data-size`;
- отдельную логику для icon button;
- loading state;
- vertical button mode.

Это важный момент:

> size у них решается не через Angular if/switch, а через `data-size` + CSS variables.

### 4.5. Как `hostDirectives` используются в кнопках

В `TuiButton`:

```ts
hostDirectives: [TuiWithAppearance, TuiWithIcons]
```

Здесь `hostDirectives` используются для композиции двух orthogonal concerns:

- appearance/states;
- icon handling.

То есть сама кнопка остаётся небольшой директивой, а логика нарастает композиционно.

### 4.6. Специальный случай `TuiButtonX`

Файл:

- `projects/core/directives/button-x/button-x.directive.ts`

Это не просто ещё одна кнопка, а compose-обёртка:

- задаёт свои defaults через `tuiButtonOptionsProvider(...)`;
- подставляет close icon через DI;
- использует `hostDirectives: [{ directive: TuiButton, inputs: ['size'] }]`;
- ставит `tuiIconButton`, `type="button"`, `tabindex="-1"`.

Здесь `hostDirectives` используются уже как **реиспользование готового button primitive** с частично переэкспортированным API.

Это один из лучших примеров в Taiga, как `hostDirectives` помогают строить специализированные директивы без копипаста базовой логики.

---

## 5. Как устроены form/textfield primitives

### 5.1. Базовая идея

В Taiga textfield — это **контейнер-примитив**, а не просто `input` со стилями.

Файлы:

- `projects/core/components/textfield/textfield.component.ts`
- `projects/core/components/textfield/textfield.options.ts`
- `projects/core/components/textfield/textfield.template.html`
- `projects/styles/components/textfield.less`
- `projects/styles/theme/appearance/textfield.less`

То есть архитектура split на два уровня:

1. `tui-textfield` как visual/interactive shell
2. `input[tuiInput]`, `input[tuiSelect]`, `textarea[tuiTextarea]`, `input[tuiInputDate]` и т.д. как специализированные accessors/control directives

### 5.2. `tui-textfield` как shell

`TuiTextfieldComponent`:

- standalone component;
- `ViewEncapsulation.None`;
- импортирует общий `textfield.less`;
- на host вешает `data-size`, классы состояний, event bindings;
- через `hostDirectives` подключает:
  - `TuiAppearance`
  - dropdown behavior
  - icons
  - items handlers
  - option content

То есть textfield shell одновременно:

- visual container;
- dropdown host;
- icon host;
- appearance surface;
- data-list host для option-based controls.

### 5.3. Какие пропсы есть у textfield

Через `TuiTextfieldOptionsDirective` наружу отдаются:

- `[tuiTextfieldAppearance]`
- `[tuiTextfieldSize]`
- `[tuiTextfieldCleaner]`

Значения по умолчанию:

```ts
const DEFAULT = {
  appearance: 'textfield',
  size: 'l',
  cleaner: true,
};
```

Размеры для textfield:

- `s`
- `l`

То есть textfield API уже заметно более сдержанный, чем button API.

### 5.4. Как options сделаны архитектурно

`textfield.options.ts` использует `InjectionToken` + provider composition:

- есть `TUI_TEXTFIELD_OPTIONS`;
- есть `tuiTextfieldOptionsProvider(...)`;
- есть directive `TuiTextfieldOptionsDirective`, которая экспортирует inputs и предоставляет себя как реализацию options token.

Это позволяет:

- задавать defaults локально для subtree;
- менять appearance/size/cleaner через DI;
- не тащить все настройки в один большой component class.

Это важный паттерн Taiga:

> visual options часто живут как DI-config + thin directive, а не как giant input surface на одном компоненте.

### 5.5. Как стилизуется textfield

У textfield два слоя:

1. `projects/styles/components/textfield.less`
2. `projects/styles/theme/appearance/textfield.less`

#### `styles/components/textfield.less`

Этот файл задаёт:

- layout shell;
- CSS vars уровня компонента:
  - `--t-height`
  - `--t-padding`
  - `--t-label`
  - `--t-start`
  - `--t-end`
  - и т.д.
- работу label/filler/template;
- geometry по size;
- cleaner visibility;
- readonly / disabled / autofill / placeholder behavior;
- связь с `[tuiInput]`, `[tuiLabel]`, `[tuiButtonX]`.

#### `theme/appearance/textfield.less`

Этот файл задаёт именно visual appearance:

- background;
- outline;
- box-shadow;
- hover/focus/invalid/disabled rules;
- dark-theme overrides.

Вывод:

> В Taiga layout textfield и visual appearance textfield — это разные файлы и разные уровни ответственности.

Это очень сильное архитектурное решение.

---

## 6. Как устроен `input[tuiInput]`

Файлы:

- `projects/core/components/input/input.directive.ts`
- `projects/core/components/input/input.ts`

`TuiInputDirective` — это адаптер native input к textfield shell:

- предоставляет себя как `TuiTextfieldAccessor`;
- получает `TuiTextfieldComponent` через `inject`;
- синхронизирует `id`, `readonly`, empty state;
- прокидывает appearance state/focus/mode через helper functions:
  - `tuiAppearance(...)`
  - `tuiAppearanceState(...)`
  - `tuiAppearanceMode(...)`
  - `tuiAppearanceFocus(...)`

Это очень интересный момент:

`input[tuiInput]` не только живёт внутри `tui-textfield`, но и **программно биндингует значения в `TuiAppearance`**.

Например:

- invalid -> `data-mode='invalid'`
- readonly -> `data-mode='readonly'`
- focus -> `data-focus`

То есть styling state не дублируется вручную в шаблоне, а собирается как reactive binding к appearance directive.

### `TuiWithInput`

Есть обёртка:

```ts
@Directive({
  hostDirectives: [
    {
      directive: TuiInputDirective,
      inputs: ['invalid', 'focused', 'readOnly', 'state'],
    },
  ],
})
export class TuiWithInput {}
```

Это тот же паттерн, что и в `TuiWithAppearance`:

- thin facade;
- переэкспорт inputs;
- базовая логика остаётся в внутренней директиве.

---

## 7. Как form controls собираются поверх textfield

### 7.1. `input[tuiSelect]`

Файл:

- `projects/kit/components/select/select.directive.ts`

`TuiSelectDirective`:

- строится поверх `TuiWithInput` и `TuiSelectLike` через `hostDirectives`;
- является `TuiControl<T | null>`;
- реализует `TuiTextfieldAccessor<T>`;
- синхронизирует выбранное значение в строку через `itemsHandlers.stringify()`.

Что делает `TuiSelectLike`:

- переводит input в select-like режим;
- ставит `inputmode="none"`;
- блокирует обычный текстовый ввод;
- оставляет только deletion/clear сценарий;
- скрывает Android-specific unwanted behavior.

Вывод:

> Taiga не делает select отдельным полностью изолированным компонентом.  
> Она переиспользует textfield shell + input directive + select-like behavior + dropdown.

### 7.2. Date/time/month inputs

В `kit` видно, что компоненты типа:

- `input[tuiInputDate][type="date"]`
- `input[tuiInputDateTime][type="datetime-local"]`
- `input[tuiInputMonth][type="month"]`
- `input[tuiInputTime][type="time"]`

используют `hostDirectives: [TuiWithNativePicker]`.

`TuiWithNativePicker` — маленькая directive с imperative constructor logic:

```ts
constructor() {
  tuiInjectElement<HTMLInputElement>().type = 'text';
}
```

Их комментарий прямо объясняет, зачем:

- из-за порядка effects и host bindings в Angular 19+;
- чтобы не потерять initial value.

Это ещё один важный паттерн:

> `hostDirectives` в Taiga используют не только для "UI API", но и для low-level platform workaround / host initialization logic.

---

## 8. Как именно Taiga использует `hostDirectives`

### Паттерн 1. Переэкспорт styling API

Пример:

- `TuiWithAppearance`
- `TuiWithInput`

Сценарий:

- внутренняя директива содержит основную логику;
- внешняя thin directive реэкспортирует нужные inputs в более удобной форме.

### Паттерн 2. Композиция поведения

Пример:

- `TuiButton` -> `TuiWithAppearance`, `TuiWithIcons`
- `TuiTextfieldComponent` -> `TuiAppearance`, dropdown directives, icons, option content
- `TuiSelectDirective` -> `TuiWithInput`, `TuiSelectLike`

Сценарий:

- компонент/директива не наследуется;
- он собирается из специализированных узких primitive-директив.

### Паттерн 3. Специализация поверх базового primitive

Пример:

- `TuiButtonX` -> `TuiButton`

Сценарий:

- берут базовую кнопку;
- переиспользуют её host behavior/style contract;
- ограниченно реэкспортируют inputs;
- добавляют свои defaults и host attrs.

### Паттерн 4. Low-level host workaround

Пример:

- `TuiWithNativePicker`

Сценарий:

- директива инкапсулирует технический workaround;
- form control просто подключает её через `hostDirectives`.

---

## 9. Какой public styling API у кнопок и form controls

### Кнопка

Основной API:

- `tuiButton`
- `tuiIconButton`
- `appearance="..."`
- `size="xs|s|m|l"`
- дополнительные state inputs через `TuiAppearance`:
  - `[tuiAppearanceState]`
  - `[tuiAppearanceFocus]`
  - `[tuiAppearanceMode]`

Что реально читает CSS:

- `data-appearance`
- `data-size`
- `data-state`
- `data-focus`
- `data-mode`

### Textfield / Input shell

Основной API:

- `<tui-textfield>`
- `[tuiTextfieldAppearance]`
- `[tuiTextfieldSize]`
- `[tuiTextfieldCleaner]`

Плюс input-level API:

- `input[tuiInput]`
- `input[tuiSelect]`
- `input[tuiInputDate]`
- `textarea[tuiTextarea]`
- и т.д.

Что реально читает CSS:

- `data-size`
- `data-appearance`
- `data-state`
- `data-focus`
- `data-mode`
- локальные служебные классы вроде `._with-label`, `._with-template`, `._disabled`, `._empty`

---

## 10. Сильные стороны подхода Taiga UI v5

### 10.1. Чёткое разделение слоёв

Они явно отделяют:

- tokens;
- appearance;
- component geometry/layout;
- low-level Angular behavior.

### 10.2. CSS — первичный слой системы

Angular API у них сравнительно тонкий. Основная система живёт в CSS/Less:

- через CSS vars;
- через `data-*`;
- через appearance files.

### 10.3. `hostDirectives` используются по-настоящему архитектурно

Не как декоративная фича, а как основной способ:

- переиспользовать styling/behavior primitives;
- собирать сложные controls без inheritance;
- разделять concerns.

### 10.4. Form controls собраны как shell + accessors

Это даёт:

- переиспользование textfield surface;
- единый cleaner/label/icon/dropdown contract;
- единый styling API для разных input-подтипов.

---

## 11. Слабые стороны и цена подхода

### 11.1. Высокая архитектурная сложность

Чтобы понять, как выглядит кнопка или input, нужно смотреть сразу в несколько мест:

- директива;
- options provider;
- appearance directive;
- styles package;
- theme appearance overrides.

### 11.2. Много скрытого API в DI и hostDirectives

Внешне компонент может выглядеть простым, но реальный behavior/style contract распределён между несколькими директивами.

### 11.3. Сильная зависимость от внутренней дисциплины

Такой подход работает, только если команда строго держит:

- naming;
- data attributes;
- tokens;
- composition boundaries.

Без этого система быстро расползается.

---

## 12. Короткий итог

`Taiga UI v5` строит стилизацию не как набор локальных стилей у компонентов, а как **многоуровневую CSS-native систему**:

1. `theme tokens` через CSS variables;
2. `appearance` как общий visual contract;
3. `component styles` как геометрия и layout;
4. `hostDirectives` как главный механизм композиции styling API и поведения.

Кнопки у них:

- директивные;
- с `appearance + size`;
- с общим appearance engine;
- стилизуются через `data-*` и CSS vars.

Form controls у них:

- строятся вокруг `tui-textfield` shell;
- accessors (`tuiInput`, `tuiSelect`, `tuiInputDate`...) подключаются отдельными директивами;
- styling state синхронизируется через `TuiAppearance`;
- `hostDirectives` используются для composition, API facade и platform-specific logic.

Если свести подход Taiga к одной фразе:

> **Внешний Angular API остаётся относительно тонким, а настоящая система живёт в CSS variables, data attributes, DI-config и host directive composition.**

---

## Исходные файлы

Ключевые файлы, которые были просмотрены:

- `taiga-ui-5/projects/styles/taiga-ui-theme.less`
- `taiga-ui-5/projects/styles/theme/variables.less`
- `taiga-ui-5/projects/styles/theme/palette.less`
- `taiga-ui-5/projects/styles/components/appearance.less`
- `taiga-ui-5/projects/styles/theme/appearance/primary.less`
- `taiga-ui-5/projects/styles/theme/appearance/outline.less`
- `taiga-ui-5/projects/styles/theme/appearance/textfield.less`
- `taiga-ui-5/projects/styles/components/button.less`
- `taiga-ui-5/projects/styles/components/textfield.less`
- `taiga-ui-5/projects/core/directives/appearance/appearance.directive.ts`
- `taiga-ui-5/projects/core/directives/appearance/with-appearance.ts`
- `taiga-ui-5/projects/core/components/button/button.directive.ts`
- `taiga-ui-5/projects/core/components/button/button.options.ts`
- `taiga-ui-5/projects/core/directives/button-x/button-x.directive.ts`
- `taiga-ui-5/projects/core/components/textfield/textfield.component.ts`
- `taiga-ui-5/projects/core/components/textfield/textfield.options.ts`
- `taiga-ui-5/projects/core/components/textfield/textfield.template.html`
- `taiga-ui-5/projects/core/components/textfield/select-like.directive.ts`
- `taiga-ui-5/projects/core/components/textfield/with-native-picker.directive.ts`
- `taiga-ui-5/projects/core/components/input/input.directive.ts`
- `taiga-ui-5/projects/kit/components/select/select.directive.ts`
- `taiga-ui-5/projects/kit/components/input-date/input-date.component.ts`

