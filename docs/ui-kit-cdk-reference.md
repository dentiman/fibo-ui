---
title: Fibo UI CDK Reference
description: Полный справочник по директивам, pipe, сервисам, типам и утилитам пакета @fibo-ui/cdk.
package: '@fibo-ui/cdk'
status: draft
last_updated: 2026-02-14
---

# @fibo-ui/cdk: полный API

Документ описывает **публичный API из `projects/fibo-ui/cdk/src/public-api.ts`**.

## 1. Common

## 1.1. `IsEmptyPipe`

- kind: pipe
- name: `isEmpty`
- standalone: `true`
- input: `unknown`
- output: `boolean`
- behavior:
1. `true` для `null`.
2. `true` для пустой строки `''`.
3. `true` для пустого массива `[]`.
4. Иначе `false`.

## 1.2. `RandomId`

- kind: directive
- selector: `[fiboRandomId]`
- exportAs: `RandomId`
- standalone: `true`
- host bindings:
1. `[attr.id] = id`
- public API:
1. `id: string` — генерируется один раз (`id-${random}`).

## 2. Form helpers

## 2.1. `FormErrorOptions` (interface)

- `showOnlyFirst?: boolean`

## 2.2. `FormErrorService`

- kind: service
- providedIn: `root`
- назначение: централизованная генерация сообщений валидации для `AbstractControl`.
- ключевые методы:
1. `getErrorMessage(errorKey, errorValue?) => string`
2. `getErrorMessages(control, options?) => string[]`
3. `getFirstErrorMessage(control) => string | null`
4. `shouldShowError(control) => boolean` (`invalid && (dirty || touched)`)
5. `getDisplayableErrorMessages(control, options?) => string[]`
6. `getFirstDisplayableErrorMessage(control) => string | null`
7. `getAvailableErrorKeys() => string[]`
- встроенные ключи: `required`, `email`, `minlength`, `maxlength`, `min`, `max`, `pattern`, `requiredTrue`, + расширенный набор прикладных ключей.

## 2.3. `FormErrorPipe`

- kind: pipe
- name: `formError`
- standalone: `true`
- pure: `false`
- transform: `(control, options?) => string[]`
- behavior: возвращает displayable ошибки через `FormErrorService`.

## 2.4. `FirstFormErrorPipe`

- kind: pipe
- name: `firstFormError`
- standalone: `true`
- pure: `false`
- transform: `(control) => string | null`

## 2.5. `HasFormErrorPipe`

- kind: pipe
- name: `hasFormError`
- standalone: `true`
- pure: `false`
- transform: `(control) => boolean`

## 2.6. `FiboInput`

- kind: directive
- selector: `[fiboInput]`
- host behavior:
1. добавляет CSS-класс `fibo-input`.
- public API:
1. `element: ElementRef`

## 2.7. `FormFieldDirective`

- kind: directive
- selector: `[fiboFormField]`
- назначение: bridge между контейнером поля и `@angular/forms/signals` field state.
- host bindings:
1. `[attr.aria-disabled] = disabled() || null`
2. `[attr.aria-required] = required() || null`
3. `[attr.data-error] = invalid() && touched() || null`
- computed API:
1. `required`, `invalid`, `touched`, `dirty`, `disabled`, `readonly`, `pending`, `errors`
- источник state: `contentChild(FORM_FIELD)`.

## 2.8. `FormFieldTrigger`

- kind: directive
- selector: `button[fiboFormFieldTrigger]`
- standalone: `true`
- hostDirectives: `PopoverTrigger`
- host behavior:
1. `type="button"`
2. aria/data флаги для invalid/disabled/required
3. `(keydown.enter) => popoverTrigger.open()`
4. `(keydown.escape) => popoverTrigger.close()`
5. `(click) => popoverTrigger.toggle()`
- signal-form API:
1. `value = model<unknown>()`
2. `required = input(false)`
3. `disabled = input(false)`
4. `touched = input(false)`
5. `invalid = input(false)`
6. `dirty = input(false)`
7. `errors = input<ValidationError[]>([])`

