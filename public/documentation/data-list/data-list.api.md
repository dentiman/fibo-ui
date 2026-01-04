## Data list building blocks

- `DataList` (`[fiboDataList]`) manages active option state, keyboard navigation, and emits `optionTriggered` when a child option fires.
- `ListItem` (`[fiboOption]`) is the selectable option directive exported as `ListItem` for template refs.

### ListItem inputs & outputs

- `value`: value bound to the selection model; optional, but required for selection.
- `disabled`: disable a single option (merged with the parent list's disabled state).
- `itemTrigger`: event emitted after the option is activated (click/Enter); also bubbles through `DataList.optionTriggered`.

### Selection models

- Add `fiboSelectOne [(value)]="..."` for radio-style selection or `fiboSelectMulti [(value)]="..."` for toggleable multi-select on the same host as `fiboDataList`.
- The selection model is injected automatically; `ListItem.isSelected()` reflects the current model state, and `data-multiple` is set when `fiboSelectMulti` is present.

### Host bindings & accessibility

- `aria-disabled` mirrors `disabled` or the parent `DataList` disabled input.
- `aria-selected` reflects `isSelected()` so screen readers understand the current selection.
- `data-active` is set while the option matches the active option tracked by `DataList` (hover/keyboard focus).
- `data-multiple` marks multi-select mode for styling; only present with `fiboSelectMulti`.
- `tabindex="-1"` keeps items focusable programmatically while letting the trigger keep primary tab focus.

### Example

```html
<div
  fiboPopover
  fiboDataList
  [trigger]="trigger"
  [disabled]="isDisabled"
  fiboSelectOne [(value)]="selectedCountry">
  @for (country of countries; track country) {
    <a
      fiboOption [value]="country"
      #item="Option"
      class="datalist-item">
      {{ country }}
      <span class="sr-only" *ngIf="item.isSelected()">selected</span>
    </a>
  }
</div>
```

- Keyboard: ArrowUp/ArrowDown move `data-active`, Enter triggers `itemTrigger` and updates the selection model.
- Pointer: `mouseenter` sets the active item; click fires `itemTrigger` and selection.
