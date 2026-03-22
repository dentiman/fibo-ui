# CDK Composition Map

Updated dependency graph for current `@fibo-ui/cdk` + `@fibo-ui/components` architecture.

---

## Legend

- `──hostDir──▶` — composed via `hostDirectives`
- `──inject──▶` — resolved via `inject()`
- `──provides──▶` — provides DI token
- `(opt)` — optional injection
- `(self)` — self-only injection
- `(skipSelf)` — parent-only injection

---

## 1. Portal System (current)

```
PopoverTrigger
    ├── input: contentTemplate → TemplateRef<any>
    ├── signal: isOpen
    ├── effect: isOpen && contentTemplate
    │     └── register/unregister in OverlayRegistry
    │         with context: {$implicit: this}
    └── owns portal lifecycle

OverlayRegistry (root service)
    └── signal: Map<id, { templateRef, context? }>

OverlayOutlet ──inject──▶ OverlayRegistry
    └── renders openPortalsList via ngTemplateOutlet
```

### Removed after refactor

These entities are no longer part of the runtime graph:

- `PortalContent` directive (`ng-template[fiboPortalContent]`)
- `PORTAL_OWNER` token
- `PortalOwner` interface

The ownership link is now explicit through `[contentTemplate]` input on trigger directives.

---

## 2. Popover System

```
PopoverTrigger
    ├── input: contentTemplate
    ├── inject(opt, self) ──▶ DataListItem (detect list-item host)
    ├── inject ──▶ OverlayRegistry
    ├── signal: isOpen
    ├── signal: popover → Popover | null
    └── host: tabindex / aria-expanded / focusout

PopoverTriggerClick ──hostDir──▶ PopoverTrigger (inputs: contentTemplate)
    └── host: click/open, enter/open, escape/close

PopoverTriggerToggle ──hostDir──▶ PopoverTrigger (inputs: contentTemplate)
    └── host: click/toggle, escape/close

Popover ──hostDir──▶ PopoverPosition (inputs: placement, matchWidth, trigger, referenceElement, offset)
        ──hostDir──▶ ClickOutside (outputs: clickOutside)
    ├── input(required): trigger → PopoverTrigger
    ├── ngOnInit: trigger.popover.set(this)
    └── ngOnDestroy: trigger.popover.set(null)

PopoverPosition
    ├── input: trigger | referenceElement
    ├── contentChild ──▶ PopoverArrow
    └── uses @floating-ui/dom (autoUpdate + computePosition)

PopoverArrow
    └── inject ──▶ PopoverPosition
```

---

## 3. DataList + Selection

```
DataList
    ├── model: options → DataListItem[]
    ├── signal: activeDataListItem
    ├── output: itemTriggered
    └── keyboard: ArrowUp/Down, Enter, Escape

DataListKeyboardBridge
    ├── inject ──▶ DataList
    ├── input: target → KeyboardTarget
    └── effect: target.connect(self)

KeyboardTarget
    ├── applied explicitly on the target element
    ├── host: keydown
    ├── method: connect(handler)
    └── forwards keydown / navigateNext

DataListItem
    ├── inject ──▶ DataList
    ├── inject(opt) ──▶ SELECTION_MODEL
    ├── input: value<T>
    ├── output: itemTrigger
    ├── computed: isActive
    └── computed: isSelected

SelectOne ──provides──▶ { SELECTION_MODEL: self }
SelectMulti ──provides──▶ { SELECTION_MODEL: self }
RouterSelectOne ──provides──▶ { SELECTION_MODEL: self }
```

Keyboard chain:

`KeyboardTarget.forwardKeydown()` → `DataListKeyboardBridge.onKeydown()` → `DataList.onKeydown()`

---

## 4. Menu System

