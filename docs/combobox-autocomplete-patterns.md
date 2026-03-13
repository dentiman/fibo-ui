# Combobox / Autocomplete / Searchable Select

Актуально на 2026-03-10.

Этот документ собирает полную картину по семейству паттернов `combobox / autocomplete / searchable select / creatable / tags input`:

- какие задачи они покрывают;
- как они классифицируются в стандартах accessibility;
- какие режимы поведения реально встречаются в продуктах;
- как это реализовано в популярных UI-библиотеках;
- какие capability gaps обычно появляются, если в дизайн-системе уже есть обычный `select` и popup-field уровня `datepicker`.

Документ намеренно не анализирует текущую реализацию компонентов в `fibo-ui`. Здесь собрана именно референсная модель паттерна.

## 1. Короткий вывод

Это не один компонент, а семейство смежных паттернов.

Самый общий и стандартный термин на уровне accessibility: `combobox`.

Все остальные названия обычно описывают конкретные подвиды или продуктовые режимы:

- `autocomplete`
- `autosuggest`
- `typeahead`
- `searchable select`
- `creatable`
- `tags input`
- `async search`

Практически полезно мыслить не названием одного компонента, а набором осей:

- можно ли печатать в поле;
- можно ли вводить произвольное значение;
- value выбирается только из options или нет;
- suggestions локальные или серверные;
- single или multiple selection;
- popup простой listbox или более богатый result panel;
- фильтрация автоматическая или внешняя;
- значение текстовое или объектное;
- требуется ли создавать новые элементы.

Если в системе уже есть:

- `datepicker` как `field + popup + keyboard + selection model`;
- обычный `select` без arbitrary value;

то до полноценного семейства `combobox` обычно не хватает прежде всего:

- разделения `input value` и `selected value`;
- model для suggestions;
- editable режима;
- режима выбора и режима набора текста одновременно;
- фильтрации;
- async loading;
- creatable flow;
- multi/tagging flow;
- ARIA-contract для editable combobox.

## 2. Базовая терминология

### 2.1. Что такое combobox

По WAI-ARIA APG `combobox` это поле ввода или select-only control, управляющее popup-контентом, который помогает выбрать значение.

Ключевая идея:

- есть `trigger/input`;
- есть `popup`;
- есть активный элемент в popup;
- есть commit выбранного значения в поле.

Важно: по стандарту popup у combobox не обязан быть только `listbox`. Он может быть:

- `listbox`
- `grid`
- `tree`
- `dialog`

Это значит, что паттерн шире, чем просто "input с выпадающим списком строк".

### 2.2. Что такое autocomplete

`Autocomplete` обычно означает `editable combobox`, где ввод пользователя влияет на набор suggestions.

На практике слово `autocomplete` используется минимум в трех смыслах:

- как синоним `editable combobox`;
- как режим фильтрации options при наборе;
- как inline completion, когда оставшаяся часть подсказки дорисовывается внутри input.

Из-за этого в документации разных библиотек слово `autocomplete` почти всегда уже, чем `combobox`, но шире, чем конкретный autocomplete-mode из APG.

### 2.3. Searchable select

`Searchable select` обычно означает:

- в поле можно печатать;
- список фильтруется;
- финальное значение все равно должно быть одним из options;
- произвольный ввод без выбора не считается валидным committed value.

Это очень частый продуктовый режим между обычным `select` и полным `autocomplete`.

### 2.4. Creatable

`Creatable` означает:

- можно выбрать существующий option;
- можно ввести новое значение, которого в списке пока нет;
- система коммитит это как новый item, tag, entity draft или plain string.

### 2.5. Tags input

`Tags input` это обычно:

- multiple selection;
- editable field;
- создание новых значений;
- токенизация по `Enter`, `Comma`, `Tab`, `Paste`;
- выбранные значения отображаются как `chips/tags`.

Это уже не просто autocomplete, а отдельный product pattern на той же технической базе.

## 3. Что стандартизовано, а что нет

