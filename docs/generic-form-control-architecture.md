# Generic Form Control Architecture

Актуально на 2026-03-22.

Этот документ фиксирует исследование по новой архитектуре generic form controls для `fibo-ui` на базе `@angular/forms/signals`.

Основные вопросы:

- как устроена form-control абстракция в `Taiga UI`;
- есть ли у них директивный слой или всё собрано через базовый control class;
- как сделаны end-off компоненты у них и у нас;
- используют ли ref-libs уже `FormValueControl` и signal forms;
- какие практики сейчас выглядят корректными для кастомных controls поверх `FormValueControl`.

## 1. Короткий вывод

`Taiga UI` не является референсом для signal forms architecture.

Они уже давно решили задачу generic form control, но решили её в старой модели:

- `ControlValueAccessor`;
- `NgControl`;
- базовый класс `TuiControl<T>`;
- визуальный shell (`tui-textfield`) отдельно от value accessor директив.

Для `fibo-ui` правильнее взять у Taiga только композиционную идею:

- отдельный shell/presenter слой;
- отдельный accessor/editor слой;
- отдельные ready-made компоненты поверх composable building blocks.

Но сам generic form contract лучше строить не как новый `CVA 2.0`, а как thin layer вокруг нативного Angular-контракта:

- `FormValueControl<T>`;
- `FormCheckboxControl`;
- `[formField]`.

## 2. Что сейчас делает Angular

По официальному guide и API Angular Signal Forms:

- минимальный custom control должен реализовать только `value = model(...)` и `FormValueControl<T>`;
- для checkbox-like controls нужен `checked = model(...)` и `FormCheckboxControl`;
- все остальные сигналы optional;
- validation должна жить в schema rules, а не внутри контрола;
- `[formField]` сам прокидывает в control state вроде `disabled`, `required`, `invalid`, `errors`, `min`, `max`, `pattern`;
- `ControlValueAccessor` поддерживается только как backward-compat interop, не как preferred path.

Практический смысл:

- generic architecture не должна перехватывать ответственность `[formField]`;
- generic layer должен помогать описывать common UI state, а не дублировать forms runtime.

Официальные источники:

- <https://angular.dev/guide/forms/signals/custom-controls>
- <https://angular.dev/api/forms/signals/FormField>
- <https://angular.dev/api/forms/signals/FormUiControl>

Также важный detail из Angular source:

- `WithOptionalField` уже deprecated alias;
- в публичном guide Angular используется `WithOptionalFieldTree<T>`.

См.:

- [/Users/dentiman/dev/projects/fibo-stack/angular/packages/forms/signals/src/api/rules/validation/validation_errors.ts](/Users/dentiman/dev/projects/fibo-stack/angular/packages/forms/signals/src/api/rules/validation/validation_errors.ts)

## 3. Taiga UI: как у них устроен generic control

### 3.1. Базовая abstraction

В `Taiga UI` generic abstraction собрана вокруг:

- `TuiControl<T>`:
  [/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/cdk/classes/control.ts](/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/cdk/classes/control.ts)
- helper provider `tuiAsControl(...)`

Что делает `TuiControl<T>`:

- реализует `ControlValueAccessor`;
- инжектит `NgControl`;
- сам назначает `this.control.valueAccessor = this`;
- хранит internal value signal;
- синхронизирует `touched`, `status`, `disabled`, `invalid`;
- даёт `onChange` / `onTouched` callbacks как CVA layer.

Это полноценная CVA-база. То есть Taiga generic form abstraction есть, но она завязана на classic Angular forms.

### 3.2. Visual shell отдельно от editing directive

У Taiga shell и editor чаще разделены:

- `TuiTextfieldComponent` отвечает за container, label, icons, dropdown hosting:
  [/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/core/components/textfield/textfield.component.ts](/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/core/components/textfield/textfield.component.ts)
- `TUI_TEXTFIELD_ACCESSOR` / `TuiTextfieldAccessor` задают accessor contract:
  [/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/core/components/textfield/textfield-accessor.ts](/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/core/components/textfield/textfield-accessor.ts)
