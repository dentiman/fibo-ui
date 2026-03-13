# Combobox / Autocomplete: расследование по helper directives

Актуально на 2026-03-12.

Этот файл не предлагает немедленную реализацию. Это архитектурное расследование: как дальше развивать `combobox / autocomplete` семейство через вспомогательные директивы так, чтобы это соответствовало текущей архитектуре `fibo-ui`.

Связанный контекст:

- [docs/combobox-autocomplete-patterns.md](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/docs/combobox-autocomplete-patterns.md)
- [docs/combobox-pattern-implementation-catalog.md](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/docs/combobox-pattern-implementation-catalog.md)
- [combobox.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/form-controls/combobox/combobox.ts)

## 1. Короткий вывод

Для нашей библиотеки правильное направление не в том, чтобы делать много отдельных тяжелых компонентов вроде:

- `Autocomplete`
- `SearchableSelect`
- `CreatableSelect`
- `TagsInput`

Правильнее выделить:

1. один stateful root primitive уровня `combobox controller`;
2. несколько узких helper directives поверх текущих `PopoverTrigger`, `DataList`, `SelectionModel`;
3. тонкие ready-made компоненты поверх этих директив.

То есть дальнейшая эволюция должна идти по пути:

- не `еще один новый компонент на каждый паттерн`;
- а `общий controller + composable directives + product wrappers`.

## 2. Что в текущей архитектуре уже хорошо подходит

Сейчас в библиотеке уже есть сильная композиционная база.

### 2.1. `PopoverTrigger` уже является хорошим shell primitive

См.:

- [popover-trigger.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/popover/popover-trigger.ts)

Что уже полезно:

- lifecycle popup уже отделен от конкретного компонента;
- popup-content передается через `TemplateRef`;
- есть `keydownDelegate`;
- есть `delegatesFocus`;
- есть понятная модель `open / close / toggle`.

Для combobox это очень сильный foundation.

### 2.2. `DataList` уже покрывает keyboard navigation

См.:

- [data-list.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/data-list/data-list.ts)
- [data-list-item.directive.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/data-list/data-list-item.directive.ts)

Что уже полезно:

- active item;
- `ArrowUp` / `ArrowDown`;
- `Enter` commit;
- `Escape` close;
- работа с input target уже частично учтена.

Это значит, что для combobox не надо заново изобретать list navigation.

### 2.3. `SelectionModel` уже задает reusable selection contract

См.:

- [selection-models.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/data-list/selection-models.ts)
- [select-date.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/date/select-date.ts)

Что уже полезно:

- single / multi selection уже abstraction, а не hardcoded логика;
- календарь уже показывает, что selection model может быть domain-specific;
- `lastSelection` уже используется как derived signal.

Это важный precedent: combobox тоже лучше строить как composition поверх state contract, а не как монолитный template component.

### 2.4. `MenuPanel` и `SubmenuTrigger` показывают правильный local precedent

См.:

- [menu-panel.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/menu/menu-panel.ts)
- [submenu-trigger.ts](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/menu/submenu-trigger.ts)

Это лучший текущий пример архитектурного направления для combobox family.

Почему:

- есть root/controller directive;
- есть child helper directive;
- используется `hostDirectives`;
- есть локальная регистрация дочерних элементов;
- есть coordination behavior, который не зашит в template компонента.

Именно такой стиль стоит переиспользовать для combobox.

## 3. Что сейчас мешает масштабировать combobox family

Текущий `fibo-combobox` работает как готовый компонент, но пока не является хорошим low-level primitive.

### 3.1. Нет общего combobox state token

Сейчас draft input, selected value, filtering и blur-reset живут внутри компонента.

Из-за этого трудно переиспользовать поведение для:

- `Autocomplete`
- `SearchableSelect`
- `Creatable`
- `TagsInput`
- `textarea`-based suggestions

### 3.2. Нет разделения на controller и behavior directives

Сейчас внутри компонента перемешаны:

- popup orchestration;
- filtering;
- blur policy;
- draft synchronization;
- option commit contract.

