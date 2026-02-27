# CDK Composition Map

Complete directive/component dependency graph for `@fibo-ui/cdk` and `@fibo-ui/components`.

---

## Dependency Graph Legend

- `──hostDir──▶` — composed via `hostDirectives`
- `──inject──▶` — injected via `inject()`
- `──provides──▶` — provides token for children
- `(opt)` — optional injection
- `(self)` — self-only injection
- `(skipSelf)` — parent-only injection

---

## 1. Portal System

```
PortalContent
    ├── inject ──▶ PortalRegistry
    ├── inject ──▶ TemplateRef
    └── model: isOpen (bound via [(isOpen)]="trigger.isOpen" in templates)

PortalOutlet ──inject──▶ PortalRegistry
    └── renders: openPortalsList → ngTemplateOutlet

PortalRegistry (root service)
    └── signal: Map<id, {templateRef}>
```

**Design:** Portal is a generic infrastructure layer with no knowledge of popover or trigger.
The `isOpen` model is two-way bound to `trigger.isOpen` at the template level.

---

## 2. Popover System

```
PopoverTrigger
    ├── inject(opt, self) ──▶ DataListItem   (checks if trigger is a list item)
    ├── signal: isOpen
    ├── signal: popover → Popover (set by Popover.ngOnInit)
    ├── signal: keydownDelegate → KeydownDelegate | null
    ├── host: [tabindex], [aria-expanded], (keydown), (focusout)
    └── onKeydown → delegates to keydownDelegate()?.onKeydown()

PopoverTriggerClick ──hostDir──▶ PopoverTrigger
    ├── inject ──▶ PopoverTrigger
    └── host: click → open, enter → open, escape → close

PopoverTriggerToggle ──hostDir──▶ PopoverTrigger
    ├── inject ──▶ PopoverTrigger
    └── host: click → toggle, escape → close

Popover ──hostDir──▶ PopoverPosition (inputs: placement, matchWidth, trigger, referenceElement, offset)
        ──hostDir──▶ ClickOutside (outputs: clickOutside)
    ├── input(required): trigger → PopoverTrigger
    ├── ngOnInit: trigger.popover.set(this)
    └── ngOnDestroy: trigger.popover.set(null)

PopoverPosition
    ├── input: trigger → PopoverTrigger (for reference element)
    ├── input: referenceElement → HTMLElement (alternative)
    ├── contentChild ──▶ PopoverArrow
    └── uses: @floating-ui/dom autoUpdate + computePosition

PopoverArrow
    └── inject ──▶ PopoverPosition (reads position signal)
```

**Key chain:** `PopoverTrigger.onKeydown()` → `this.keydownDelegate()` → `DataList.onKeydown()`
DataList registers itself as `trigger.keydownDelegate` via an effect when its `trigger` model is set.

---

## 3. DataList + Selection

```
DataList
    ├── provides: { DATA_LIST: self }
    ├── model: trigger → PopoverTrigger (for Escape → close + focus)
    │     └── effect: registers self as trigger.keydownDelegate
    ├── model: options → DataListItem[]
    ├── signal: activeDataListItem
    ├── output: itemTriggered
    └── keyboard: ArrowUp/Down → navigate, Enter → select, Escape → close

DataListItem
    ├── inject ──▶ DataList (parent)
    ├── inject(opt) ──▶ SELECTION_MODEL
    ├── input: value<T>
    ├── output: itemTrigger
    ├── computed: isActive (from DataList.activeDataListItem)
    ├── computed: isSelected (from SELECTION_MODEL)
    └── host: [aria-selected], [aria-disabled], [data-active], mouseenter, click

SelectOne ──provides──▶ { SELECTION_MODEL: self }
    ├── model: value<T | null>
    └── implements: SelectionModel<T>

SelectMulti ──provides──▶ { SELECTION_MODEL: self }
    ├── model: value<T[] | null>
    └── implements: SelectionModel<T>
```

**Injection chain:** `SelectOne/SelectMulti` provides `SELECTION_MODEL` → `DataListItem` injects it → calls `selectionModel.select(value)` on click/Enter

---

## 4. Menu System

