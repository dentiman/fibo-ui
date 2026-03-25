# Form Field Control

Recommended architecture for styled form controls in `@fibo-ui/components`.

This page replaces the old mental model where `FormFieldControl` was both:
- the visual shell
- the form control
- the popover trigger

That model was fine for small demos, but it mixed layout, form state, focus management, and overlay lifecycle into one primitive.

The current architecture separates those concerns.

## Recommended Building Blocks

Use these primitives together:

| Primitive | Responsibility |
| --- | --- |
| `FormUiState` | Receives signal-form UI state from `[formField]`: `disabled`, `invalid`, `errors`, `required`, `touched`, and derived `errorMessage` |
| `FieldShell` | Visual shell: label, icons, clear button, hint/error text, focus-within styling |
| `FieldTarget` | Marks the primary interactive element inside the shell |
| `FieldAction` | Marks secondary actions such as clear or chip remove buttons |
| `FieldOverlayAnchor` | Optional override for the element used as overlay anchor |

In this model:
- the real control is always the inner `input`, `button`, or composite surface
- `FieldShell` is not the control and is not focusable
- overlays are owned by the component, not by the shell

## Composition Model

The default composition for a field-based control is:

```text
FormUiState          - form-derived UI state
FieldShell           - visual container
FieldTarget          - primary interactive element inside the shell
FieldAction x N      - clear/remove buttons that should not retrigger shell focus
createOverlay()      - optional overlay lifecycle for Select / Combobox / DatePicker / MultiSelect
```

For simple controls such as `TextField`:

```text
FormUiState
└─ FieldShell
   └─ input[fiboFieldTarget]
```

For overlay controls such as `Select`:

```text
FormUiState
└─ FieldShell
   └─ button[fiboFieldTarget fieldTargetMode="click"]
      └─ createOverlay({
           referenceElement: shell,
           interactionRoot: shell,
           focusReturnTarget: button
         })
```

## Why This Split Exists

The shell is visually wider than the real focusable control:
- icons live on the sides
- label lives above or beside the content
- the primary control sits in the middle

Users still expect:
- clicking the shell to focus or open the field
- clicking a clear button to only clear, not reopen
- overlays to match the shell width
- focus to return to the correct inner control after the overlay closes

These requirements are hard to model if one element tries to be:
- the shell
- the overlay trigger
- the focus target

The new field primitives make those roles explicit.

## Basic Usage

### Text Input

```html
<fibo-field-shell
  [label]="label()"
  [hint]="hint()"
  [iconStart]="iconStart()"
  [iconEnd]="iconEnd()"
  [canClear]="value() !== ''"
  (clearRequested)="clear()"
>
  <input
    fiboFieldTarget
    [value]="value()"
    [disabled]="uiState.disabled()"
    [required]="uiState.required()"
    [attr.aria-invalid]="uiState.invalid() || null"
    (input)="value.set(($event.target as HTMLInputElement).value)"
    (blur)="uiState.touched.set(true)"
    class="text-field-input"
  />
</fibo-field-shell>
```

What happens here:
- `FieldShell` handles shell click
- `FieldTarget` tells the shell which element to focus
- `FormUiState` supplies validation and disabled state
- `FieldShell` renders hint or error text under the field

### Select Trigger

```html
<fibo-field-shell
  #shell
  [label]="label()"
  [hint]="hint()"
  iconEnd="chevron-down"
  [canClear]="clearValue() !== undefined && value() !== clearValue()"
  (clearRequested)="clear()"
>
  <button
    fiboFieldTarget
    fieldTargetMode="click"
    type="button"
    role="combobox"
    [attr.aria-expanded]="isOpen()"
    [attr.aria-controls]="isOpen() ? listboxId : null"
    [attr.aria-invalid]="uiState.invalid() || null"
    (click)="toggle()"
    (blur)="uiState.touched.set(true)"
  >
    {{ selectedLabel() || placeholder() }}
  </button>
</fibo-field-shell>
```

```ts
readonly overlayConfig = computed(() => ({
  templateRef: this.selectTemplate(),
  referenceElement: this.fieldShell().overlayReferenceElement(),
  interactionRoot: this.fieldShell().overlayInteractionRoot(),
  focusReturnTarget: this.fieldShell().overlayFocusReturnTarget(),
  category: 'popover' as const,
}));
```

Here the shell click opens the button because `FieldTarget` is configured with `fieldTargetMode="click"`.

## Shell Interaction Rules

`FieldShell` follows these rules:

1. If the click lands on a `FieldAction`, do nothing except that action.
2. If the click lands on the primary target itself, let the browser handle it.
3. If the click lands on non-interactive shell chrome, activate the primary target.