### 3.1. Что реально стандартизовано

Нормативной или полу-нормативной базой здесь является WAI-ARIA APG:

- паттерн `combobox`;
- required roles/states/keyboard behavior;
- distinction between editable and select-only;
- типы autocomplete-поведения;
- допустимые popup roles.

### 3.2. Что не имеет единого стандарта названий

На уровне design systems и UI-библиотек нет одного общепринятого словаря для названий:

- `autocomplete`
- `auto complete`
- `typeahead`
- `autosuggest`
- `search select`
- `searchable dropdown`
- `creatable select`
- `tags`
- `token input`

Это скорее product vocabulary, чем стандарт.

### 3.3. Внутренние классификации библиотек

Некоторые библиотеки и дизайн-системы вводят свои product labels.

Например, у Ant Design есть разделение lookup-сценариев на:

- `Certain Category`
- `Uncertain Category`

Это полезная UX-классификация, но не отраслевой стандарт.

## 4. Стандартная классификация по WAI-ARIA APG

### 4.1. Select-only vs editable

APG различает два базовых типа:

#### Select-only combobox

- пользователь не редактирует строку произвольно;
- value выбирается только из popup;
- по поведению ближе к select, но с combobox semantics.

#### Editable combobox

- пользователь печатает в поле;
- popup помогает выбрать значение;
- введенный текст может либо быть самостоятельным значением, либо служить только поисковым запросом.

### 4.2. Четыре autocomplete-режима из APG

#### 1. `aria-autocomplete="none"`

- popup может открываться и предлагать варианты;
- текст не влияет на selection behavior автоматически;
- это ближе к "editable field with optional suggestions".

#### 2. `list autocomplete with manual selection`

- список suggestions зависит от того, что введено;
- пользователь должен явно выбрать вариант;
- просто blur обычно не должен молча подменять введенный текст.

#### 3. `list autocomplete with automatic selection`

- при открытии/фильтрации один из вариантов уже автоматически активен;
- при некоторых сценариях blur именно он может считаться выбранным.

#### 4. `list with inline autocomplete`

- система показывает completion-tail прямо в input;
- пользователь видит, что будет дописано;
- это самый "typeahead-like" режим.

### 4.3. Тип popup по стандарту

Стандарт допускает:

- `listbox`: самый частый случай;
- `grid`: когда option имеет несколько колонок;
- `tree`: когда структура иерархическая;
- `dialog`: когда popup по сути mini-surface со сложной логикой выбора.

Это важно для архитектуры. Не стоит зашивать паттерн только под плоский список строк.

## 5. Практическая продуктовая классификация

Ниже удобная рабочая таксономия для design system.

### 5.1. Ordinary Select

Что это:

- нет редактируемого input;
- пользователь только выбирает из списка;
- arbitrary value запрещен.

Что покрывает:

- короткие и средние списки;
- стабильные справочники;
- простые формы.

Чего не покрывает:

- быстрый поиск по большому объему;
- создание новых значений;
- remote suggestions;
- rich lookup.

### 5.2. Select-only Combobox

Что это:

- визуально может быть похож на select;
- popup и active descendant управляются как combobox;
- часто используется для accessibility-consistent shell.

Что покрывает:

- случаи, где нужен combobox interaction model без свободного ввода;
- переходный слой между `select` и `editable combobox`.

### 5.3. Searchable Select

Что это:

- пользователь печатает;
- список фильтруется;
- выбрать можно только из существующих options.

Что покрывает:

- большие справочники;
- выбор страны, города, департамента, категории;
- lookup там, где value должен быть строго валидирован against dataset.

Основной контракт:

- `inputValue` и `selectedValue` живут раздельно;
- blur/clear/escape обрабатываются отдельно;
- при submit нужен committed option, а не просто текст.

### 5.4. Free-text Autocomplete

Что это:

- пользователь может оставить собственный текст;
- suggestions только помогают;
- committed value может не совпадать ни с одним option.

Что покрывает:

- поиск по каталогу;
- поле поиска по сайту;
- адресные строки;
- ввод с умными подсказками;
- поиск по сущностям, где необязательно выбирать именно suggestion.

### 5.5. Constrained Autocomplete

Что это:

- пользователь печатает в поле;
- suggestions обновляются;
- итоговое значение должно быть выбрано из списка.

Практически это близко к `searchable select`, но иногда UX более явно строится как input с подсказками, а не как select.

### 5.6. Creatable Select / Creatable Autocomplete

Что это:

- существует список options;
- если подходящего нет, можно создать новый;
- UI показывает affordance вроде `Create "Foo"`.

Что покрывает:

- теги;
- категории;
- ad-hoc labels;
- email recipients;
- сущности, которые пользователь может расширять сам.

Ключевые требования:

- дедупликация;
- валидация новых значений;
- явная модель `existing option` vs `newly created option`;
- контракт сериализации.

### 5.7. Async Autocomplete

Что это:

- suggestions загружаются по мере ввода;
- локального полного набора options может не быть.

Что покрывает:

- users lookup;
- company lookup;
- address search;
- airport/city search;
- SKU/product lookup;
- большие доменные каталоги.

Ключевые требования:

- loading state;
- debounce/throttle;
- race handling;
- min query length;
- empty state;
- error state;
- cache policy;
- pagination или infinite loading.

### 5.8. Multi-select Combobox

Что это:

- из popup можно выбрать несколько значений;
- выбранные элементы обычно рендерятся в самом control как tags/chips.

Что покрывает:

- выбор нескольких пользователей;
- выбор нескольких категорий;
- фильтры;
- audience/segment builder.

Ключевые требования:

- отдельная навигация по tags;
- удаление клавиатурой;
- backspace behavior;
- screen reader announcements;
- overflow/summary UI.

### 5.9. Tags Input

Что это:

- multi-select;
- editable input;
- часто creatable по умолчанию;
- токенизация строк в список значений.

Что покрывает:

- email invite fields;
- labels/tags;
- comma-separated item entry;
- bulk lightweight entity input.

### 5.10. Categorized / Grouped Lookup

Что это:

- suggestions разбиты на секции;
- секции отражают тип сущности или смысловую группу.

Что покрывает:

- глобальный поиск;
- unified search по людям, компаниям, документам;
- сложные ассистивные формы.

Типичные группы:

- recent;
- suggested;
- users;
- teams;
- products;
- locations;
- actions.

### 5.11. Rich-result Combobox

Что это:

- option содержит не только label;
- есть иконка, secondary text, badge, metadata, highlighted match fragments.

Что покрывает:

- entity lookup;
- command launchers;
- admin panels;
- CRM/ERP-heavy forms.

### 5.12. Command Palette

Это соседний, но не идентичный паттерн.

Похоже на combobox:

- есть input;
- есть filtered results;
- есть keyboard selection.

Отличается по смыслу:

- цель не выбрать field value, а выполнить action или навигацию;
- results часто содержат команды, а не data values;
- form semantics здесь вторичны.

В design system лучше не смешивать `field combobox` и `command palette` в один API, даже если low-level primitives совпадают.

## 6. Какие задачи покрывает семейство паттернов

### 6.1. Замена длинного select

Когда список длинный, обычный dropdown становится медленным.

Combobox покрывает:

- быстрый text lookup;
- jump-to-item;
- фильтрацию вместо длинного scroll.

### 6.2. Помощь во вводе

Когда пользователь знает значение не полностью или боится ошибиться.

Combobox покрывает:

- подсказки по мере набора;
- коррекцию орфографии и формата;
- уменьшение числа invalid values.

### 6.3. Поиск по удаленным данным

Когда список большой или динамический.

Combobox покрывает:

- server-side search;
- progressive disclosure;
- paged result sets;
- cached recent results.

### 6.4. Создание нового значения

Когда подходящего значения может не существовать.

Combobox покрывает:

- fallback к созданию;
- guided creation flow;
- подтверждение нового item прямо из поля.

