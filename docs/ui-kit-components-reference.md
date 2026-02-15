---
title: Fibo UI Components Reference
description: Полный справочник по компонентам, директивам, сервисам и типам пакета @fibo-ui/components.
package: '@fibo-ui/components'
status: draft
last_updated: 2026-02-14
---

# @fibo-ui/components: полный API

Документ покрывает **публичный API из `projects/fibo-ui/components/src/public-api.ts`**.

## 1. Form Controls

## 1.1. `FormFieldControl`

- kind: component
- selector: `fibo-form-field-control,button[fiboFormFieldControl]`
- standalone: `true`
- роль: универсальная визуальная оболочка поля (label, icons, clear).
- inputs/models:
1. `id = input<string>('')`
2. `value = model<unknown>()`
3. `required = input(false)`
4. `disabled = input(false)`
5. `touched = model(false)`
6. `invalid = input(false)`
7. `dirty = input(false)`
8. `errors = input<ValidationError[]>([])`
9. `label = input<string>('')`
10. `iconStart = input<string>('')`
11. `iconEnd = input<string>('')`
12. `clearValue = input<unknown>(undefined)`
- computed:
1. `hasError = invalid && touched`
2. `canClear = clearValue !== undefined && value !== clearValue`
- methods:
1. `clear()`

## 1.2. `TextField`

- kind: component
- selector: `fibo-text-field`
- standalone: `true`
- implements: `FormValueControl<string>`
- built on: `FormFieldControl`
- inputs/models:
1. `id = signal('fibo-text-field-${n}')`
2. `value = model<string>('')`
3. `type = input<string>('text')`
4. `required = input(false)`
5. `disabled = input(false)`
6. `touched = model(false)`
7. `invalid = input(false)`
8. `dirty = input(false)`
9. `errors = input<ValidationError[]>([])`
10. `label = input<string>('')`
11. `placeholder = input<string>('')`
12. `iconStart = input<string>('')`
13. `iconEnd = input<string>('')`
- methods:
1. `onInput(event)`
2. `onBlur()`

## 1.3. `DatePickerField`

- kind: component
- selector: `fibo-datepicker`
- standalone: `true`
- implements: `FormValueControl<string>`
- built on: `FormFieldControl` + `Calendar` + CDK popover stack
- imports/use:
1. `Popover`, `PopoverTriggerClick`, `PortalContent`, `SelectDate`
- inputs/models:
1. `id = signal('fibo-datepicker-field-${n}')`
2. `value = model<string>('')`
3. `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`
4. `label = input<string>('')`
5. `placeholder = input<string>('')`
6. `iconStart = input<string>('')`
- methods:
1. `onInput(event)`
2. `onBlur()`

## 1.4. `SelectItem` (interface)

- `label: string`
- `value: string | number | null`

## 1.5. `Select`

- kind: component
- selector: `fibo-select`
- implements: `FormValueControl<string | number | null>`
- hostDirectives: `PopoverTrigger`
- composition:
1. `FormFieldControl`
2. `*fiboPortalContent`
3. `fiboPopover`
4. `fiboDataList`
5. `fiboSelectOne`
6. `fiboOption`
- inputs/models:
1. `value = model<string | number | null>(null)`
2. `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`
3. `items = input<SelectItem[]>([])`
4. `label = input<string>('')`
5. `placeholder = input<string>('Select')`
6. `clearValue = input<string | number | null | undefined>(undefined)`
- computed:
1. `selectedLabel`

## 1.6. `MultiSelect`

- kind: component
- selector: `fibo-multi-select`
- implements: `FormValueControl<(string | number)[] | null>`
- hostDirectives: `PopoverTrigger`
- composition: как `Select`, но с `fiboSelectMulti` и checkbox-item UI.
- inputs/models:
1. `value = model<(string | number)[] | null>(null)`
2. `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`
3. `items = input<SelectItem[]>([])`
4. `label = input<string>('')`
5. `placeholder = input<string>('Select')`
- computed:
1. `selectedItems`
- methods:
1. `removeItem(val)`

