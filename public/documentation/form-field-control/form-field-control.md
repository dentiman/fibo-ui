# Form Field Control

Architecture for building styled form controls in `@fibo-ui/components`.

The system separates concerns that are often collapsed into one primitive: **form state**, **layout / chrome**, **focus management**, **label association**, and **overlay lifecycle**. Each concern lives in its own directive, composed via Angular `hostDirectives` and element-level DI.

## Building Blocks

| Primitive | Selector | Responsibility |
| --- | --- | --- |
| `FieldUiState` | `[fiboFieldUiState]` *(hostDirective)* | Bridge between Angular Signal Forms and the UI layer: `disabled`, `readonly`, `required`, `invalid`, `pending`, `touched`, `errors`, `errorMessage` |
| `FieldContext` | `[fiboFieldContext]` | Cascade `density` and `labelLayout` down to any number of fields via CSS data-attributes |
| `FieldShell` | `fibo-field-shell` | Visual chrome: label, leading/trailing icons, clear button, hint/error text |
| `FieldShellHost` | `[fiboFieldShellHost]` *(hostDirective on `FieldShell`)* | DI hub: generates IDs, stores refs, activates the primary target |
| `FieldContainer` | `[fiboFieldContainer]` | Inner visual wrapper — binds `data-invalid / -readonly / -pending`, `aria-disabled`; click-delegation to `activatePrimary()` |
| `FieldLabel` | `[fiboFieldLabel]` | Marks `<label>`; auto-wires `for` / `id` and signals presence for `aria-labelledby` |
| `FieldInput` | `[fiboFieldInput]` | **Focus-surface** primary target for `<input>` / `<textarea>` |
| `FieldButton` | `[fiboFieldButton]` | **Activation-surface** primary target for `<button>` / `<div>` / `<a>` — owns `tabindex`, Enter/Space → click |
| `FieldOverlay` | `[fiboFieldOverlay]` | Encapsulates `createOverlay()` lifecycle; owns `aria-expanded`, `aria-controls` |
| `FieldAuxiliary` | `[fiboFieldAuxiliary]` | Marks secondary actions (clear, chip remove) that must not retrigger shell activation |

`FieldInput` and `FieldButton` both compose a shared internal base (`FieldTarget`, `hostDirective`-only) that owns the ARIA contract: `id`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-readonly`, and the `data-field-target` click-delegation marker.

## Composition

### Text-input field (`<input>` as primary target)

```text
<host> [hostDirectives: FieldUiState, FieldContext]
  fibo-field-shell  [hostDirective: FieldShellHost]
    div[fiboFieldContainer]           ← visual wrapper, state attributes
      label[fiboFieldLabel]           ← wires for / id
      input[fiboFieldInput]           ← primary control, ARIA auto-wired
```

### Overlay trigger field (`<button>` or `<div>` as primary target)

```text
<host> [hostDirectives: FieldUiState, FieldContext]
  fibo-field-shell  [hostDirective: FieldShellHost]
    div[fiboFieldContainer]
      label[fiboFieldLabel]
      button[fiboFieldButton][fiboFieldOverlay]   ← activation surface + overlay
```

### Text-input field with overlay (DatePicker pattern)

```text
<host> [hostDirectives: FieldUiState, FieldContext]
  fibo-field-shell  [hostDirective: FieldShellHost]
    div[fiboFieldContainer]
      label[fiboFieldLabel]
      input[fiboFieldInput][fiboFieldOverlay]     ← caret-placing input + auto-open overlay
```

## Basic Usage

### Text Input

```html
<fibo-field-shell
  [label]="label()"
  [hint]="hint()"
  [canClear]="value() !== ''"
  (clearRequested)="clear()"
>
  <input
    fiboFieldInput
    [value]="value()"
    [disabled]="uiState.disabled()"
    [readOnly]="uiState.readonly()"
    [required]="uiState.required()"
    [attr.aria-required]="uiState.required() || null"
    [attr.data-invalid]="(uiState.invalid() && uiState.touched()) || null"
    (input)="value.set($any($event.target).value)"
    (blur)="uiState.touched.set(true)"
  />
</fibo-field-shell>
```

`id`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-readonly` and `class="fibo-field-input"` are set automatically by `FieldInput` (through its `FieldTarget` base).

### Select (button trigger + overlay)