### 6.5. Выбор нескольких значений

Когда one-to-many выбор должен быть компактным.

Combobox покрывает:

- поиск по options;
- показ уже выбранных элементов;
- быстрое удаление;
- tokenized entry.

### 6.6. Сложный lookup по сущностям

Когда option является объектом, а не строкой.

Combobox покрывает:

- rich rendering;
- secondary metadata;
- disambiguation;
- группировку и типизацию результатов.

## 7. Главные оси вариативности

Это наиболее полезная секция для проектирования API.

### 7.1. Editable vs non-editable

- `non-editable`: обычный select-like flow;
- `editable`: input принимает текст и управляет suggestions.

### 7.2. Restricted vs unrestricted value

- `restricted`: value обязан быть одним из options;
- `unrestricted`: value может быть произвольной строкой или объектом, созданным на лету.

### 7.3. Single vs multiple

- `single`
- `multiple`

### 7.4. Local vs remote data

- `local`: все options известны заранее;
- `remote`: нужен async fetch;
- `hybrid`: есть local recent/cache + remote results.

### 7.5. Static vs dynamic filtering

- internal filter внутри компонента;
- controlled external filtering;
- no filtering, только suggestion list.

### 7.6. Simple vs rich option content

- plain text label;
- label + description;
- label + icon + meta;
- grouped sections;
- heterogeneous result rows.

### 7.7. Flat vs hierarchical popup

- `listbox`
- `grid`
- `tree`
- `dialog`

### 7.8. Automatic vs manual selection

- пользователь сам выбирает highlighted item;
- библиотека автоматически активирует первый match;
- blur может или не может коммитить active option.

### 7.9. Open behavior

- open on click;
- open on focus;
- open on input;
- manual trigger button;
- always-open command style.

### 7.10. Commit behavior

- commit on click;
- commit on Enter;
- commit on blur;
- commit on delimiter;
- commit on paste tokenization.

## 8. Полный capability set, который обычно ожидается от зрелого Combobox

Ниже не "обязательный минимум", а полный референсный набор.

### 8.1. Data model

- `value`
- `defaultValue`
- `inputValue`
- `defaultInputValue`
- `options` / `items`
- `optionToLabel`
- `optionToValue`
- `isOptionEqual`
- `getOptionDisabled`
- `groupBy`
- `filterOptions` или controlled search callback

### 8.2. Interaction model

- open / close state;
- highlighted option;
- keyboard navigation;
- mouse and touch selection;
- clear action;
- reset behavior;
- blur handling;
- escape handling;
- open button support.

### 8.3. Editable behavior

- allow free typing;
- select-on-focus;
- auto-highlight;
- auto-select;
- inline completion;
- preserve input on blur;
- replace input with selected label;
- custom parsing/formatting.

### 8.4. Async behavior

- loading;
- debounce;
- cancellation / race safety;
- stale request ignore;
- retry;
- empty results;
- server error;
- incremental loading;
- recent results / caching.

### 8.5. Multiple/tag behavior

- chips/tags rendering;
- remove selected item;
- backspace last tag;
- keyboard focus between tags and input;
- collapsed tag count;
- fixed/locked tags;
- duplicate prevention;
- paste tokenization.

### 8.6. Rendering flexibility

- custom option template;
- custom group header;
- custom empty state;
- loading row;
- create-row affordance;
- footer or action row;
- selected tag renderer.

### 8.7. Overlay behavior

- popper/overlay positioning;
- portal support;
- width sync with trigger;
- scroll parent handling;
- flip and collision logic;
- viewport clipping;
- virtualization compatibility.

### 8.8. Form behavior

- name/value integration;
- validation;
- touched/dirty semantics;
- required state;
- disabled/readOnly;
- clearable vs non-clearable;
- serializable submitted value.

### 8.9. Accessibility

- correct `role="combobox"` semantics;
- `aria-expanded`;
- `aria-controls`;
- `aria-activedescendant` или equivalent focus model;
- correct popup role;
- active option announcements;
- selected state exposure;
- clear label;
- loading/empty announcements;
- full keyboard support from APG;
- IME-safe handling.