```
MenuPanel ──hostDir──▶ DataList (inputs: trigger)
    ├── provides: { MENU_PANEL: self }
    ├── inject ──▶ DataList
    ├── inject(opt, self) ──▶ Popover
    ├── signal: submenuTriggers → SubmenuTrigger[]
    ├── input: openDelay (300ms)
    ├── output: closeParent
    └── watches: DataList.activeDataListItem → scheduleOpen/Close submenu

SubmenuTrigger ──hostDir──▶ DataListItem (inputs: disabled)
               ──hostDir──▶ PopoverTrigger
    ├── inject ──▶ PopoverTrigger
    ├── inject ──▶ DataListItem
    ├── inject ──▶ MENU_PANEL (parent MenuPanel)
    ├── ngOnInit: panel.registerSubmenuTrigger(this)
    ├── ngOnDestroy: panel.unregisterSubmenuTrigger(this)
    └── host: enter → open, escape → close, ArrowRight → keydownDelegate.navigateNext

Expandable
    └── model: expanded (boolean)

ExpandOnSelection
    ├── inject ──▶ Expandable (host)
    ├── contentChildren ──▶ DataListItem[]
    └── effect: expands if any child item is selected

ExpandOnRoute
    ├── inject ──▶ Router
    ├── inject ──▶ Expandable (host)
    ├── input: items, routes
    └── effect: expands if current route matches
```

**Menu hierarchy chain:**
```
MenuPanel (parent)
  ├── DataList (via hostDir)
  │     └── manages keyboard nav for menu items
  ├── SubmenuTrigger (child item)
  │     ├── DataListItem (via hostDir) → item in parent DataList
  │     ├── PopoverTrigger (via hostDir) → opens submenu portal
  │     └── registers in parent MenuPanel
  └── scheduleOpen/Close based on activeDataListItem
        └── 300ms delay prevents flicker
```

---

## 5. Form System

```
FormFieldDirective [fiboFormField]
    └── contentChild ──▶ FORM_FIELD (@angular/forms/signals)

FormFieldTrigger [fiboFormFieldTrigger] ──hostDir──▶ PopoverTrigger
    ├── inject ──▶ PopoverTrigger
    └── implements: FormValueControl<any>

FiboInput [fiboInput]
    └── pure styling, no dependencies
```

---

## 6. Components: Overlay Layer

```
FiboDialog
    ├── imports: FocusTrap
    ├── model: isOpen
    ├── static: openCount (tracks multiple dialogs)
    └── template: fiboFocusTrap, role="dialog", aria-modal

DialogService (root) ── signal: content (TemplateRef)
DialogTrigger ──inject──▶ DialogService

FiboDrawer
    ├── imports: FocusTrap
    └── inject ──▶ DrawerService

DrawerService (root) ── signal: content (TemplateRef)
DrawerTrigger ──inject──▶ DrawerService

Tooltip [fiboTooltip]
    └── inject ──▶ TooltipService

TooltipService (root) ── signal: tooltipRef, delays
TooltipContainer
    ├── imports: PopoverPosition, PopoverArrow
    └── inject ──▶ TooltipService

Notifier (root) ── signal: notifications[]
Notification ──inject──▶ Notifier

ConfirmationService (root) ── signal: config
ConfirmationTrigger ──inject──▶ ConfirmationService
FiboConfirmation ──inject──▶ ConfirmationService
```

**Two overlay patterns:**
| Pattern | Used by | Rendering |
|---------|---------|-----------|
| Portal-based | Select, MultiSelect, Menu, DatePicker, Dialog (FiboDialog) | PortalContent → PortalRegistry → PortalOutlet |
| Service-based | Drawer, Tooltip, Confirmation, Notification | Service signal → Component in app.html |

---

## 7. Components: Form Controls

