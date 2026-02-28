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
    │     └── register/unregister in PortalRegistry
    │         with context: {$implicit: this}
    └── owns portal lifecycle

PortalRegistry (root service)
    └── signal: Map<id, { templateRef, context? }>

PortalOutlet ──inject──▶ PortalRegistry
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
    ├── inject ──▶ PortalRegistry
    ├── signal: isOpen
    ├── signal: popover → Popover | null
    ├── signal: keydownDelegate → KeydownDelegate | null
    ├── host: tabindex / aria-expanded / keydown / focusout
    └── onKeydown → keydownDelegate()?.onKeydown()

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
    ├── model: trigger → PopoverTrigger
    │     └── effect: registers self as trigger.keydownDelegate
    ├── model: options → DataListItem[]
    ├── signal: activeDataListItem
    ├── output: itemTriggered
    └── keyboard: ArrowUp/Down, Enter, Escape

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

`PopoverTrigger.onKeydown()` → `keydownDelegate` → `DataList.onKeydown()`

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
Select [fibo-select] ──hostDir──▶ PopoverTrigger
    ├── trigger: fiboPopoverTriggerToggle [contentTemplate]="selectTpl"
    └── template: Popover + DataList + SelectOne + DataListItem

MultiSelect [fibo-multi-select] ──hostDir──▶ PopoverTrigger
    ├── trigger: fiboPopoverTriggerToggle [contentTemplate]="multiSelectTpl"
    └── template: Popover + DataList + SelectMulti + DataListItem + Checkbox

DatePickerField [fibo-datepicker]
    ├── trigger: fiboPopoverTriggerClick [contentTemplate]="calendarTpl"
    └── template: Popover + Calendar + SelectDate

Menu [fibo-menu] ──hostDir──▶ MenuPanel
    └── recursive submenu template wired via SubmenuTrigger[contentTemplate]
```

Common usage pattern now:

```html
<button fiboPopoverTriggerToggle [contentTemplate]="menuTpl">Open</button>
<ng-template #menuTpl let-trigger>
  <fibo-menu fiboPopover [trigger]="trigger" [items]="items" />
</ng-template>
```

---

## 7. App Root Overlay Stack

```html
<router-outlet />
<fibo-tooltip-container />
<fibo-drawer />
<fibo-confirmation />
<fibo-notification />
<fibo-portal-outlet />
```

`PortalOutlet` is the render target for portal-based overlays (Select, Menu, DatePicker, any component using `PopoverTrigger + contentTemplate`).

---

## 8. Shared Tokens / Signals

| Token | Provided by | Consumed by |
|------|-------------|-------------|
| `SELECTION_MODEL` | SelectOne / SelectMulti / RouterSelectOne / SelectDate / SelectDateRange | DataListItem, Calendar, Listbox, Table |
| `MENU_PANEL` | MenuPanel | SubmenuTrigger |

Portal plumbing no longer uses a token-based owner contract.

---

## 9. Current Coupling Notes

### Dialog still has two patterns

- `FiboDialog` is used in portal-driven flows (via trigger template composition).
- `DialogService + DialogTrigger` service flow still exists in code.
- Root service-rendered `<fibo-dialog>` is currently not active in `app.html`.

### Overlay layer remains mixed

- Portal-driven: Select, MultiSelect, Menu, DatePicker, custom popovers.
- Service-driven: Drawer, Tooltip, Confirmation, Notification.
- This is acceptable, but conventions should stay explicit per component.