## 9. Accessibility contract: что обязательно помнить

### 9.1. Combobox сложнее, чем select

Для `editable combobox` нужно корректно разделить:

- текст в поле;
- текущий active descendant;
- committed selected value;
- popup state.

Если все это хранить одной переменной, почти всегда появляются баги.

### 9.2. Клавиатурная модель

Ключевые сценарии:

- `ArrowDown` / `ArrowUp` перемещают active option;
- `Enter` коммитит active option;
- `Escape` закрывает popup и иногда очищает pending navigation;
- `Tab` переводит фокус дальше, иногда предварительно commit/preserve по режиму;
- `Home` / `End` зависят от текста и popup-модели;
- `Backspace` в multi/tagging режиме может удалять предыдущий token;
- поведение при `IME composition` нельзя ломать.

### 9.3. Почему `input value` и `selected value` нельзя смешивать

Типичные проблемы, если смешать:

- нельзя показать label выбранного объекта и одновременно редактировать query;
- сложно поддержать `manual selection`;
- ломается creatable flow;
- blur начинает неявно затирать пользовательский ввод;
- мультивыбор становится хрупким.

Референсная архитектура почти всегда требует минимум двух независимых состояний:

- `selectedValue`
- `inputValue`

Иногда нужен и третий слой:

- `highlightedOption`

### 9.4. Не все multi-select варианты строго укладываются в APG

Формально классический APG `combobox` ближе к single-value interaction.

Многие библиотеки расширяют этот паттерн и строят `multi combobox` поверх:

- отдельного tag list;
- input внутри того же control;
- listbox popup с multiple semantics.

Это нормальная продуктовая практика, но важно понимать, что здесь уже нужно особенно внимательно проверять accessibility-contract, а не просто копировать термин из спецификации.

## 10. Как это устроено в популярных библиотеках

## 10.1. MUI `Autocomplete`

Ссылка: <https://mui.com/material-ui/react-autocomplete/>

Подход:

- один мощный umbrella-компонент;
- покрывает и `combo box`, и `free solo`, и `multiple`, и async patterns;
- есть headless hook `useAutocomplete`.

Сильные стороны:

- явно разделяет `value` и `inputValue`;
- есть `freeSolo`;
- есть `groupBy`;
- есть `multiple`;
- есть disabled options;
- есть fixed tags;
- есть async examples;
- есть `Creatable` сценарий;
- хороший набор готовых product behaviors.

Компромисс:

- API большой;
- компонент скорее "комбайн", чем маленький primitive;
- при design system уровне часть поведения может оказаться слишком opinionated.

Когда особенно полезен как референс:

- если нужен один компонент, закрывающий почти все mainstream сценарии;
- если важно увидеть, как разделяются input state и selected state;
- если нужен пример зрелой `freeSolo + multiple + async` модели.

## 10.2. Ant Design `AutoComplete`

Ссылка: <https://ant.design/components/auto-complete/>

Подход:

- `AutoComplete` отделен от `Select`;
- акцент на "input с подсказками", а не на select semantics;
- сильнее завязан на text entry.

Сильные стороны:

- понятное позиционирование как lookup-helper;
- есть кастомизация input;
- есть grouped lookup examples;
- хорошо показывает distinction между input-assist и select.

Компромисс:

- полная картина семейства разбита между `AutoComplete` и `Select`;
- для multi/tags/search-select сценариев нужно смотреть соседний компонент.

Когда полезен как референс:

- если нужно отделить "подсказки при вводе" от "выбора из справочника";
- если дизайн-система хочет иметь разные product components, а не один большой super-control.

## 10.3. Ant Design `Select`

Ссылка: <https://ant.design/components/select/>

Подход:

- именно здесь у Ant лежат `showSearch`, `multiple`, `tags`, option groups, remote search;
- по сути это их слой `searchable select` и `creatable-like tags`.