- `TuiInputDirective` даёт базовый input accessor:
  [/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/core/components/input/input.directive.ts](/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/core/components/input/input.directive.ts)

Это важный architectural precedent:

- shell не равен value control;
- editor/accessor не обязан рендерить container;
- ready-made control собирается из shell + accessor + dropdown/data-list helpers.

### 3.3. End-off components в Taiga

Типичный pattern:

- `input[tuiSelect]` extends `TuiControl<T | null>`:
  [/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/kit/components/select/select.directive.ts](/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/kit/components/select/select.directive.ts)
- `input[tuiComboBox]` extends `TuiControl<T | string | null>`:
  [/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/kit/components/combo-box/combo-box.directive.ts](/Users/dentiman/dev/projects/fibo-stack/taiga-ui/projects/kit/components/combo-box/combo-box.directive.ts)

То есть end-off controls у них часто:

- не компонент, а directive на `input`;
- визуально живут внутри `tui-textfield`;
- value lifecycle наследуют из общей CVA-базы.

### 3.4. Используют ли они `FormValueControl` и signal forms

Нет.

По соседнему репозиторию `taiga-ui` не видно использования:

- `@angular/forms/signals`;
- `FormValueControl`;
- `FormCheckboxControl`.

Они используют:

- `FormControl`;
- `NgControl`;
- `ControlValueAccessor`;
- reactive/template forms interop.

## 4. Что сейчас делает `fibo-ui`

### 4.1. Плюсы текущего состояния

`fibo-ui` уже реально перешёл на signal forms.

Основные точки:

- value controls уже реализуют `FormValueControl<T>`:
  [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/fields/text-field.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/fields/text-field.ts)
  [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/select/select.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/select/select.ts)
  [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/combobox/combobox.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/combobox/combobox.ts)
- checkbox-like controls уже реализуют `FormCheckboxControl`:
  [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/checkbox/checkbox.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/checkbox/checkbox.ts)
  [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/switch/switch.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/switch/switch.ts)
- есть локальный DI token для внутренней композиции:
  [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/form/form-value-control-token.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/form/form-value-control-token.ts)

Это уже ближе к будущему Angular, чем все соседние ref-libs.

### 4.2. Текущее ограничение

Сейчас generic слой пока скорее copy-paste-friendly, чем архитектурно выделенный.

Проблемы:

- optional form state (`required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`) повторяется почти в каждом control;
- `WithOptionalField` импортируется через deprecated alias;
- `FormFieldControl` одновременно играет роль shell и `FormValueControl<unknown>`:
  [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/form/form-field-control.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/form/form-field-control.ts)
- из-за этого в composition-сценариях получается двойная привязка одного и того же field:
  [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/src/app/pages/components/form-controls/examples/form-field-control-signal-form-example.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/src/app/pages/components/form-controls/examples/form-field-control-signal-form-example.ts)

Это работает, но для generic architecture выглядит хрупко:

- shell становится “как будто form control”, хотя сам value обычно редактирует внутренний input;
- значение и state начинают течь через два уровня bindings.

### 4.3. End-off components у нас

Сейчас у нас end-off controls в основном component-first:

- `fibo-text-field`
- `fibo-select`
- `fibo-combobox`
- `fibo-datepicker-field`

А внутри них уже есть composable куски:

- `FormFieldControl` как shell;
- `ComboboxInput` как helper directive;
- DI tokens для internal communication.

Это хорошее направление, но слой generic state ещё не нормализован.

## 5. Что делают другие ref-libs

### 5.1. Angular Material

У Material похожая старая модель:

- `MatFormFieldControl<T>` как container contract;
- `ControlValueAccessor` + `NgControl` как forms integration.

Это полезный референс для separation of concerns, но не для signal forms runtime.

### 5.2. Spartan

`spartan` в соседнем репозитории использует classic forms patterns:

- `NG_VALUE_ACCESSOR`;
- `ControlValueAccessor`;
- `FormControl`.