## 1.7. `Checkbox`

- kind: component
- selector: `fibo-checkbox`
- implements: `FormCheckboxControl`
- inputs/models:
1. `checked = model<boolean>(false)`
2. `indeterminate = input(false)`
3. `readonly = input(false)`
4. `disabled = input<boolean>(false)`
5. `touched = model<boolean>(false)`
- methods:
1. `onInputChange(event)`
2. `onBlur()`

## 1.8. `Switch`

- kind: component
- selector: `fibo-switch`
- implements: `FormCheckboxControl`
- imports: `LoadingSpin`
- inputs/models:
1. `checked = model<boolean>(false)`
2. `isLoading = input(false)`
3. `size = input<'xs'|'sm'|'md'|'lg'|'xl'>('md')`
4. `disabled = input<boolean>(false)`
5. `touched = model<boolean>(false)`
- computed:
1. `trackSize`
2. `thumbSize`
3. `checkedTranslate`
- methods:
1. `onInputChange(event)`
2. `onBlur()`

## 1.9. `Calendar`

- kind: component
- selector: `fibo-calendar`
- standalone: `true`
- hostDirectives: `DataList` (output `optionTriggered`)
- dependencies:
1. `SELECTION_MODEL` (must be provided by `fiboSelectDate` or `fiboSelectDateRange`)
2. internal state: `ActiveMonth`
- inputs:
1. `minDate = input<string | null>(null)`
2. `maxDate = input<string | null>(null)`
- methods:
1. `dayLabel(date: string)`

## 2. Overlay and Feedback

## 2.1. Dialog

### `DialogService`

- kind: service, providedIn `root`
- state:
1. `content = signal<TemplateRef<unknown> | null>(null)`
2. `isOpen = computed(() => !!content())`
- methods:
1. `open(content)`
2. `close()`

### `DialogTrigger`

- kind: directive
- selector: `[fiboDialogTrigger]`
- exportAs: `FiboDialogTrigger`
- inputs:
1. `content = input.required<TemplateRef<unknown>>({ alias: 'fiboDialogTrigger' })`
- host:
1. `(click) => open()`
- methods:
1. `open()`

### `FiboDialog`

- kind: component
- selector: `fibo-dialog`
- role: root renderer модального окна
- dependency: `DialogService`

## 2.2. Drawer

### `DrawerService`

- kind: service, providedIn `root`
- state:
1. `content = signal<TemplateRef<unknown> | null>(null)`
2. `isOpen = computed(() => !!content())`
- methods:
1. `open(content)`
2. `close()`

### `DrawerTrigger`

- kind: directive
- selector: `[fiboDrawerTrigger]`
- exportAs: `FiboDrawerTrigger`
- inputs:
1. `content = input.required<TemplateRef<unknown>>({ alias: 'fiboDrawerTrigger' })`
- host:
1. `(click) => open()`
- methods:
1. `open()`

### `FiboDrawer`

- kind: component
- selector: `fibo-drawer`
- role: root renderer right-side drawer
- dependency: `DrawerService`

## 2.3. Confirmation

### `ConfirmationContent` (type)

```ts
{
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
} | TemplateRef<unknown>
```

### `ConfirmationConfig` (interface)

- `content?: ConfirmationContent | null`
- `onConfirm: () => void`

### `ConfirmationService`

- kind: service, providedIn `root`
- state:
1. `config = signal<ConfirmationConfig | null>(null)`
2. `isOpen = computed(() => !!config())`
- methods:
1. `open(config)`
2. `confirm()`
3. `cancel()`
4. `close()`

### `ConfirmationTrigger`

- kind: directive
- selector: `[confirm]`
- exportAs: `FiboConfirmationTrigger`
- inputs/outputs:
1. `content = input<ConfirmationContent | null>(null, { alias: 'fiboConfirmationContent' })`
2. `confirm = output<void>()`
- host:
1. `(click) => open()`
- methods:
1. `open()`