Сильные стороны:

- хорошо покрыт multi-select;
- есть `tags` mode;
- есть grouped options;
- есть search and sort;
- есть remote search patterns.

Компромисс:

- taxonomy размазана между двумя компонентами;
- граница между `AutoComplete` и `Select` не всегда интуитивна для design system authors.

Практический вывод:

- у Ant полезно смотреть не один компонент, а связку `AutoComplete + Select`.

## 10.4. React Aria `ComboBox`

Ссылки:

- <https://react-aria.adobe.com/ComboBox/useComboBox>
- <https://react-aria.adobe.com/ComboBox>

Подход:

- accessibility-first primitives;
- сильное внимание к semantics, keyboard contract и controlled/uncontrolled flows;
- composable API.

Сильные стороны:

- очень аккуратная ARIA-модель;
- sections/grouping;
- validation;
- async loading;
- infinite scroll / large data patterns;
- virtualization compatibility;
- rich form integration.

Особенность:

- React Aria часто показывает более "системную" модель компонента, чем многие готовые UI-kit implementations.

Когда особенно полезен как референс:

- если задача в design system primitive;
- если важнее правильная architecture и accessibility, чем готовый визуальный компонент.

## 10.5. Headless UI `Combobox`

Ссылка: <https://headlessui.com/react/combobox>

Подход:

- headless primitive без готового визуального решения;
- state and semantics с большим уровнем контроля;
- позиционируется и под autocomplete, и под command-style use-cases.

Сильные стороны:

- `multiple`;
- custom values;
- object binding;
- virtual scrolling;
- open on focus-like patterns;
- очень гибкий rendering.

Компромисс:

- filtering и data orchestration остаются на стороне приложения;
- меньше готовых product affordances из коробки.

Когда полезен как референс:

- если нужен гибкий low-level слой;
- если поверх него планируется несколько продуктовых компонентов.

## 10.6. Downshift `useCombobox`

Ссылка: <https://www.downshift-js.com/use-combobox/>

Подход:

- hook-level toolkit;
- максимальный контроль над state machine;
- multi-select строится через сочетание hooks.

Сильные стороны:

- позволяет очень точно собрать кастомное поведение;
- хорошо подходит для design system infra;
- дает доступ к stateReducer-подходу и низкоуровневому контролю.

Компромисс:

- почти ничего не "решает за вас";
- нужна собственная discipline для accessibility и API consistency.

Когда полезен как референс:

- если интересует логика state machine больше, чем готовый компонентный API.

## 10.7. `react-select`

Ссылки:

- <https://react-select-oss.netlify.app/>
- <https://react-select-oss.netlify.app/props>
- <https://react-select-oss.netlify.app/async>
- <https://react-select-oss.netlify.app/creatable>

Подход:

- зрелый product-ready select/combobox control;
- широкая настройка behavior и render layers;
- исторически один из самых популярных вариантов в React-экосистеме.

Сильные стороны:

- async;
- creatable;
- multi;
- groups;
- custom option rendering;
- themeability;
- много battle-tested product scenarios.

Компромисс:

- abstraction большой и местами тяжелый;
- semantics и DX завязаны на собственную модель библиотеки;
- как reference для primitive architecture он менее чистый, чем React Aria или Downshift.

Когда полезен как референс:

- если нужен обзор feature-complete product component;
- если интересует, какие product expectations уже считаются "нормальными".

## 10.8. Native `<datalist>`

Ссылка: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist>

Подход:

- встроенный browser primitive для подсказок input.

Ограничения:

- не заменяет полноценный combobox;
- слабая стилизация;
- ограниченный accessibility и UX control;
- мало пригоден как основа для design system компонента.

Практический вывод:

- рассматривать скорее как исторический/нативный reference, но не как основу современной библиотеки компонентов.

## 11. Сравнение библиотек по паттернам

Ниже high-level матрица.

