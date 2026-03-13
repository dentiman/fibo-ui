# Combobox Family: каталог паттернов для реализации

Актуально на 2026-03-12.

Этот файл дополняет [docs/combobox-autocomplete-patterns.md](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/docs/combobox-autocomplete-patterns.md) и оставляет только те варианты, которые действительно относятся к `combobox family`.

В этом каталоге правило простое:

- `combobox` всегда предполагает editable surface;
- editable surface это `input` или `textarea`;
- `select` без `input` в этот каталог не входит.

## 1. Что считать combobox в рамках нашей библиотеки

В рамках `fibo-ui` combobox-паттерн должен иметь:

- поле ввода как основной trigger;
- popup, который помогает выбрать, уточнить или создать значение;
- раздельные состояния минимум для `inputValue`, `selectedValue`, `highlightedItem`, `open`.

Если контроля ввода нет и пользователь только открывает dropdown и выбирает option, это:

- `Select`;
- не `Combobox`;
- вне этого каталога.

## 2. Что уже есть в проекте как база

### 2.1. Что можно взять из `DatePicker`

`DatePicker` полезен как shell для editable popup-field:

- `input + popover`;
- ручной ввод и popup в одном контроле;
- popup может быть не только `listbox`, но и более богатым surface;
- есть близкая ментальная модель: пользователь печатает и может выбрать значение из popup.

### 2.2. Что можно взять из `Select`

Хотя сам `Select` сюда не входит как паттерн, из него все равно полезны примитивы:

- `DataList`;
- `DataListItem`;
- single/multi selection model;
- listbox navigation;
- popup list rendering.

### 2.3. Архитектурный вывод

Практически все combobox-варианты у нас должны строиться так:

- shell и editable trigger берем из `DatePicker`;
- popup collection и selection primitives берем из `Select`;
- сверху вводим новый общий primitive уровня `ComboboxField`.

## 3. Категории combobox-паттернов

### 3.1. Категория A. Restricted combobox

Пользователь печатает, но committed value обязан быть одним из options.

### 3.2. Категория B. Unrestricted combobox

Пользователь печатает и может закоммитить произвольный ввод.

### 3.3. Категория C. Extended combobox

Поверх restricted/unrestricted режимов добавляются async, create, multi, tags, rich lookup, dialog popup.

## 4. Нумерованный каталог

Ниже канонический список номеров, по которым дальше можно ставить задачу.

### 1. Searchable Select, manual selection

Категория: `A. Restricted combobox`

Что это:

- пользователь печатает в `input`;
- список фильтруется;
- committed value обязано быть option из коллекции;
- введенный текст без выбора не считается финальным значением.

Явный сценарий:

- выбор пользователя из длинного справочника;
- поиск города, отдела, категории;
- любой select, который стал слишком большим для обычного dropdown.

На какой заготовке строить:

- `input` shell от `DatePicker`;
- listbox/navigation от `Select`.

Чего не хватает:

- `inputValue` отдельно от `selectedValue`;
- фильтрация;
- highlighted option;
- commit/revert политика на blur и escape.

### 2. Searchable Select, auto-highlight

Категория: `A. Restricted combobox`

Что это:

- как паттерн №1;
- первый подходящий option автоматически становится активным;
- `Enter` обычно коммитит активный вариант.

Явный сценарий:

- power-user формы;
- быстрый lookup, где в большинстве случаев выбирают первый матч.

На какой заготовке строить:

- тот же base, что у паттерна №1.

Чего не хватает:

- автоматический highlight при фильтрации;
- синхронизация active item и typed text;
- формализованный auto-select contract.

### 3. Inline Autocomplete / Typeahead

Категория: `A. Restricted combobox`

Что это:

- система дописывает completion прямо в `input`;
- popup остается вспомогательным;
- итоговое значение все еще должно быть выбрано из options.

Явный сценарий:

- страны, коды, языки, аэропорты;
- высокочастотные короткие lookup-поля.

На какой заготовке строить:

- базово на `DatePicker` shell;
- popup-подсказки взять из `Select`.

Чего не хватает:

- caret-safe inline completion;
- выделение completion tail;
- явное разделение typed fragment и accepted completion.

### 4. Free-text Autocomplete

Категория: `B. Unrestricted combobox`

Что это:

- suggestions помогают, но не обязательны;
- пользователь может оставить собственный текст;
- committed value не обязано совпадать с option.

Явный сценарий:

- поле "Компания";
- поле "Адрес";
- слабоструктурированные текстовые поля с подсказками.

На какой заготовке строить:

- на `DatePicker` shell.

Чего не хватает:

- свободный commit текста;
- разделение draft и committed value;
- валидационный контракт для free text.

### 5. Async Autocomplete / Remote Search

Категория: `B. Unrestricted combobox`

Что это:

- suggestions приходят с сервера;
- popup меняется по мере ввода;
- есть loading, empty и error states.

Явный сценарий:

- поиск пользователя, компании, товара, контрагента;
- lookup по большим удаленным данным.

На какой заготовке строить:

- shell от `DatePicker`;
- popup list primitives от `Select`.

Чего не хватает:

- debounce;
- cancelation;
- защита от race conditions;
- loading/error/empty состояния;
- min query length.

### 6. Creatable Select

Категория: `C. Extended combobox`

Что это:

- пользователь ищет среди existing options;
- если option не найден, можно создать новый;
- итогом обычно становится структурированная сущность, а не просто text value.