Для одной ready-made реализации это нормально, но для семейства паттернов это слабая база.

### 3.3. Нет reusable editable-input contract

Нам нужен общий слой для:

- `inputValue`;
- reset-on-blur;
- open-on-input;
- keyboard bridge;
- `aria-*` атрибутов;
- синхронизации draft и selection.

Сейчас это не выделено.

### 3.4. Нет reusable item metadata contract

Сейчас option фактически сводится к:

- `label`
- `value`

Для product-grade autocomplete этого мало. Скоро понадобятся:

- `keywords`
- `description`
- `group`
- `disabled`
- `searchText`
- `displayText`

### 3.5. Нет formal draft/commit lifecycle

Combobox family всегда живет на двух разных состояниях:

- draft text;
- committed value.

Нам нужен явный contract для действий:

- `type`
- `highlight`
- `commit`
- `cancel`
- `reset draft`

Пока это не выделено как отдельная abstraction.

## 4. Какой слой abstractions здесь нужен

### 4.1. Root directive уровня `fiboCombobox`

Нужен controller directive, который:

- висит на контейнере или field shell;
- предоставляет DI token состояния;
- композирует `PopoverTrigger`;
- знает про selection, draft, highlighted item и filtered collection;
- ничего не рендерит сам.

Рабочее направление:

```ts
@Directive({
  selector: '[fiboCombobox]',
  hostDirectives: [
    {
      directive: PopoverTrigger,
      inputs: ['content', 'delegatesFocus', 'overlayCategory'],
    },
  ],
  providers: [{ provide: COMBOBOX_STATE, useExisting: FiboCombobox }],
})
export class FiboCombobox<T> {
  value = model<T | null>(null);
  items = input<readonly T[]>([]);
  displayWith = input<(item: T | null) => string>(defaultDisplayWith);
  searchBy = input<(item: T) => string>(defaultSearchBy);

  selectedItem = computed(/* ... */);
  inputValue = linkedSignal(/* derived from selectedItem */);
  highlightedItem = signal<T | null>(null);
  filteredItems = computed(/* ... */);
}
```

Ключевая мысль:

- root directive хранит state и policy hooks;
- visual markup остается у компонента или пользователя.

### 4.2. Helper directive уровня `fiboComboboxInput`

Нужна отдельная directive на `input` и позже на `textarea`:

- `input[fiboComboboxInput]`
- `textarea[fiboComboboxInput]`

Её задача:

- пробросить `role="combobox"`;
- выставить `aria-autocomplete`;
- управлять open-on-input;
- делать blur-reset;
- синхронизировать DOM input и `inputValue`;
- пробрасывать keyboard bridge в controller.

Важно: это не должна быть directive, которая сама знает про `items` и filtering. Она должна работать через injected root state.

### 4.3. Helper directive уровня `fiboComboboxPopup`

Нужна directive для popup container, которая:

- подключает `DataList`;
- пробрасывает `trigger`;
- синхронизирует active option и controller state;
- умеет закрывать popup после commit;
- знает, что находится в context combobox, а не generic menu/listbox.

Селектор мог бы быть таким:

- `[fiboComboboxPopup]`

Она должна переиспользовать существующие primitives, а не дублировать их.

### 4.4. Helper directive уровня `fiboComboboxOption`

Нужна узкая directive для option metadata.

Она должна:

- регистрировать option в combobox context;
- знать display/search metadata;
- по возможности композировать `DataListItem`, а не заменять его.

Примерная роль:

- `[fiboComboboxOption]`

Сигнал этой директивы нужен не только для selection, но и для `aria-activedescendant`, rich rendering и future grouping.

### 4.5. Optional behavior directives

Дальше логично выделить opt-in слои:

- `[fiboAutocompleteLocal]`
- `[fiboAutocompleteAsync]`
- `[fiboComboboxResetOnBlur]`
- `[fiboComboboxAutoHighlight]`
- `[fiboComboboxCreatable]`
- `[fiboComboboxTags]`

Это важный принцип: не надо в корневой directive сразу зашивать все режимы.

## 5. Как именно это бьется с архитектурой нашей библиотеки