| Паттерн / возможность | MUI Autocomplete | Ant AutoComplete | Ant Select | React Aria ComboBox | Headless UI Combobox | Downshift | react-select |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Searchable select | Да | Частично | Да | Да | Да | Да | Да |
| Free text | Да (`freeSolo`) | Да | Ограниченно | Да | Да | Да | Да |
| Creatable | Да | Через кастомную логику | `tags`-style | Да, composable | Да | Да | Да |
| Multiple | Да | Нет как основной режим | Да | Есть расширенные варианты | Да | Через composition | Да |
| Tags input | Частично | Нет | Да | Через composition | Да | Через composition | Да |
| Async search | Да | Да | Да | Да | Да | Да | Да |
| Grouping | Да | Да | Да | Да | Да | Да | Да |
| Rich custom option | Да | Да | Да | Да | Да | Да | Да |
| Headless primitive | Да (`useAutocomplete`) | Нет | Нет | Да | Да | Да | Нет |
| A11y as primary design goal | Средне/высоко | Средне | Средне | Очень высоко | Высоко | Высоко | Средне |

Таблица упрощает картину, но не заменяет детального чтения API. Разные библиотеки по-разному трактуют:

- multi-select semantics;
- free text contract;
- create-new flow;
- blur/commit behavior;
- equality model для object values.

## 12. Что обычно не хватает, если сейчас есть только Datepicker shell и обычный Select

Это не аудит текущего кода, а типичный gap-list для подобной стартовой точки.

### 12.1. Separate state model

Обычно первым отсутствует раздельная модель:

- `selectedValue`
- `inputValue`
- `highlightedOption`
- `open`

Без этого сложно поддержать почти любой advanced mode.

### 12.2. Suggestion lifecycle

Нужен отдельный lifecycle для suggestions:

- trigger fetch/filter;
- update active option;
- preserve input;
- commit selection;
- recover after blur/escape.

### 12.3. Editable input contract

Если система выросла из select-like controls, часто еще нет:

- IME-safe input handling;
- caret-preserving updates;
- inline completion strategy;
- distinction between typing and selecting.

### 12.4. Async and loading model

Для реального lookup почти всегда нужен API для:

- loading;
- request cancellation;
- empty result set;
- error;
- min query length;
- debounce.

### 12.5. Grouped and rich options

Обычный select чаще рассчитан на плоский массив label/value.

Для combobox family часто дополнительно нужны:

- sections;
- item metadata;
- custom renderers;
- sticky or semantic group headers.

### 12.6. Free-form and creatable behavior

Если текущий select не допускает arbitrary value, обычно еще нет:

- create-row affordance;
- duplicate detection;
- create validation;
- contract для сериализации created items.

### 12.7. Multi/tagging behavior

Даже если single-select уже зрелый, multi/tagging часто требует нового слоя:

- token list before input;
- keyboard transfer between tags and input;
- remove chip behavior;
- paste tokenization;
- overflow summary.

### 12.8. Accessibility for editable popup fields

`Datepicker` и `select` могут использовать похожую popup-shell архитектуру, но editable combobox добавляет новые обязанности:

- ARIA combobox semantics;
- active descendant announcements;
- synchronization input and popup;
- correct behavior for screen readers during filtering;
- preserving typed text under navigation.

## 13. Рекомендации по naming для design system

Ниже не стандарт, а рекомендуемая практическая схема имен.

### 13.1. Что лучше считать базовым термином

На уровне foundation primitive:

- `Combobox`

Это самое точное и стандарто-совместимое имя для семейства.

### 13.2. Что лучше выделять как отдельные product variants

Если строить public API дизайн-системы, логичное разделение такое:

- `Select`
- `Combobox`
- `Autocomplete`
- `SearchableSelect`
- `CreatableSelect`
- `TagsInput`

Где:

- `Select` = non-editable, restricted choice;
- `Combobox` = базовый editable/selectable primitive;
- `Autocomplete` = unrestricted suggestions-oriented mode;
- `SearchableSelect` = editable search, but committed value must be option;
- `CreatableSelect` = select + create new;
- `TagsInput` = multiple + tokenization + optional creation.

