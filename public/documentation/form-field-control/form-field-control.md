# Form Field Control

Architecture for building styled form controls in `@fibo-ui/components`.

The system separates five concerns that are often collapsed into one primitive: layout, form state, focus management, label association, and overlay lifecycle.

## Building Blocks

| Primitive | Selector | Responsibility |
| --- | --- | --- |
| `FormUiState` | `hostDirective` | Receives signal-form UI state: `disabled`, `invalid`, `required`, `touched`, `errorMessage` |
| `FieldShell` | `fibo-field-shell` | Visual shell: label, icons, clear button, hint/error text |
| `FieldShellHostDirective` | `[fiboFieldShellHost]` | Registration hub — auto-applied as `hostDirective` on `FieldShell` |
| `FieldContainerDirective` | `[fiboFieldContainer]` | Binds ARIA state and click delegation to the inner visual wrapper |
| `FieldInteractiveDirective` | `[fiboFieldInteractive]` | Marks the primary interactive element; owns `id`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-readonly` |
| `FieldAuxiliaryDirective` | `[fiboFieldAuxiliary]` | Marks secondary actions (clear, chip remove) that should not retrigger shell activation |
| `FieldLabelDirective` | `[fiboFieldLabel]` | Marks the label; auto-wires `for` and notifies the hub that a label is present |
| `FieldOverlayDirective` | `[fiboFieldOverlay]` | Encapsulates `createConnectedOverlay()` for overlay fields; owns `aria-expanded`, `aria-controls` |

## Composition

For a simple text field:

```text
FormUiState (hostDirective)
fibo-field-shell  [fiboFieldShellHost ← auto via hostDirective]
  div[fiboFieldContainer]          ← visual wrapper, state attributes
    label[fiboFieldLabel]          ← wires for/id
    input[fiboFieldInteractive]    ← primary control, ARIA
```

For an overlay field (Select, DatePicker):

```text
FormUiState (hostDirective)
fibo-field-shell  [fiboFieldShellHost ← auto via hostDirective]
  div[fiboFieldContainer]
    label[fiboFieldLabel]
    button[fiboFieldInteractive][fiboFieldOverlay]   ← primary control + overlay
```

## Basic Usage

### Text Input

```html
<fibo-field-shell [label]="label()" [hint]="hint()" [canClear]="value() !== ''" (clearRequested)="clear()">
  <input
    fiboFieldInteractive
    [value]="value()"
    [disabled]="uiState.disabled()"
    [readOnly]="uiState.readonly()"
    [required]="uiState.required()"
    [attr.name]="uiState.name() || null"
    [attr.aria-required]="uiState.required() || null"
    [attr.data-error]="(uiState.invalid() && uiState.touched()) || null"
    (input)="value.set($event.target.value)"
    (blur)="uiState.touched.set(true)"
    class="text-field-input"
  />
</fibo-field-shell>
```

`aria-invalid`, `aria-readonly`, `aria-labelledby`, `aria-describedby` and `id` are set automatically by `FieldInteractiveDirective`.

### Overlay Trigger (Select)

```html
<fibo-field-shell [label]="label()" iconEnd="chevron-down" [canClear]="canClear()" (clearRequested)="clear()">
  <button
    fiboFieldInteractive
    fieldInteractiveMode="click"
    [fiboFieldOverlay]="selectTpl"
    [matchWidth]="true"
    #triggerButton
    type="button"
    role="combobox"
    aria-haspopup="listbox"
    [disabled]="uiState.disabled()"
    (blur)="uiState.touched.set(true)"
  >
    {{ selectedLabel() || placeholder() }}
  </button>
</fibo-field-shell>

<ng-template #selectTpl let-overlay>
  <div role="listbox" [attr.id]="overlay.id" fiboDataList (itemTriggered)="overlay.close()">
    @for (item of items(); track item.value) {
      <button type="button" fiboDataListItem role="option" [value]="item.value">
        {{ item.label }}
      </button>
    }
  </div>