This means:
- text inputs focus on shell click
- select-like buttons open on shell click
- multi-select chip remove buttons do not reopen the popover

## Overlay Strategy

For overlay fields, `FieldShell` works together with `createOverlay()`.

Recommended mapping:

| Overlay config field | Recommended value |
| --- | --- |
| `referenceElement` | shell or explicit `FieldOverlayAnchor` |
| `interactionRoot` | shell |
| `focusReturnTarget` | primary `FieldTarget` |

This gives the right behaviour:
- overlay width can match the full field shell
- click-outside and focus-leave are measured against the whole field
- focus returns to the real control, not to a non-focusable wrapper

## Accessibility Notes

Keep semantics on the real control, not on `FieldShell`.

Do:
- put `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-invalid` on the real `button` or `input`
- put `required`, `disabled`, `name`, and other form semantics on the real focus target
- keep decorative icons non-interactive

Do not:
- make `FieldShell` focusable
- put the main `role="combobox"` on the shell
- use clickable SVG icons as standalone actions

For secondary actions:
- use real buttons
- mark them with `fiboFieldAction`
- stop propagation when the action should not reopen or refocus the field

## Using `FormUiState`

`FormUiState` is the thin signal-forms bridge for UI state.

Add it through `hostDirectives`:

```ts
@Component({
  hostDirectives: [
    {
      directive: FormUiState,
      inputs: [...FORM_UI_STATE_INPUTS],
    },
  ],
})
export class Select {}
```

Then read from `uiState` where needed:

```ts
readonly uiState = inject(FormUiState);
```

Typical usage:
- `uiState.disabled()`
- `uiState.required()`
- `uiState.invalid()`
- `uiState.touched.set(true)`
- `uiState.errorMessage()`

## Field Primitives API

### `FieldShell`

Selector: `fibo-field-shell`

Inputs:

| Input | Type | Description |
| --- | --- | --- |
| `id` | `string` | Used for the projected label `for=""` |
| `label` | `string` | Field label |
| `hint` | `string` | Helper text shown when there is no validation error |
| `iconStart` | `string` | Leading Lucide icon |
| `iconEnd` | `string` | Trailing Lucide icon |
| `canClear` | `boolean` | Controls clear-button visibility |

Outputs:

| Output | Description |
| --- | --- |
| `clearRequested` | Fired when the clear button is pressed |
| `focusRequested` | Fallback event when no `FieldTarget` is present |

Public methods used by controls:

| Method | Description |
| --- | --- |
| `focusPrimary()` | Focuses the primary target |
| `activatePrimaryFromShell()` | Focuses or clicks the primary target based on its mode |
| `overlayReferenceElement()` | Returns explicit overlay anchor or shell element |
| `overlayInteractionRoot()` | Returns the shell root used for close policies |
| `overlayFocusReturnTarget()` | Returns the target used after overlay close |

### `FieldTarget`

Selector: `[fiboFieldTarget]`

Purpose:
- marks the primary interactive element
- tells the shell how to react on shell click

Input:

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `fieldTargetMode` | `'focus' | 'click'` | `'focus'` | `focus` for text-like fields, `click` for button-like triggers |

Use:
- `input` for `TextField`
- `button` for `Select`
- composite `div[tabindex="0"]` for `MultiSelect`

### `FieldAction`

Selector: `[fiboFieldAction]`

Marks an inner action that should not retrigger shell activation.

Typical use cases:
- clear button
- remove-chip button
- secondary trailing action

### `FieldOverlayAnchor`

Selector: `[fiboFieldOverlayAnchor]`

Optional override for cases where the overlay should anchor to something other than the shell root.

If absent, the shell itself is used as the anchor.

## Recommended Patterns

Use these defaults unless a control clearly needs something else.

| Control type | Target mode | Overlay anchor | Focus return |
| --- | --- | --- | --- |
| Text input | `focus` | none | input |
| Select | `click` | shell | trigger button |
| Combobox | `focus` | shell | input |
| Date picker | `click` | shell | input or trigger button |
| Multi-select | `click` | shell | composite trigger surface |

## Legacy Note

`FormFieldControl` still exists in the codebase for backward compatibility and old examples, but it is no longer the recommended primitive for new field components.

For new work, use:
- `FormUiState`
- `FieldShell`
- `FieldTarget`
- `FieldAction`
- `FieldOverlayAnchor`

## Reference Implementations

See the current runtime components for the recommended pattern:
- `TextField`
- `Select`
- `Combobox`
- `DatePickerField`
- `MultiSelect`

These components now use the same field architecture and should be treated as the canonical examples.