### `FiboConfirmation`

- kind: component
- selector: `fibo-confirmation`
- role: root renderer confirm modal
- dependency: `ConfirmationService`
- computed:
1. `content` (merge defaults + config)
2. `template` (custom template или `#defaultContent`)

## 2.4. Notification

### `NotificationType` (type)

- `'info' | 'success' | 'warning' | 'danger'`

### `NotificationConfig` (interface)

- `type?: NotificationType`
- `message?: string`
- `title?: string`
- `template?: TemplateRef<unknown>`
- `duration?: number` (seconds)
- `id?: symbol` (internal)

### `Notifier`

- kind: service, providedIn `root`
- state:
1. `notifications = signal<NotificationConfig[]>([])`
- methods:
1. `push(config)`
2. `removeNotification(notification)`
3. `success(message, duration?)`
4. `error(message, duration?)`
5. `warning(message, duration?)`
6. `info(message, duration?)`
- notes:
1. default duration: `5` seconds
2. `duration=0` отключает auto-dismiss

### `Notification`

- kind: component
- selector: `fibo-notification`
- role: root toast renderer
- dependency: `Notifier`
- method:
1. `removeNotification(notification)`

## 2.5. Tooltip

### `TooltipService`

- kind: service, providedIn `root`
- state:
1. `tooltipRef = signal<{ content; referenceElement; placement } | null>`
2. `openDelay = signal<number>(100)`
3. `closeDelay = signal<number>(100)`
- methods:
1. `open(content, referenceElement, placement)`
2. `keepOpen()`
3. `close()`

### `Tooltip`

- kind: directive
- selector: `[fiboTooltip]`
- standalone: `true`
- inputs:
1. `content = input.required<string | TemplateRef<any>>({ alias: 'fiboTooltip' })`
2. `placement = input<Placement>('top')`
- host:
1. `(mouseenter) => open()`
2. `(mouseleave) => close()`
- methods:
1. `open()`
2. `close()`

### `TooltipContainer`

- kind: component
- selector: `fibo-tooltip-container`
- role: root renderer tooltip
- imports: CDK `PopoverPosition`, `PopoverArrow`
- computed:
1. `content` (string)
2. `templateRef` (`TemplateRef`)

## 3. Menu and Navigation

## 3.1. `MenuItemType` (type)

```ts
{
  label: string;
  url?: string;
  icon?: any;
  badge?: string | number;
  children?: MenuItemType[];
  disabled?: boolean;
  content?: TemplateRef<any>;
  callback?: () => void;
  value?: any;
}
```

## 3.2. `Menu`

- kind: component
- selector: `fibo-menu`
- standalone: `true`
- hostDirectives:
1. `MenuPanel`
2. `Popover` (input `trigger`)
- inputs:
1. `items = input<MenuItemType[]>()`
2. `menuContent = input<TemplateRef<any>>()`
- outputs:
1. `closeParent = output<void>()`
- dependencies:
1. `DataList`
2. `Popover`
- computed:
1. `itemsHaveIcons`
- methods:
1. `closeMenuWithParent()`
2. `focusToTrigger(event)`

## 3.3. `MenuItem`

- kind: directive
- selector: `[fiboMenuItem]`
- standalone: `true`
- hostDirectives:
1. `Option` (forwarded `disabled`, `itemTrigger`)
- host behavior:
1. class `menu-item`
2. `(itemTrigger) => menu.closeMenuWithParent()`

## 3.4. `MenuPanel`

- kind: directive
- selector: `[fiboMenuPanel]`
- hostDirectives:
1. `DataList` (input `trigger`)
- role:
1. координация nested submenu (close/open при смене active option)
- internals:
1. `popoverSubmenuItems = signal<PopoverSubmenuTrigger[]>([])`