```html
<fibo-field-shell
  [label]="label()"
  iconEnd="chevron-down"
  [canClear]="canClear()"
  (clearRequested)="clear()"
>
  <button
    fiboFieldButton
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

Clicking anywhere on the shell chrome routes through `FieldShellHost.activatePrimary()` → `FieldButton.activateFromShell()` → `element.click()` → `FieldOverlay.toggle()`. Keyboard Enter/Space is handled natively by `<button>`; for non-button hosts (e.g. `<div fiboFieldButton>` in MultiSelect) `FieldButton` maps them to `click()`.

### DatePicker (input + overlay, auto-open on shell click)

```html
<fibo-field-shell [label]="label()" iconEnd="calendar-days" [canClear]="value() !== ''" (clearRequested)="clear()">
  <input
    fiboFieldInput
    [fiboFieldOverlay]="calendarTpl"
    aria-haspopup="dialog"
    [value]="value()"
    [disabled]="uiState.disabled()"
    (input)="value.set($any($event.target).value)"
    (keydown.enter)="$event.preventDefault(); fieldOverlay().open()"
    (keydown.arrowdown)="$event.preventDefault(); fieldOverlay().open()"
  />
</fibo-field-shell>
```

`FieldInput` detects a co-located `FieldOverlay` via `inject(FieldOverlay, { self: true })`. Shell-chrome click → `focus() + overlay.open()`. Click **inside** the input text places the native caret without toggling the overlay — `FieldOverlay.onHostClick` early-returns when the injected `FieldButton` is absent.

## `FieldContext` — cascading field settings

`FieldContext` sits on an outer wrapper and caps or overrides two CSS hooks across every descendant field:

```html
<form fiboFieldContext fiboSize="sm" labelLayout="inline">
  <fibo-text-field label="Name" />
  <fibo-select label="Role" [items]="roles" />
</form>
```

| Input | Type | CSS effect |
| --- | --- | --- |
| `fiboSize` | `'sm' \| 'md' \| 'lg'` | Sets `--ff-control-min-height` on descendant `.fibo-field-container` via the shared `Size` hostDirective (same primitive used by `Button`) |
| `labelLayout` | `'stacked' \| 'inline'` | Switches `--ff-body-direction` (label above vs. left of control) |

`FieldContext` is also applied as a `hostDirective` on every public field component so consumers can set `[fiboSize]` / `[labelLayout]` directly on `<fibo-text-field>`.

## `FieldShellHost` — DI Hub

Applied as a `hostDirective` on `fibo-field-shell`. Lives on the host element — the same DI scope projected content (`fiboFieldInput`, `fiboFieldButton`, `fiboFieldOverlay`) reaches via `inject()`.

Registration pattern replaces `contentChild` queries, which cannot cross the Angular projection DI boundary:

- `FieldContainer` → `registerContainerElement(el)` — provides overlay reference element
- `FieldInput` / `FieldButton` → `registerInteractive(ref)` — provides focus + activation target
- `FieldLabel` → `setHasLabel(true/false)` via `DestroyRef` — drives `aria-labelledby`

Methods consumers typically rely on:
- `idFor(suffix)` → stable IDs (`field-N-label`, `field-N-control`, …)
- `activatePrimary()` → delegates to the registered target's `activateFromShell()`
- `referenceElement()` → element used for overlay positioning

## `FieldOverlay`

Applied to the same element as `fiboFieldInput` or `fiboFieldButton`. Controls the overlay lifecycle and behaviour.

```html
<button
  fiboFieldButton
  [fiboFieldOverlay]="myTemplate"
  [matchWidth]="true"
>
```

Host bindings set automatically:
- `aria-expanded` — reflects `isOpen()`
- `aria-controls` — the panel ID when open, `null` when closed

Click detection: `FieldOverlay.onHostClick` calls `toggle()` **only when** `inject(FieldButton, { optional: true })` resolves on the same element. That is how `<input fiboFieldInput>` hosts (DatePicker) retain native caret-placement click semantics while `<button fiboFieldButton>` hosts (Select) toggle.

Public API (via `exportAs: 'fiboFieldOverlay'` or `viewChild`):

| Member | Description |
| --- | --- |
| `isOpen` | `Signal<boolean>` |
| `panelId` | `Signal<string \| null>` — overlay panel ID, `null` when closed |
| `open()` | Opens if not disabled / readonly |
| `close()` | Closes |
| `toggle()` | Toggles |
| `id` | Stable control ID (same as `host.idFor('control')`) |

Template context via `let-overlay`:
- `overlay.id` — set on the rendered panel for `aria-controls` wiring
- `overlay.close()` — request close from inside the panel

## `FieldInput`

Primary target for text-like inputs. Composes the shared `FieldTarget` base via `hostDirectives`.

Behaviour:
- Sets `class="fibo-field-input"` on the host element.
- Registers itself with `FieldShellHost` as a `FieldTargetRef`.
- Injects `FieldOverlay` with `{ self: true }`. `activateFromShell()` calls `focus()` and, if a same-element overlay exists, `overlay.open()`.
- Shell-chrome click → focus (and open, if overlay). Click **inside** the input text → native caret placement, overlay untouched.

ARIA attributes wired by the shared `FieldTarget` base (no manual binding required): `id`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-readonly`, plus the `data-field-target="true"` click-delegation marker.

