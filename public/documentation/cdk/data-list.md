# Data List & Items

`DataList` + `DataListItem` are low-level primitives for interactive lists (selects, menus, listboxes).

## Concept

### 1) Registration lifecycle

Each `fiboDataListItem` injects parent `DataList` and self-registers on `ngOnInit`, then unregisters on `ngOnDestroy`.
This keeps the internal ordered list (`options`) in sync with rendered DOM items.

### 2) Active item state

`DataList` stores current active item in `activeDataListItem`.
An item becomes active by:

- mouse hover (`mouseenter` on item)
- keyboard navigation (`ArrowDown` / `ArrowUp`)

When active, item receives `data-active="true"`. Use this attribute for active styles.

### 3) Keyboard navigation

`DataList` handles key events on the host:

- `ArrowDown` -> next item
- `ArrowUp` -> previous item
- `Enter` -> trigger selection on active item
- `Home` -> first enabled item
- `End` -> last enabled item

Disabled items are skipped while navigating with arrows.

### 4) Selection and events

`DataListItem` can work with selection directives (`fiboSelectOne`, `fiboSelectMulti`).
On click or Enter:

- item updates selection model (if present)
- `itemTriggered` emits from `DataList`
- `itemTrigger` emits from item itself

## Basic Example

:::example cdk-data-list-items-basic

```html {example="cdk-data-list-items-basic"}
<div fiboDataList fiboSelectOne [(value)]="selectedValue"
     tabindex="0" role="listbox"
     class="popover-container p-2 max-h-72 overflow-auto outline-none">
  @for (item of items; track item.value) {
    <button fiboDataListItem type="button"
            [value]="item.value" [disabled]="!!item.disabled"
            class="datalist-item w-full text-left flex flex-col gap-0.5">
      <span>{{ item.label }}</span>
      <span class="text-xs text-foreground-secondary">{{ item.hint }}</span>
    </button>
  }
</div>
```

```ts {example="cdk-data-list-items-basic"}
@Component({
  selector: 'cdk-data-list-items-basic-example',
  imports: [DataList, DataListItem, SelectOne],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class CdkDataListItemsBasicExample {
  readonly items = [
    { value: 'registration', label: 'Registration', hint: 'Items register in ngOnInit' },
    { value: 'active', label: 'Active State', hint: 'Mouseenter sets data-active=true' },
    { value: 'keyboard', label: 'Keyboard Navigation', hint: 'Arrow keys navigate through items' },
    { value: 'disabled', label: 'Disabled Item', hint: 'Skipped by keyboard navigation', disabled: true },
    { value: 'selection', label: 'Selection', hint: 'Enter or click triggers selection model' },
  ];

  readonly selectedValue = signal<string>('registration');
}
```

## Navigation Strategy

`DataList` separates two concerns:

- it always owns item registry, active item state, and key mapping
- a navigation strategy decides what happens in the DOM after the active item changes

This is important because not every consumer wants the same keyboard behavior:

- **focus strategy** (default) moves DOM focus to the active item
- **active-descendant strategy** keeps focus on the trigger or input and only updates active state + scrolling

### Default behavior

Plain `fiboDataList` instances use the focus strategy automatically. No setup is needed for the common list-like cases:

- select
- multi-select
- menu
- listbox
- calendar
- side menu

### Active-descendant mode

For input-driven controls such as combobox, where focus must stay in the input and the list is exposed through `aria-activedescendant`, set `[useActiveDescendant]="true"`:

```html
<div
  fiboDataList
  [useActiveDescendant]="true"
  [keyboardSourceElement]="inputElement"
>
  ...
</div>
```

When active-descendant mode is enabled, arrow key navigation scrolls the active item into view but does not move DOM focus away from the trigger or input element.

## Integration with Trigger Elements

`DataList` is designed to work together with overlay triggers for dropdown-style components (Select, Menu, etc.).

### How it works

When an overlay contains a `DataList`, keyboard events on the **trigger element** can be forwarded to the list through `keyboardSourceElement`:

```
User presses ArrowDown on trigger
  → DataList.keydownSourceElement listener fires
    → DataList.onKeydown()
      → DataList updates active item
      → strategy applies focus or active-descendant behavior
```

This means the user can navigate the list **without moving focus** into the popover — focus stays on the trigger while arrows control the list.

### Connecting a trigger and DataList

Pass the trigger's `HTMLElement` directly as `[keyboardSourceElement]`:

```html
<button
  #triggerBtn
  type="button"
  (click)="toggle()"
>
  Open list
</button>

<ng-template #listTpl let-overlay>
  <div
    fiboDataList
    [keyboardSourceElement]="triggerBtn"
    fiboSelectOne
    [(value)]="selected"
    (itemTriggered)="overlay.close()"
    class="popover-container"
  >
    @for (item of items; track item.value) {
      <button fiboDataListItem [value]="item.value" class="datalist-item">
        {{ item.label }}
      </button>
    }
  </div>
</ng-template>
```

Key points:
- `[keyboardSourceElement]` accepts any `HTMLElement` — DataList attaches a `keydown` listener to it directly
- the binding is reactive: changing the element (or setting it to `null`) removes the old listener and registers a new one
- the active strategy determines whether arrows move real DOM focus or keep it on the trigger/input
- `(itemTriggered)="overlay.close()"` is still the usual way to close a dropdown on selection

## API Snapshot

- `fiboDataList`
- `fiboDataListItem`
- `DataList.keyboardSourceElement` — model input accepting `HTMLElement | null`; DataList attaches a `keydown` listener while the element is set
- `DataList.useActiveDescendant` — enables active-descendant navigation mode (default: `false`)
- `DataList.itemTriggered`
- `DataList.activeDataListItem()`