### 13.3. Что не стоит смешивать в одно название

Лучше не называть одним словом `Autocomplete` все подряд, потому что это размывает семантику.

Особенно стоит отдельно держать:

- `Autocomplete` и `SearchableSelect`;
- `Combobox` и `CommandPalette`;
- `Select` и `Creatable`;
- `Single` и `Multiple` режимы.

### 13.4. Возможная иерархия для внутренней архитектуры

Если смотреть с точки зрения low-level primitives, типовая архитектура часто выглядит так:

- `Field` / `Input`
- `Overlay` / `Popup`
- `Listbox`
- `Combobox`
- `Autocomplete`
- `SearchableSelect`
- `TagsInput`

То есть `Combobox` может быть базовым behavioral primitive, а остальные компоненты уже product wrappers.

## 14. Практический reference-модель API

Это не предложение к реализации, а полезный ориентир того, какие сущности почти неизбежно появляются.

### 14.1. Controlled state

- `value`
- `inputValue`
- `open`
- `highlightedKey`

### 14.2. Collections

- `items`
- `groups`
- `disabledKeys`

### 14.3. Behavior flags

- `multiple`
- `freeInput`
- `creatable`
- `async`
- `autoHighlight`
- `autoSelect`
- `clearable`
- `openOnFocus`

### 14.4. Callbacks

- `onInputChange`
- `onSelectionChange`
- `onOpenChange`
- `onHighlightChange`
- `onCreateOption`
- `onLoadMore`

### 14.5. Render customization

- `renderInput`
- `renderOption`
- `renderGroup`
- `renderEmpty`
- `renderLoading`
- `renderCreateAffordance`
- `renderTag`

## 15. На что смотреть при дальнейшем анализе собственной библиотеки

Пока без аудита текущих компонентов, но при следующем шаге логично будет проверить:

- есть ли уже reusable shell для `editable popup field`;
- где хранится active descendant model;
- можно ли отделить `inputValue` от `value` без ломки existing select API;
- есть ли shared collection primitive;
- насколько текущий overlay пригоден для listbox/grid/dialog popup variants;
- как будет выглядеть a11y contract для single и multi режимов;
- где лучше разделить base primitive и product wrappers.

## 16. Итог

`Combobox` это базовый стандартный паттерн. `Autocomplete`, `Searchable Select`, `Creatable`, `Tags Input` и часть lookup/search UI являются его продуктовыми специализациями.

Если смотреть на зрелые библиотеки, то рынок сходится в одном:

- нужен отдельный editable state model;
- нужен popup с активным элементом и keyboard contract;
- нужны раздельные режимы restricted и unrestricted input;
- async, grouping, rich options и multi/tagging являются не экзотикой, а ожидаемыми возможностями семейства.

Для design system разумно считать `Combobox` базовым behavioral primitive, а уже над ним выделять понятные продуктовые варианты с отдельными именами и контрактами.

## Источники

- WAI-ARIA APG Combobox Pattern: <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
- MUI Autocomplete: <https://mui.com/material-ui/react-autocomplete/>
- Ant Design AutoComplete: <https://ant.design/components/auto-complete/>
- Ant Design Select: <https://ant.design/components/select/>
- Ant Design Reaction / Lookup Patterns: <https://ant.design/docs/spec/reaction/>
- React Aria `useComboBox`: <https://react-aria.adobe.com/ComboBox/useComboBox>
- React Aria `ComboBox`: <https://react-aria.adobe.com/ComboBox>
- Headless UI Combobox: <https://headlessui.com/react/combobox>
- Downshift `useCombobox`: <https://www.downshift-js.com/use-combobox/>
- react-select docs: <https://react-select-oss.netlify.app/>
- react-select props: <https://react-select-oss.netlify.app/props>
- react-select async: <https://react-select-oss.netlify.app/async>
- react-select creatable: <https://react-select-oss.netlify.app/creatable>
- MDN `<datalist>`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist>