## `FieldButton`

Primary target for activation-based controls (buttons, composite `<div>` triggers, anchors). Composes the shared `FieldTarget` base via `hostDirectives`.

Behaviour:
- Sets `class="fibo-field-button"` on the host — invisible base styles: no browser focus ring override, inherits alignment and cursor, full-width of content slot.
- Manages `tabindex` — `0` normally, `-1` when `uiState.disabled()`.
- Maps `keydown.enter` / `keydown.space` to `element.click()` for **non-button** hosts. Native `<button>` handles activation itself, so the directive early-returns on `instanceof HTMLButtonElement` to avoid double-click.
- Registers itself with `FieldShellHost` as a `FieldTargetRef`.
- `activateFromShell()` → `focus() + element.click()`. The shell click routes through a normal DOM click event, which `FieldOverlay` (if present on the same element) handles by calling `toggle()`.

ARIA contract (from the shared `FieldTarget` base): identical to `FieldInput` — `id`, `aria-labelledby/-describedby/-invalid/-readonly`, `data-field-target`.

## `FieldAuxiliary`

Marks secondary actions inside the shell. Both `FieldContainer` (shell click) and `FieldOverlay` (overlay click toggle) skip elements with `[data-field-auxiliary]`, so pressing them does not refocus the primary target or open the overlay.

Typical uses: clear button, chip remove button.

```html
<button type="button" fiboFieldAuxiliary (click)="removeItem(item)">
  <lucide-icon name="x" size="12"></lucide-icon>
</button>
```

## Shell Click Behaviour

`FieldContainer` handles container clicks:

1. Click on `button`, `input`, `select`, `a`, `label`, `[data-field-target]`, `[data-field-auxiliary]` → browser handles it (native semantics, caret placement, auxiliary action).
2. Click on shell chrome (icons, label spacing, empty area) → `host.activatePrimary()` → dispatches to the registered `FieldTargetRef.activateFromShell()`:
   - `FieldInput` → `focus()` (+ `overlay.open()` if same-element overlay)
   - `FieldButton` → `focus() + click()` (overlay toggles via the resulting click event)

## Accessibility

Keep semantics on the real control, not on `<fibo-field-shell>`.

Automatic (no manual binding needed):
- `id`, `aria-labelledby`, `aria-describedby` on the primary target
- `aria-invalid`, `aria-readonly` on the primary target
- `data-field-target="true"` on the primary target (click delegation marker)
- `aria-expanded`, `aria-controls` on overlay triggers
- `aria-disabled`, `data-invalid`, `data-readonly`, `data-pending` on the container

Consumer responsibility:
- `role="combobox"`, `aria-haspopup` on the primary target where applicable
- `disabled`, `readOnly`, `required` native attributes on inputs / buttons
- `[attr.id]="overlay.id"` on the panel root rendered inside `<ng-template>`

## `FieldShell` Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `''` | Field label text |
| `hint` | `string` | `''` | Helper text shown when no error is active |
| `iconStart` | `string` | `''` | Leading Lucide icon name |
| `iconEnd` | `string` | `''` | Trailing Lucide icon name |
| `canClear` | `boolean` | `false` | Shows the clear button |

Output: `clearRequested` — fired when the clear button is pressed.

## Recommended Patterns

| Control | Primary target | Overlay? |
| --- | --- | --- |
| Text input | `<input fiboFieldInput>` | — |
| Combobox | `<input fiboFieldInput>` | ✅ (consumer-driven via `createOverlay`) |
| Date picker | `<input fiboFieldInput [fiboFieldOverlay]>` | ✅ (auto-open on shell click) |
| Select | `<button fiboFieldButton [fiboFieldOverlay]>` | ✅ |
| Multi-select | `<div fiboFieldButton [fiboFieldOverlay]>` | ✅ |

Rule of thumb: if the primary surface accepts text entry or must preserve caret clicks, use `FieldInput`. If activation (click / Enter / Space) is the only interaction, use `FieldButton`.

## Reference Implementations

- `TextField` — `FieldInput`, no overlay
- `DatePickerField` — `FieldInput + FieldOverlay` (shell click auto-opens calendar)
- `Select` — `FieldButton + FieldOverlay` with `<button role="combobox">`
- `MultiSelect` — `FieldButton + FieldOverlay` with composite `<div role="combobox">`
- `Combobox` — `FieldInput` with consumer-controlled overlay via `createOverlay` from `@fibo-ui/cdk`