## 3. Utility

## 3.1. `safeProp<T>()`

```ts
safeProp<T>(value: T | null | undefined, propName: keyof any, fallback?: any): any
```

- behavior:
1. если `value` — `string|number`, возвращает сам `value`.
2. если `value` объект и содержит `propName`, возвращает `value[propName]`.
3. иначе возвращает `fallback`.

## 4. Data List primitives

## 4.1. `DATA_LIST`

- kind: `InjectionToken<DataList>`

## 4.2. `DataList`

- kind: directive
- selector: `[fiboDataList]`
- exportAs: `DataList`
- standalone: `true`
- inputs:
1. `disabled: boolean = false`
2. `trigger?: PopoverTrigger`
- outputs:
1. `optionTriggered: Event`
- models/signals:
1. `options = model<Option[]>([])`
2. `activeOption = readonly signal<Option | null>`
3. `id: string` (`data-list-${counter}`)
- host events:
1. `(mouseleave) => resetActiveOption()`
2. `(keydown) => onKeydown($event)`
- ключевые методы:
1. `registerOption(option)` / `unregisterOption(option)`
2. `setActiveOption(option | null)`
3. `findNextOption(current)` / `findPreviousOption(current)`
4. `navigateNext(event)` / `navigatePrev(event)`
5. `onKeydown(event)`:
- `ArrowDown/ArrowUp` навигация
- `Enter` — trigger active option
- `Escape` — возврат focus к trigger + close
6. `resetActiveOption()`

## 4.3. `Option<T>`

- kind: directive
- selector: `[fiboOption]`
- exportAs: `Option`
- standalone: `true`
- dependencies:
1. `DataList` (required)
2. `SELECTION_MODEL` (optional)
- inputs:
1. `disabled: boolean = false`
2. `value: T | undefined = undefined`
- outputs:
1. `itemTrigger: Event`
- computed API:
1. `isActive: Signal<boolean>`
2. `isSelected: Signal<boolean>`
3. `isMultiple: boolean` (`selectionModel instanceof SelectMulti`)
- host bindings/events:
1. `aria-disabled`, `aria-selected`, `data-active`, `data-multiple`
2. `(mouseenter) => setActive()`
3. `(click) => triggerSelection($event)`
4. `tabindex=-1`
- lifecycle:
1. `ngOnInit`: register in `DataList`
2. `ngOnDestroy`: unregister

## 4.4. `SelectionModel<T>` (interface)

- `value: Signal<unknown>`
- `select(value: T): void`
- `isSelected(value: T): boolean`
- `lastSelection: Signal<T | null>`

## 4.5. `CompareFn<T>`

```ts
type CompareFn<T> = (a: T, b: T) => boolean
```

## 4.6. `SELECTION_MODEL`

- kind: `InjectionToken<SelectionModel<any>>`

## 4.7. `SelectOne<T>`

- kind: directive
- selector: `[fiboSelectOne]`
- standalone: `true`
- provider: `{ provide: SELECTION_MODEL, useExisting: SelectOne }`
- API:
1. `value = model<T | null>(null)`
2. `selectionChange = output<T>()` (в текущей реализации не эмитится)
3. `compareFn = input((a, b) => a === b)`
4. `select(value)`
5. `isSelected(value)`
6. `lastSelection = computed(() => value())`

## 4.8. `SelectMulti<T>`

- kind: directive
- selector: `[fiboSelectMulti]`
- standalone: `true`
- provider: `{ provide: SELECTION_MODEL, useExisting: SelectMulti }`
- API:
1. `value = model<T[] | null>(null)`
2. `compareFn = input((a, b) => a === b)`
3. `select(value)` — toggle add/remove
4. `isSelected(value)`
5. `lastSelection = linkedSignal(() => last item | null)`