### 5.3. Zart

`zart` уже показывает signal forms usage в demos, но не показывает зрелую custom-control architecture на `FormValueControl`.

Судя по коду:

- signal forms там используются главным образом с native inputs;
- кастомные компоненты по-прежнему живут на `ControlValueAccessor`.

Итог:

- из соседних библиотек никто пока не является зрелым референсом именно по custom controls на `FormValueControl`;
- самым сильным референсом остаются официальный Angular guide, API и Angular test suite.

## 6. Практики, которые сейчас выглядят правильными

### 6.1. Не строить свой второй forms runtime

Не нужно делать базовый класс, который:

- сам синхронизирует value с field;
- пытается заменить `[formField]`;
- эмулирует `NgControl` или CVA callbacks.

Это путь Taiga, но он решает другую задачу.

Для signal forms источник правды уже есть:

- `[formField]`;
- `FormValueControl`;
- `FormCheckboxControl`.

### 6.2. Делать thin base для optional UI state

Нужен не `AbstractFormControlThatDoesEverything`, а тонкий reusable state layer.

Например:

- `createFormUiState()` helper;
- или `abstract class FiboFormUiControlBase`;
- или набор `withFormUiState()` mixin-like helpers.

Он должен стандартизировать только optional signals:

- `disabled`
- `disabledReasons`
- `readonly`
- `hidden`
- `invalid`
- `pending`
- `touched`
- `dirty`
- `name`
- `required`
- `min`
- `max`
- `minLength`
- `maxLength`
- `pattern`
- `errors`

Но value-specific сигнал должен оставаться в concrete control:

- `value = model<T>(...)`
- или `checked = model<boolean>(...)`

### 6.3. Разделить shell и editor

Для новой архитектуры лучше явно разделить два типа сущностей:

1. `FieldShell` / `FieldPresenter`
2. `ValueEditor`

`FieldShell` отвечает за:

- label;
- hint/error slot;
- icons;
- clear button;
- focus redirection;
- error/disabled visual state.

`ValueEditor` отвечает за:

- `value` или `checked`;
- пользовательский input lifecycle;
- dropdown/open/close logic;
- domain-specific formatting/parsing.

Важное следствие:

- shell не должен по умолчанию притворяться полноценным `FormValueControl`, если он сам не редактирует value.

### 6.4. Для composite controls реализовывать `focus()`

Angular явно поддерживает кастомный `focus()` в `FormUiControl`.

Для composite controls вроде:

- combobox;
- select;
- date picker;
- token input;

стоит реализовать `focus()` и направлять его в внутренний input/button-anchor.

Это даёт корректное поведение для:

- submit errors;
- summary navigation;
- accessibility flows.

### 6.5. Для `touched` предпочитать `model(false)`, если control сам управляет blur/touch

Angular test suite показывает, что `touched` может быть не только input, но и writable interaction state.

Для наших controls это обычно правильнее:

- `touched = model(false)`

а не только:

- `touched = input(false)`

потому что control реально знает момент blur/first interaction.

### 6.6. Не встраивать validation rules в control

Control должен:

- показывать `errors()`;
- показывать `invalid()`;
- использовать `required()`, `min()`, `max()` как UI hints/attributes.

Но не должен сам решать:

- “валидно ли это значение”;
- “какое сообщение показать по business rule”.

Validation остаётся в schema.

### 6.7. Для display state использовать derived signals

Если control имеет разделение между:

- committed value;
- draft/display text;

нужно хранить это явно.

Для `combobox`, `datepicker`, `select with search` это особенно важно.

Здесь правильное направление:

- `value` как form value;
- `query` / `displayValue` как отдельный signal;
- синхронизация через `computed`, `linkedSignal` или очень узкий `effect`.

Не надо смешивать display text и committed form value в один сигнал.

## 7. Рекомендованная архитектура для `fibo-ui`

### 7.1. Слои

Рекомендуемая структура:

1. `FormUiState` layer
2. `FieldShell` layer
3. concrete controls

#### Layer 1: `FormUiState`