### 5.1. Через `hostDirectives`, а не через inheritance

В библиотеке уже видно правильное направление:

- `PopoverTriggerClick`
- `PopoverTriggerToggle`
- `SubmenuTrigger`
- `MenuPanel`

Combobox helper layer должен использовать ту же модель:

- `hostDirectives`;
- `inject()`;
- DI tokens;
- локальные controller directives.

### 5.2. Через DI context, а не через input spaghetti

Нежелательный путь:

- прокидывать 15 inputs между input directive, popup directive и option directive.

Лучший путь:

- root directive предоставляет `COMBOBOX_STATE`;
- дочерние directives inject'ят его;
- inputs нужны только для policy, а не для базового wiring.

### 5.3. Через signals, а не через каскад `effect()` для синхронизации

По официальной документации Angular `linkedSignal` нужен именно для writable derived state.

В нашей задаче это идеально ложится на:

- draft input text, завязанный на `selectedItem`;
- highlighted value, завязанный на visible collection;
- reset policy при смене source state.

Практический вывод:

- `linkedSignal` подходит для `inputValue <- selectedItem`;
- `computed` подходит для `filteredItems`;
- `signal` подходит для transient UI state;
- `effect` должен остаться только для integration side effects, а не для основного state sync.

Это соответствует актуальному guidance Angular signals:

- <https://angular.dev/guide/signals>
- <https://angular.dev/guide/signals/linked-signal>

### 5.4. Через composable ready-made wrappers

После появления helper directives ready-made компоненты становятся очень тонкими:

- `fibo-combobox`
- `fibo-autocomplete`
- `fibo-searchable-select`
- `fibo-tags-input`

То есть компонентная прослойка остается, но бизнес-логика уходит вниз, в reusable directives.

## 6. Конкретный рекомендуемый набор helper directives

Ниже practical shortlist. Это не roadmap по реализации, а предлагаемая структура.

### 6.1. Core

#### 1. `fiboCombobox`

Root/controller directive.

Ответственность:

- state;
- selection binding;
- display/search adapters;
- filtered collection;
- open/highlight/commit API.

#### 2. `fiboComboboxInput`

Directive на `input` или `textarea`.

Ответственность:

- ARIA;
- draft editing;
- open-on-input;
- blur-reset;
- DOM <-> signal sync.

#### 3. `fiboComboboxPopup`

Directive на popup container.

Ответственность:

- `Popover + DataList` wiring;
- bridge к trigger;
- close-on-commit;
- sync active item.

#### 4. `fiboComboboxOption`

Directive на option element.

Ответственность:

- item registration;
- metadata;
- commit/select behavior.

### 6.2. Secondary reusable behaviors

#### 5. `fiboAutocompleteLocal`

Локальная фильтрация из массива items.

#### 6. `fiboAutocompleteAsync`

Async suggestions lifecycle:

- loading;
- empty;
- error;
- request replacement.

#### 7. `fiboComboboxAutoHighlight`

Автоматически держит первый match в active state.

#### 8. `fiboComboboxResetOnBlur`

Выделяет blur policy в opt-in behavior, а не hardcodes её везде.

#### 9. `fiboComboboxDisplayWith`

Адаптер для display text.

#### 10. `fiboComboboxSearchBy`

Адаптер для search text.

### 6.3. Product extensions

#### 11. `fiboComboboxCreatable`

Create-new flow.

#### 12. `fiboComboboxTags`

Multi + tokenization.

#### 13. `fiboComboboxGroups`

Grouped collections.

#### 14. `fiboComboboxTextarea`

Поведение для multiline composer/mentions scenarios.

## 7. Каким должен быть минимальный API root directive

Ниже примерный shape API, который выглядит совместимым с нашей архитектурой.

```ts
export interface ComboboxItemAdapter<T> {
  valueOf(item: T): unknown;
  labelOf(item: T): string;
  searchTextOf?(item: T): string;
  disabled?(item: T): boolean;
}

export interface ComboboxState<T> {
  value: WritableSignal<unknown>;
  inputValue: WritableSignal<string>;
  selectedItem: Signal<T | null>;
  highlightedItem: Signal<T | null>;
  filteredItems: Signal<readonly T[]>;
  open(): void;
  close(): void;
  highlight(item: T | null): void;
  commit(item: T): void;
  resetDraft(): void;
}
```