## 5. Table primitives

## 5.1. `FiboColumnContext<T, K>`

```ts
type FiboColumnContext<T, K extends keyof T> = {
  $implicit: T;
  value: T[K];
  key: K;
}
```

## 5.2. `FiboColumn<T, K>`

- kind: directive
- selector: `ng-template[fiboColumn]`
- structural usage: `*fiboColumn="'field'; header: '...'; source: rows"`
- inputs:
1. `fiboColumn` (required): `K`
2. `fiboColumnHeader: string = ''`
3. `fiboColumnThClass: string = ''`
4. `fiboColumnTdClass: string = ''`
5. `fiboColumnIsSortable: boolean = false`
6. `fiboColumnSource: readonly T[] | T[] = []`
- API:
1. `templateRef: TemplateRef<FiboColumnContext<T, K>>`
2. `static ngTemplateContextGuard(...)`

## 5.3. `FiboColumnHeader`

- kind: directive
- selector: `ng-template[fiboColumnHeader]`
- input:
1. `fiboColumnHeader` (required): `string`
- API:
1. `templateRef: TemplateRef<unknown>`

## 5.4. `FiboTableRow<T>`

- kind: directive
- selector: `[fiboTableRow]`
- API:
1. `templateRef: TemplateRef<unknown>`
2. `columns(): readonly FiboColumn<T, keyof T>[]`

## 6. Popover primitives

## 6.1. `PopoverTrigger`

- kind: directive
- selector: `[fiboPopoverTrigger]`
- exportAs: `PopoverTrigger`
- standalone: `true`
- state:
1. `isOpen = signal(false)`
2. `popover = signal<Popover | null>(null)`
3. `element: HTMLElement`
4. `isListItem: boolean` (если директива стоит на `Option`)
- host:
1. `[attr.aria-expanded] = isOpen() || null`
2. `(keydown) => onKeydown($event)`
3. `(focusout) => onFocusOut($event)`
- methods:
1. `toggle()`, `open()`, `close()`
2. `onKeydown(event)` делегирует в `popover.dataList.onKeydown` (кроме list item)
3. `onFocusOut(event)` закрывает поповер, если фокус ушел вне trigger/popover.

## 6.2. `PopoverTriggerClick`

- kind: directive
- selector: `[fiboPopoverTriggerClick]`
- hostDirectives: `PopoverTrigger`
- host events:
1. `(keydown.enter) => open()`
2. `(keydown.escape) => close()`
3. `(click) => open()`

## 6.3. `PopoverTriggerToggle`

- kind: directive
- selector: `[fiboPopoverTriggerToggle]`
- hostDirectives: `PopoverTrigger`
- host events:
1. `(keydown.escape) => close()`
2. `(click) => toggle()`

## 6.4. `fromResizeObserver(element)`

- kind: function
- returns: `Observable<ResizeObserverEntry[]>`

## 6.5. `PopoverPosition`

- kind: directive
- selector: `[fiboPopoverPosition]`
- exportAs: `PopoverPosition`
- standalone: `true`
- inputs:
1. `referenceElement?: HTMLElement`
2. `trigger?: PopoverTrigger`
3. `matchWidth: boolean = false`
4. `placement = model<Placement>('bottom')`
5. `offset: number = 5`
- computed/signals:
1. `realReferenceElement` (referenceElement или trigger.element)
2. `position = readonly signal<ComputePositionReturn | null>`
3. `width` (если `matchWidth`)
4. `positionMiddleware` (`offset`, `shift`, `flip`, optional `arrow`)
- host style bindings:
1. absolute positioning (`left/top/width/opacity`)

## 6.6. `PopoverArrow`

- kind: directive
- selector: `[PopoverArrow]`
- standalone: `true`
- dependencies: `PopoverPosition`
- computed API:
1. `placement` (base side)
2. `style` (x/y + static side offset)
- host bindings:
1. `[attr.data-placement]`
2. `[style]`