Тонкий общий слой для optional signals.

Примерный shape:

```ts
import { input, model } from '@angular/core';
import {
  DisabledReason,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

export abstract class FiboFormUiState {
  readonly disabled = input(false);
  readonly disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  readonly readonly = input(false);
  readonly hidden = input(false);
  readonly invalid = input(false);
  readonly pending = input(false);
  readonly touched = model(false);
  readonly dirty = input(false);
  readonly name = input('');
  readonly required = input(false);
  readonly min = input<number | undefined>(undefined);
  readonly max = input<number | undefined>(undefined);
  readonly minLength = input<number | undefined>(undefined);
  readonly maxLength = input<number | undefined>(undefined);
  readonly pattern = input<readonly RegExp[]>([]);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
```

Смысл этого слоя:

- убрать copy-paste;
- не вмешиваться в value synchronization;
- не дублировать `[formField]`.

#### Layer 2: `FieldShell`

`FormFieldControl` стоит эволюционировать в presentational shell.

Предпочтительный contract:

- shell получает обычные inputs для label/icons/clear/focus behavior;
- form state он получает либо:
  - через прямые inputs от ready-made controls;
  - либо через отдельный `field` input;
  - либо через локальный context token от editor.

Но shell не должен быть главным `FormValueControl` по умолчанию.

#### Layer 3: concrete controls

Concrete controls реализуют только своё domain-specific поведение:

- `TextField extends FiboValueControlBase<string>`
- `Select extends FiboValueControlBase<T | null>`
- `Combobox extends FiboValueControlBase<T | null>`
- `DatePickerField extends FiboValueControlBase<string | Date | ...>`
- `Checkbox` / `Switch` используют checkbox-specific base

### 7.2. Не делать Taiga-style inheritance tree

Не стоит повторять `TuiControl<T>` буквально.

Почему:

- у Angular signal forms уже есть preferred contract;
- любая heavy base class быстро станет конкурирующим runtime;
- inheritance-tree плохо подходит к смешанным component/directive controls;
- часть controls у нас готова как component, часть как directive/helper.

Лучше:

- маленький общий state base;
- helper tokens;
- composable directives;
- thin concrete implementations.

### 7.3. Нормализовать naming под Angular API

Для новой архитектуры лучше сразу перейти на:

- `WithOptionalFieldTree`

вместо:

- `WithOptionalField`

И также подумать о поддержке optional inputs, которые Angular уже умеет прокидывать:

- `readonly`
- `hidden`
- `pending`
- `disabledReasons`
- `name`

Сейчас многие из них у нас просто теряются.

## 8. Практическая рекомендация по следующему шагу

Если двигаться без большого рефактора, правильный порядок такой:

1. заменить deprecated `WithOptionalField` на `WithOptionalFieldTree`;
2. вынести повторяющийся optional form UI state в общий base/helper;
3. отделить `FormFieldControl` от роли primary `FormValueControl`, где это возможно;
4. добавить `focus()` в composite controls;
5. после этого строить новый generic control family уже на едином state contract.

## 9. Ответы на исходные вопросы

### Используют ли Taiga UI новые `FormValueControl` и signal forms?

Нет.

### Есть ли у них generic abstraction form control?

Да, но в classic Angular forms модели:

- `TuiControl<T>`
- `NgControl`
- `ControlValueAccessor`

### Есть ли у них директивы?

Да.

У Taiga end-off controls часто сделаны как directives на `input`, а shell вынесен отдельно.

### Как у них сделаны end-off компоненты?

Часто как:

- `tui-textfield` shell
- `input[tuiSelect]` / `input[tuiComboBox]` accessor-control directive
- dropdown/data-list helpers

### Как у нас?

У нас уже signal-forms-first модель, но generic state layer пока ещё не выделен и повторяется вручную в каждом control.

### Что брать как референс?

Брать у Taiga:

- separation of shell and accessor;
- директивную композицию;
- internal tokens.

Не брать у Taiga:

- CVA-centric generic base как основу новой architecture.