Явный сценарий:

- выбрать существующий тег или создать новый;
- выбрать категорию или добавить новую.

На какой заготовке строить:

- `input` shell от `DatePicker`;
- restricted selection behavior от `Select`.

Чего не хватает:

- create row в popup;
- duplicate detection;
- create confirmation;
- value contract для created item.

### 7. Creatable Autocomplete

Категория: `C. Extended combobox`

Что это:

- autocomplete плюс возможность коммитить новое значение;
- можно выбрать existing option или сохранить собственный ввод.

Явный сценарий:

- бренд, email, label, свободно расширяемый справочник.

На какой заготовке строить:

- на `DatePicker` shell.

Чего не хватает:

- create affordance;
- модель `option | created value`;
- enter/blur policy для create flow.

### 8. Multi Searchable Select

Категория: `C. Extended combobox`

Что это:

- несколько значений;
- есть `input` для фильтрации options;
- committed values допускаются только из списка.

Явный сценарий:

- выбор пользователей, навыков, тегов, отделов;
- большие multi-select справочники.

На какой заготовке строить:

- chips и multiple selection взять из `MultiSelect`;
- editable shell взять из `DatePicker`;
- listbox/navigation взять из `Select`.

Чего не хватает:

- coexistence `chips + input + popup`;
- навигация между chips и input;
- фильтрация невыбранных items;
- multi-combobox a11y contract.

### 9. Tags Input / Tokenizing Combobox

Категория: `C. Extended combobox`

Что это:

- multiple selection;
- editable `input` или `textarea`;
- можно создавать новые tokens;
- токенизация по `Enter`, `Comma`, `Tab`, `Paste`.

Явный сценарий:

- recipients;
- labels;
- keywords;
- whitelist/blacklist значения.

На какой заготовке строить:

- hybrid на базе `MultiSelect` и `DatePicker`.

Чего не хватает:

- tokenization rules;
- paste parsing;
- backspace-to-remove;
- модель `selected options + created tokens`.

### 10. Grouped Searchable Select

Категория: `C. Extended combobox`

Что это:

- searchable select с группами или секциями;
- popup остается listbox-like, но коллекция уже не плоская.

Явный сценарий:

- люди по департаментам;
- элементы по типам;
- сущности по категориям.

На какой заготовке строить:

- base от паттерна №1;
- сверху richer collection model.

Чего не хватает:

- groups;
- headers;
- keyboard traversal по grouped collection;
- richer render API.

### 11. Rich Lookup / Result Panel Combobox

Категория: `C. Extended combobox`

Что это:

- popup содержит не просто строки, а richer result rows;
- у option могут быть avatar, secondary text, badges, metadata;
- popup может быть ближе к panel или grid.

Явный сценарий:

- поиск пользователя с email и ролью;
- поиск компании с адресом и статусом;
- entity lookup в admin UI.

На какой заготовке строить:

- `input` shell от `DatePicker`;
- popup primitives частично от `Select`, но в более общем контейнере.

Чего не хватает:

- rich item renderer;
- panel/grid semantics;
- metadata layout;
- общий selection contract для richer rows.

### 12. Dialog-based Picker Combobox

Категория: `C. Extended combobox`

Что это:

- popup уже не dropdown, а mini-dialog;
- внутри могут быть поиск, фильтры, таблица, дерево, пресеты;
- значение потом коммитится обратно в field.

Явный сценарий:

- people picker;
- location picker;
- entity picker;
- сложный date/time/entity chooser.

На какой заготовке строить:

- ближе всего к `DatePicker`, потому что он уже задает модель `input + popup surface`.

Чего не хватает:

- dialog contract;
- временное и committed selection state;
- apply/cancel flow;
- более сложная внутренняя навигация.

## 5. Что делать с `textarea`

Для большинства классических combobox-паттернов основным trigger является `input`.

`textarea` имеет смысл только для специальных сценариев:

- mentions;
- command-style assistants;
- tokenizing input c многострочным вводом;
- composer fields с suggestions.

Практически для нашей библиотеки это значит:

- сначала стоит проектировать общий primitive под `input`;
- поддержку `textarea` лучше добавлять как расширение того же combobox state model;
- из каталога выше напрямую к `textarea` ближе всего паттерн `№9 Tags Input / Tokenizing Combobox`.

## 6. Что находится вне этого каталога

Сюда намеренно не входят:

- `Ordinary Select`;
- `Select-only Combobox`;
- `Multi Select` без текстового ввода;
- любой dropdown, где нет editable field.

Это отдельное семейство `Select`, а не `Combobox`.

## 7. Что почти неизбежно нужно для большинства номеров

Если реализовывать любой из паттернов `№1-12`, почти наверняка понадобятся:

- `inputValue`;
- `selectedValue`;
- `highlightedItem`;
- `open`;
- `filteredItems` или `suggestions`;
- `onInput`;
- `onCommit`;
- `onCancel`;
- `empty/loading/error` состояния;
- ARIA contract для editable combobox.

## 8. Практический старт

Если нужен первый минимальный и классический combobox для библиотеки, лучший старт:

1. `№1 Searchable Select, manual selection`
2. `№4 Free-text Autocomplete`
3. `№6 Creatable Select` или `№8 Multi Searchable Select`

Такой порядок дает сначала базовый editable combobox, потом unrestricted mode, потом расширенные product patterns.