## 6.7. `Popover`

- kind: directive
- selector: `[fiboPopover]`
- standalone: `true`
- hostDirectives:
1. `PopoverPosition` (forwarded inputs: `placement`, `matchWidth`, `trigger`, `referenceElement`, `offset`)
2. `ClickOutside` (from `ngxtension/click-outside`)
- required input:
1. `trigger: PopoverTrigger`
- optional dependency:
1. `dataList?: DataList` (self)
- methods:
1. `close()`
2. `clickOutsideHandle(event)`
3. `onFocusOut(event)`
4. lifecycle: `ngOnInit` привязывает себя в `trigger.popover`, `ngOnDestroy` очищает.

## 7. Date primitives

## 7.1. `DateAdapter` (interface)

- `parse(value, dateFormat, referenceDate): Date`
- `format(date, dateFormat): string`
- `isEqual(left, right): boolean`
- `isAfter(left, right): boolean`
- `isBefore(left, right): boolean`
- `now(): Date`

## 7.2. `DateFnsDateAdapter`

- kind: service
- providedIn: `root`
- реализация `DateAdapter` поверх `date-fns`.

## 7.3. `DATE_ADAPTER`

- kind: `InjectionToken<DateAdapter>`
- default factory: `DateFnsDateAdapter`

## 7.4. `SelectDate`

- kind: directive
- selector: `[fiboSelectDate]`
- standalone: `true`
- provider: `{ provide: SELECTION_MODEL, useExisting: SelectDate }`
- API:
1. `value = model<string | null>(null)`
2. `select(value: string)`
3. `isSelected(value: string)` — сравнение дат через adapter (`yyyy-MM-dd`)
4. `lastSelection = linkedSignal(() => value())`

## 7.5. `DateRange` (interface)

- `startDate: string | null`
- `endDate: string | null`

## 7.6. `SelectDateRange`

- kind: directive
- selector: `[fiboSelectDateRange]`
- standalone: `true`
- provider: `{ provide: SELECTION_MODEL, useExisting: SelectDateRange }`
- API:
1. `value = model<DateRange>({ startDate: null, endDate: null })`
2. `select(value: string)` — алгоритм выбора диапазона (start/end + swap)
3. `isSelected(value: string)` — true для start/end и дат внутри диапазона
4. `lastSelection` — `endDate || startDate || today`

## 8. Portal primitives

## 8.1. `PortalEntry` (interface)

- `id: string`
- `templateRef: TemplateRef<any>`
- `trigger: PopoverTrigger | null`

## 8.2. `PortalRegistry`

- kind: service
- providedIn: `root`
- state:
1. `openPortals` (private signal map)
2. `openPortalsList = computed(() => Array.from(values))`
- API:
1. `register(id, templateRef, trigger?)`
2. `unregister(id)`

## 8.3. `PortalContent`

- kind: directive
- selector: `ng-template[fiboPortalContent]`
- standalone: `true`
- models/inputs:
1. `isOpen = model<boolean>()`
- dependencies:
1. optional `PopoverTrigger`
2. `PortalRegistry`
3. `TemplateRef`
- behavior:
1. синхронизирует `isOpen` с `trigger.isOpen`, если trigger инжектирован.
2. при `isOpen=true` регистрирует template в `PortalRegistry`.
3. при `isOpen=false`/destroy снимает регистрацию.

## 8.4. `PortalOutletComponent`

- kind: component
- selector: `fibo-portal-outlet`
- standalone: `true`
- template behavior:
1. рендерит все открытые entries из `portalRegistry.openPortalsList()`.
2. передает trigger в контекст шаблона как `$implicit`.

## 9. Проверка полноты документа

Справочник покрывает все exports из:

1. `projects/fibo-ui/cdk/src/public-api.ts`