```
MenuPanel ──hostDir──▶ DataList (inputs: trigger)
    ├── provides: { MENU_PANEL: self }
    ├── inject ──▶ DataList
    ├── inject(opt, self) ──▶ Popover
    ├── signal: submenuTriggers → SubmenuTrigger[]
    ├── input: openDelay (default 300)
    └── output: closeParent

SubmenuTrigger ──hostDir──▶ DataListItem (inputs: disabled)
               ──hostDir──▶ PopoverTrigger (inputs: contentTemplate)
    ├── inject ──▶ MENU_PANEL
    ├── register/unregister in parent MenuPanel
    └── host: enter/open, escape/close, right-arrow/navigate, click/open

Expandable
    └── model: expanded

ExpandOnSelection
    ├── inject ──▶ Expandable
    └── expands when any descendant DataListItem is selected

ExpandOnRoute
    ├── inject ──▶ Router
    ├── inject ──▶ Expandable
    └── expands when route matches
```

---

## 5. Form + Trigger Bridge

```
FormFieldDirective [fiboFormField]
    └── contentChild ──▶ FORM_FIELD (@angular/forms/signals)

FormFieldTrigger [fiboFormFieldTrigger]
    ──hostDir──▶ PopoverTrigger (inputs: contentTemplate)
    ├── inject ──▶ PopoverTrigger
    └── implements FormValueControl<any>

FiboInput [fiboInput]
    └── styling-only primitive
```

---

## 6. Components Layer (composition on top of CDK)

```
Select [fibo-select] ──hostDir──▶ FormUiState
    ├── FieldShell
    ├── button[fiboFieldTarget fieldTargetMode="click"]
    └── createOverlay() + Popover + DataList + SelectOne + DataListItem

MultiSelect [fibo-multi-select] ──hostDir──▶ FormUiState
    ├── FieldShell
    ├── composite trigger[fiboFieldTarget fieldTargetMode="click"]
    ├── chip remove buttons[fiboFieldAction]
    └── createOverlay() + Popover + DataList + SelectMulti + DataListItem + Checkbox

DatePickerField [fibo-datepicker] ──hostDir──▶ FormUiState
    ├── FieldShell
    ├── input[fiboFieldTarget fieldTargetMode="click"]
    └── createOverlay() + Popover + Calendar + SelectDate

Combobox [fibo-combobox] ──hostDir──▶ FormUiState
    ├── FieldShell
    ├── input[fiboFieldTarget]
    └── createOverlay() + Popover + DataList + SelectOne + ComboboxInput + ComboboxList

Menu [fibo-menu] ──hostDir──▶ MenuPanel
    └── recursive submenu template wired via SubmenuTrigger[contentTemplate]
```

Common usage pattern now:

```html
<fibo-field-shell #shell label="Role" iconEnd="chevron-down">
  <button fiboFieldTarget fieldTargetMode="click" type="button">
    {{ selectedLabel() || 'Select role' }}
  </button>
</fibo-field-shell>
```

---

## 7. App Root Overlay Stack

```html
<router-outlet />
<fibo-tooltip-container />
<fibo-confirmation />
<fibo-notification />
<fibo-overlay-outlet />
```

`OverlayOutlet` is the render target for `createOverlay()`-driven overlays (Select, MultiSelect, Combobox, DatePicker, Menu, Dialog, Drawer).

---

## 8. Shared Tokens / Signals

| Token | Provided by | Consumed by |
|------|-------------|-------------|
| `SELECTION_MODEL` | SelectOne / SelectMulti / RouterSelectOne / SelectDate / SelectDateRange | DataListItem, Calendar, Listbox, Table |
| `MENU_PANEL` | MenuPanel | SubmenuTrigger |

Portal plumbing no longer uses a token-based owner contract.

---

## 9. Current Coupling Notes

### Dialog and Drawer use one pattern

- `FiboDialog` and `FiboDrawer` are both used in portal-driven flows (via trigger template composition).
- Opening uses `PopoverTrigger` with `overlayCategory="dialog"` and renders through `<fibo-overlay-outlet>`.

### Overlay layer remains mixed

- Portal-driven: Select, MultiSelect, Menu, DatePicker, Dialog, Drawer, custom popovers.
- Service-driven: Tooltip, Confirmation, Notification.
- This is acceptable, but conventions should stay explicit per component.