```
Select [fibo-select] ──hostDir──▶ PopoverTrigger
    ├── template uses: PopoverTriggerToggle, PortalContent, Popover,
    │                  DataList, SelectOne, DataListItem, FormFieldControl
    └── implements: FormValueControl<string | number | null>

MultiSelect [fibo-multi-select] ──hostDir──▶ PopoverTrigger
    ├── template uses: PopoverTriggerToggle, PortalContent, Popover,
    │                  DataList, SelectMulti, DataListItem, Checkbox, FormFieldControl
    └── implements: FormValueControl<(string | number)[] | null>

DatePickerField [fibo-datepicker] ──hostDir──▶ PopoverTriggerClick
    ├── template uses: FormFieldControl, Popover, PortalContent, Calendar, SelectDate
    └── implements: FormValueControl<string>

TextField [fibo-text-field]
    ├── template uses: FormFieldControl
    └── implements: FormValueControl<string>

Checkbox [fibo-checkbox]
    └── implements: FormCheckboxControl

Switch [fibo-switch]
    └── implements: FormCheckboxControl

FormFieldControl [fibo-form-field-control]
    ├── implements: FormValueControl<unknown>
    └── template: label, icons, clear button, error message, <ng-content>

Calendar [fibo-calendar] ──hostDir──▶ DataList
    ├── inject(self) ──▶ SELECTION_MODEL
    └── template: DataListItem buttons for each date

Listbox [fibo-listbox] ──hostDir──▶ DataList
    ├── inject ──▶ SELECTION_MODEL
    └── template: DataListItem with optional Checkbox
```

---

## 8. Components: Menu

```
Menu [fibo-menu] ──hostDir──▶ MenuPanel (outputs: closeParent)
    ├── inject ──▶ MenuPanel
    ├── input: items, menuContent
    └── template: SubmenuTrigger + DataListItem + PortalContent + Popover (recursive)

MenuItem [fiboMenuItem] ──hostDir──▶ DataListItem (inputs: disabled; outputs: itemTrigger)
    ├── inject ──▶ Menu (parent)
    └── itemTrigger → menu.menuPanel.closeMenuWithParent()

SideMenuGroup ──hostDir──▶ DataList
              ──hostDir──▶ Expandable
              ──hostDir──▶ ExpandOnSelection
    ├── inject ──▶ Expandable
    ├── inject(opt, skipSelf) ──▶ SideMenuGroup (parent nesting)
    └── computed: level (nesting depth)

SideMenuItem
    ├── inject(opt) ──▶ SideMenuGroup (parent)
    └── template: DataListItem

CollapseSubmenuItem ──hostDir──▶ DataListItem (inputs: disabled)
                    ──hostDir──▶ Expandable
                    ──hostDir──▶ ExpandOnRoute (inputs: items)
    └── inject ──▶ Expandable

TreeMenu [fibo-tree-menu]
    └── template: DataListItem, CollapseSubmenuItem, TreeMenuChain (recursive)

TreeMenuChain [fibo-tree-menu-chain]
    └── inputs: index, isGroup, isActive, collapsable, collapsed, totalItems
```

---

## 9. App Root Overlay Stack

```html
<!-- app.html — order matters for z-index -->
<router-outlet />
<fibo-tooltip-container />     ← TooltipService
<fibo-drawer />                ← DrawerService
<fibo-confirmation />          ← ConfirmationService
<fibo-notification />          ← Notifier
<fibo-portal-outlet />         ← PortalRegistry (Select, Menu, Dialog, DatePicker)
```

---

## 10. Shared Injection Tokens

| Token | Provided by | Consumed by |
|-------|-------------|-------------|
| `SELECTION_MODEL` | SelectOne, SelectMulti, SelectDate | DataListItem, Calendar, Listbox, Table |
| `MENU_PANEL` | MenuPanel | SubmenuTrigger |
| `DATA_LIST` | DataList | (internal) |

---

## 11. Known Coupling Issues

### Dialog: two mechanisms
- `FiboDialog` — portal-based, `PortalContent` + `PortalOutlet`
- `DialogService` + `DialogTrigger` — service-based, component in app.html
- **Fix:** Consolidate to one approach

### Overlay rendering: two patterns
- Portal-based: Select, Menu, DatePicker, Dialog
- Service-based: Drawer, Tooltip, Confirmation, Notification
- **Future:** Unify under portal system

### FiboDialog static counter
- `static openCount` tracks open dialogs globally
- Fragile, doesn't survive HMR, no z-index management
- **Future:** Replace with OverlayStack service
