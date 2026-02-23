# Selection Models

Composable selection primitives that add single or multiple selection semantics to any list-like UI — dropdowns, listboxes, menus, navigation — via Angular's dependency injection.

---

## Concept

Selection is a cross-cutting concern: a single-select dropdown, a multi-select checkbox list, and a sidebar navigation all need to track "what is selected" — but their visual appearance and interaction patterns are completely different.

fibo-ui extracts selection into a standalone layer that plugs into any container through the `SELECTION_MODEL` injection token. The container (e.g. `DataList`) doesn't know _how_ selection works — it only calls `select()` and `isSelected()` on whatever model is injected.

### How It Works

```
Host element (e.g. a <div>)
  ├── fiboDataList          — keyboard navigation, item registration
  ├── fiboSelectOne         — provides SELECTION_MODEL token (single selection)
  │   or fiboSelectMulti    — provides SELECTION_MODEL token (multi selection)
  │   or fiboRouterSelectOne — provides SELECTION_MODEL token (route-based)
  │
  └── fiboDataListItem × N  — injects SELECTION_MODEL (optional);
                               calls model.select(value) on click/Enter;
                               reads model.isSelected(value) for aria-selected
```

The key insight: **the selection model is a directive on the parent**, not a service or a property. Swap `fiboSelectOne` for `fiboSelectMulti` and your single-select dropdown becomes a multi-select — with zero changes to the items.

### The `SelectionModel<T>` Interface

Every selection model implements this contract:

```ts
interface SelectionModel<T> {
  value: Signal<unknown>        // current selection state
  select(value: T): void        // select (or toggle) a value
  isSelected(value: T): boolean // check if a value is currently selected
  lastSelection: Signal<T|null> // the most recently selected value
}
```