Важно:

- root state не обязан знать про визуальный template;
- он должен быть пригоден и для `input`, и для `textarea`;
- multi/tags не должны ломать single-value API, а должны расширять его отдельным слоем.

## 8. Пример целевой композиции

Ниже важен не синтаксис, а целевой стиль.

```html
<fibo-form-field-control
  fiboCombobox
  #combo="fiboCombobox"
  [items]="users"
  [displayWith]="userLabel"
  [searchBy]="userSearchText"
  [content]="optionsTpl"
  [(value)]="assignee"
>
  <input fiboComboboxInput class="text-field-input" placeholder="Search assignee" />

  <ng-template #optionsTpl let-trigger>
    <div fiboComboboxPopup fiboPopover [trigger]="trigger">
      @for (item of combo.filteredItems(); track item.id) {
        <button
          type="button"
          fiboComboboxOption
          [comboboxOption]="item"
          class="datalist-item w-full text-left"
        >
          {{ item.name }}
        </button>
      }
    </div>
  </ng-template>
</fibo-form-field-control>
```

Это хорошо соответствует текущему стилю библиотеки, потому что:

- container template остается декларативным;
- primitives остаются маленькими;
- поведение собирается из директив;
- готовый компонент можно потом сделать thin wrapper над тем же DSL.

## 9. Что не стоит делать

### 9.1. Не делать один "умный" giant component

Плохое направление:

- один компонент содержит все режимы;
- куча flags;
- куча веток в template;
- логика `select + autocomplete + creatable + tags + async` живет в одном классе.

Это будет плохо масштабироваться.

### 9.2. Не дублировать `DataList` и `SelectionModel`

Уже есть хорошие primitives.

Для combobox лучше:

- адаптировать;
- расширять через bridge directives;
- но не писать свой parallel list system.

### 9.3. Не делать `inputValue` частью form value

Это критично.

Для combobox почти всегда нужно разделение:

- `draft text`;
- `committed value`.

Если это смешать, дальше сломаются:

- blur reset;
- restricted choice;
- async suggestions;
- create-new;
- tags.

### 9.4. Не зашивать async внутрь базового root

Async поведение должно быть extension layer.

Иначе базовый primitive сразу станет тяжелым и хрупким.

## 10. Наиболее рациональный следующий архитектурный шаг

Если смотреть не на feature roadmap, а именно на архитектуру, то следующий самый полезный шаг был бы таким:

1. выделить root directive `fiboCombobox`;
2. выделить `fiboComboboxInput`;
3. выделить `fiboComboboxPopup`;
4. вынести blur-reset и local filtering из компонента в reusable behavior;
5. только после этого строить новые ready-made wrappers.

Это даст:

- повторное использование;
- предсказуемое расширение до `Autocomplete`, `SearchableSelect`, `Creatable`, `TagsInput`;
- соответствие текущему compositional style библиотеки.

## 11. Итог

Для `fibo-ui` combobox family лучше развивать не как набор независимых компонентов, а как:

- `PopoverTrigger + DataList + SelectionModel`
- плюс `Combobox controller`
- плюс helper directives для input, popup, option и policy behaviors
- плюс тонкие public wrappers

Это направление уже хорошо поддерживается существующей архитектурой библиотеки и особенно похоже на то, как у нас сделаны:

- `MenuPanel`
- `SubmenuTrigger`
- `SelectDate`
- `SelectOne`

Именно это выглядит наиболее совместимым с текущим стилем кода, с Signals API и с дальнейшей эволюцией `input` и `textarea`-based autocomplete паттернов.

## Источники

- Angular Signals Guide: <https://angular.dev/guide/signals>
- Angular `linkedSignal`: <https://angular.dev/guide/signals/linked-signal>
- WAI-ARIA APG Combobox Pattern: <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