## 3.5. `TreeMenu`

- kind: component
- selector: `fibo-tree-menu`
- inputs:
1. `items = input<MenuItemType[]>([])`
2. `menuContent = input<TemplateRef<any>>()`
3. `level = input<number>(0)`
4. `removeChainFromLevel = input<number | null>(null)`
- optional dependency:
1. `selectionModel = inject(SELECTION_MODEL, optional)`
- lifecycle:
1. `ngOnInit()` подписка на router events
- methods:
1. `updateActiveStates()` (private)
2. `findActiveUrlItem(item)` (private)

## 3.6. `TreeMenuChain`

- kind: component
- selector: `fibo-tree-menu-chain`
- inputs:
1. `index = input<number>(0)`
2. `isGroup = input<boolean>(false)`
3. `isActive = input<boolean>(false)`
4. `collapsable = input<boolean>(false)`
5. `collapsed = input<boolean>(false)`
6. `totalItems = input<number>(0)`

## 3.7. `SideMenuGroup`

- kind: component
- selector: `side-menu-group`
- inputs/models:
1. `label = input('')`
2. `icon = input('')`
3. `expanded = model(true)`
- computed:
1. `level` (вложенность)
- lifecycle:
1. `ngAfterContentInit()` (авто-expansion если есть активный `SideMenuItem`)
- methods:
1. `toggle()`

## 3.8. `SideMenuItem`

- kind: component
- selector: `side-menu-item`
- inputs:
1. `icon = input('')`
2. `url = input('')`
- signals:
1. `active = signal(false)`
2. `isNested = computed(...)`
- lifecycle:
1. `ngOnInit()` + router subscription
- methods:
1. `updateActive()` (private)

## 4. Data Display

## 4.1. `LoadingSpin`

- kind: component
- selector: `fibo-loading-spin`
- standalone: `true`
- input:
1. `strokeWidth = input(4)`

## 4.2. `Listbox<T>`

- kind: component
- selector: `fibo-listbox`
- standalone: `true`
- hostDirectives:
1. `DataList` (inputs: `disabled`, `trigger`; outputs: `optionTriggered`)
- required dependency:
1. `SELECTION_MODEL` (single or multi)
- inputs:
1. `disabled = input(false)`
2. `items = input<T[]>([])`
3. `itemTemplate = input<TemplateRef<any> | undefined>(undefined)`
4. `valueProp = input<keyof T>('value')`
5. `labelProp = input<keyof T>('label')`
- API:
1. `isMultiple` (getter)
2. `getValue(item)`
3. `getLabel(item)`
4. `isSelected(item)`

## 4.3. `Table<T>`

- kind: component
- selector: `fibo-table`
- standalone: `true`
- optional dependency:
1. `SELECTION_MODEL` (для multi-select чекбокса нужен `SelectMulti`)
- inputs/models:
1. `dataSource = input<T[]>([])`
2. `sort = model<{ sortBy: string; sortOrder: string } | null>(null, { alias: 'sort' })`
- content projection:
1. `columns = contentChildren(FiboColumn)`
- computed:
1. `rows`
2. `allSelected`
3. `isIndeterminate`
- methods:
1. `toggleAll(next)`
2. `isSortedBy(key)`
3. `getSortOrderFor(key)`
4. `onHeaderClick(key)` (asc -> desc -> null)
5. `getCellValue(row, key)`

## 5. Внутренние (непубличные) сущности

Не экспортируются через `public-api.ts`, но важны для поддержки:

1. `PopoverSubmenuTrigger` — внутренний trigger nested submenu.
2. `CollapseSubmenuItem` — раскрытие/сворачивание subtree в `TreeMenu`.
3. `ActiveMonth` — календарное состояние для `Calendar`.
4. `CalendarCell` — неиспользуемая заготовка.

## 6. Проверка полноты документа

Справочник покрывает все exports из:

1. `projects/fibo-ui/components/src/public-api.ts`

