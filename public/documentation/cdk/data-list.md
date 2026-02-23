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
- `Escape` -> close popover and return focus to trigger (when `trigger` is provided)

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

## API Snapshot

- `fiboDataList`
- `fiboDataListItem`
- `DataList.itemTriggered`
- `DataList.activeDataListItem()`