</ng-template>
```

`FieldOverlayDirective` automatically sets `aria-expanded` and `aria-controls`. The `[fiboFieldOverlay]="tpl"` binding is the only hook needed.

The template receives an `OverlayHandle` as `$implicit` context via `let-overlay`:
- `overlay.id` — ID to set on the panel element (for `aria-controls` wiring)
- `overlay.close()` — request close from inside the panel

## `FieldShellHostDirective` — DI Hub

`FieldShellHostDirective` is applied as a `hostDirective` on `fibo-field-shell`. It sits on the host element — the same DI scope that projected content (`fiboFieldInteractive`, `fiboFieldOverlay`) uses when they call `inject()`.

All field primitives register themselves through it:
- `FieldContainerDirective` → `registerContainerElement(el)` — provides overlay reference element
- `FieldInteractiveDirective` → `registerInteractive(ref)` — provides focus target
- `FieldLabelDirective` → `setHasLabel(true/false)` via `DestroyRef` — drives `aria-labelledby`

This registration pattern avoids `contentChild` queries, which cannot cross the Angular projection DI boundary.

## `FieldOverlayDirective`

Applied to the same element as `fiboFieldInteractive`. Controls the overlay lifecycle.

```html
<button
  fiboFieldInteractive
  fieldInteractiveMode="click"
  [fiboFieldOverlay]="myTemplate"
  [matchWidth]="true"
>
```

Host bindings set automatically:
- `aria-expanded` — reflects `isOpen()`
- `aria-controls` — set to `panelId()` when open, null when closed

Public API (via `exportAs: 'fiboFieldOverlay'` or `viewChild`):

| Member | Description |
| --- | --- |
| `isOpen` | `Signal<boolean>` |
| `panelId` | `Signal<string \| null>` — overlay panel ID, null when closed |
| `open()` | Opens if not disabled/readonly |
| `close()` | Closes |
| `toggle()` | Toggles |

Reference element and focus restoration are wired automatically through `FieldShellHostDirective`.

## `FieldInteractiveDirective`

Applied to the primary focusable element. Sets automatically:

| Attribute | Source |
| --- | --- |
| `id` | `host.idFor('control')` |
| `aria-labelledby` | `host.idFor('label')` when label is present |
| `aria-describedby` | `host.idFor('error')` when error is active |
| `aria-invalid` | `formUiState.invalid()` |
| `aria-readonly` | `formUiState.readonly()` |

Input:

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `fieldInteractiveMode` | `'focus' \| 'click'` | `'focus'` | `focus` for text-like fields; `click` for button-like triggers that open on shell click |

## `FieldAuxiliaryDirective`

Marks secondary actions inside the shell. Shell click detection skips elements with `[data-field-auxiliary]`, so clicking them does not retrigger focus or open the overlay.

Typical uses: clear button, chip remove button.

```html
<button type="button" fiboFieldAuxiliary (click)="removeItem(item)">
  <lucide-icon name="x" size="12"></lucide-icon>
</button>
```

## Shell Click Behaviour

`FieldContainerDirective` handles container clicks:

1. Click on `button`, `input`, `a`, `label`, `[data-field-interactive]`, `[data-field-auxiliary]` → no action (browser handles it)
2. Click on shell chrome → `host.activatePrimary()` → focuses or clicks the interactive element based on its mode

## Accessibility

Keep semantics on the real control, not on `FieldShell`.

Automatic (no manual binding needed):
- `id`, `aria-labelledby`, `aria-describedby` on the interactive element
- `aria-invalid`, `aria-readonly` on the interactive element
- `aria-expanded`, `aria-controls` on the overlay trigger
- `aria-disabled`, `aria-required`, `data-error`, `data-readonly` on the container

Manual (consumer responsibility):
- `role="combobox"`, `aria-haspopup` on the interactive element
- `aria-required` for native form inputs
- `disabled`, `readOnly`, `required` native properties on inputs/buttons
- `[attr.id]="overlay.id"` on the panel rendered inside `ng-template`

## `FieldShell` Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `''` | Field label text |
| `hint` | `string` | `''` | Helper text shown when no error |
| `iconStart` | `string` | `''` | Leading Lucide icon name |
| `iconEnd` | `string` | `''` | Trailing Lucide icon name |
| `canClear` | `boolean` | `false` | Shows the clear button |

Output: `clearRequested` — fired when the clear button is pressed.

## Recommended Patterns

| Control type | `fieldInteractiveMode` | Element |
| --- | --- | --- |
| Text input | `focus` (default) | `input` |
| Select | `click` | `button[role=combobox]` |
| Date picker | `click` | `input[aria-haspopup=dialog]` |
| Multi-select | `click` | `div[role=combobox][tabindex=0]` |
| Combobox | `focus` (default) | `input[role=combobox]` |

## Reference Implementations

- `TextField` — text input pattern
- `Select` — click-trigger overlay with listbox
- `DatePickerField` — click-trigger overlay with dialog
- `MultiSelect` — click-trigger overlay with multi-selection
- `Combobox` — focus-driven autocomplete with direct `createConnectedOverlay`