`DataListItem` injects `SELECTION_MODEL` optionally — items work fine without any selection model (e.g. a menu of actions that don't need "selected" state).

### Three Built-In Models

| Directive | Token | Behavior |
|---|---|---|
| `fiboSelectOne` | `SELECTION_MODEL` | Replaces the current value. `value` is `T \| null`. |
| `fiboSelectMulti` | `SELECTION_MODEL` | Toggles values in an array. `value` is `T[] \| null`. |
| `fiboRouterSelectOne` | `SELECTION_MODEL` | Syncs selection with the current route. `select()` navigates. |

All three provide the same `SELECTION_MODEL` token, so `DataListItem` (or any consumer) doesn't need to know which model is active.

---

## Examples

### Single Selection

The simplest case: one value at a time. Click or press Enter to select; the previous selection is replaced.

:::example cdk-selection-single

```html {example="cdk-selection-single"}
<div
  fiboDataList
  fiboSelectOne
  [(value)]="selectedFruit"
  tabindex="0"
  role="listbox"
  class="popover-container p-2 max-h-72 overflow-auto outline-none"
>
  @for (fruit of fruits; track fruit) {
    <button fiboDataListItem type="button" [value]="fruit"
            class="datalist-item w-full text-left">
      {{ fruit }}
    </button>
  }
</div>

<p class="mt-3 text-sm">
  Selected: <strong>{{ selectedFruit() || 'None' }}</strong>
</p>
```

```ts {example="cdk-selection-single"}
@Component({
  selector: 'cdk-selection-single-example',
  imports: [DataList, DataListItem, SelectOne],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class CdkSelectionSingleExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  readonly selectedFruit = signal<string | null>(null);
}
```

---

### Multiple Selection

Same structure, different model. `fiboSelectMulti` toggles values: click once to add, click again to remove.

:::example cdk-selection-multi

```html {example="cdk-selection-multi"}
<div
  fiboDataList
  fiboSelectMulti
  [(value)]="selectedColors"
  tabindex="0"
  role="listbox"
  aria-multiselectable="true"
  class="popover-container p-2 max-h-72 overflow-auto outline-none"
>
  @for (color of colors; track color) {
    <button fiboDataListItem type="button" [value]="color"
            class="datalist-item w-full text-left">
      {{ color }}
    </button>
  }
</div>

<p class="mt-3 text-sm">
  Selected: <strong>{{ selectedColors().join(', ') || 'None' }}</strong>
</p>
```

```ts {example="cdk-selection-multi"}
@Component({
  selector: 'cdk-selection-multi-example',
  imports: [DataList, DataListItem, SelectMulti],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class CdkSelectionMultiExample {
  readonly colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'];
  readonly selectedColors = signal<string[]>([]);
}
```

---

## Advantages

**1. Swap models without touching items**
Change `fiboSelectOne` to `fiboSelectMulti` on the parent — every `DataListItem` inside automatically switches to toggle behavior. No `@if`, no configuration flag.

**2. Dependency injection, not configuration**
Selection behavior is provided via Angular's DI (`SELECTION_MODEL` token), not via an `[mode]="'multi'"` input. This means you can create your own selection model (e.g. "select up to 3") by implementing the `SelectionModel<T>` interface and providing it under the same token.

**3. Signals-native**
`value` is a `Signal`, not a `BehaviorSubject`. Two-way binding with `[(value)]` works out of the box. `isSelected()` is called inside `computed()` in `DataListItem`, so `aria-selected` updates reactively.

**4. Works without DataList**
The selection models are independent directives. You can use `SelectOne` on a custom component that has nothing to do with `DataList` — just inject `SELECTION_MODEL` and call `select()` / `isSelected()`.

**5. Route-aware selection**
`RouterSelectOne` implements the same interface but ties selection to the current URL. The sidebar navigation uses it — clicking an item navigates, and the active route is always "selected". No manual sync needed.

---

## Composition

The selection model layer composes with other CDK primitives and higher-level components:

| Component | Selection Model | Result |
|---|---|---|
| `DataList` + `SelectOne` | Single | Listbox / dropdown |
| `DataList` + `SelectMulti` | Multi | Multi-select checkbox list |
| `DataList` + `RouterSelectOne` | Route | Sidebar navigation |
| `Popover` + `DataList` + `SelectOne` | Single | Select (dropdown) component |
| `Popover` + `DataList` + `SelectMulti` | Multi | Multi-select component |

---

## API Reference

### `SELECTION_MODEL`

`InjectionToken<SelectionModel<any>>` — the DI token that all selection models provide. Inject it in your own components to read or drive selection.

### SelectionModel&lt;T&gt; (Interface)

| Member | Type | Description |
|---|---|---|
| `value` | `Signal<unknown>` | Current selection state (`T \| null` for single, `T[] \| null` for multi) |
| `select(value)` | `(value: T) => void` | Select (or toggle) a value |
| `isSelected(value)` | `(value: T) => boolean` | Check if a value is currently selected |
| `lastSelection` | `Signal<T \| null>` | The most recently selected value |

### SelectOne

Selector: `[fiboSelectOne]`

| Member | Type | Default | Description |
|---|---|---|---|
| `value` | `model<T \| null>` | `null` | Two-way binding for the selected value |
| `selectionChange` | `output<T>` | — | Emitted when selection changes |
| `compareFn` | `input<(a: T, b: T) => boolean>` | `(a, b) => a === b` | Custom equality function |

### SelectMulti

Selector: `[fiboSelectMulti]`

| Member | Type | Default | Description |
|---|---|---|---|
| `value` | `model<T[] \| null>` | `null` | Two-way binding for the selected values array |
| `compareFn` | `input<(a: T, b: T) => boolean>` | `(a, b) => a === b` | Custom equality function |

**Toggle behavior:** calling `select(value)` adds the value if it's not in the array, or removes it if it is.

### RouterSelectOne

Selector: `[fiboRouterSelectOne]`

| Member | Type | Default | Description |
|---|---|---|---|
| `urlOf` | `input<(value: T) => string \| undefined>` | auto-detect | Extracts a URL from the value. Handles strings and `{url: string}` objects by default. |
| `routeMatchOptions` | `input<IsActiveMatchOptions>` | `{paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored'}` | How strictly to match the active route |

**Navigation:** `select(value)` calls `router.navigateByUrl()`. `isSelected(value)` checks `router.isActive()`.
