# Popover & Portal

Primitives for building floating UI — dropdowns, menus, tooltips, date pickers — that escape DOM stacking contexts and auto-position via `@floating-ui/dom`.

---

## Concept

Most UI libraries have a single monolithic overlay system that couples positioning, rendering, and open/close logic together. fibo-ui splits this into four small, independent actors that compose freely.

### The Four Actors

```
PopoverTrigger          — owns the isOpen signal; provides PORTAL_OWNER token;
    │                     registers/unregisters template in PortalRegistry when isOpen changes
    │
    ├─ PortalContent    — auto-discovers trigger via PORTAL_OWNER DI token;
    │       │            passes its TemplateRef to the trigger
    │       │
    │   PortalRegistry  — root-level signal Map of open portals (with context)
    │       │
    │   PortalOutlet    — placed once at app root; renders every registered TemplateRef
    │                     with context ({$implicit: trigger})
    │
    └─ Popover          — floating container; reads trigger position via @floating-ui/dom;
                          closes on click-outside and focus-out
```

Each actor is independent. You can use `PortalContent` without a `Popover` (custom drawer-style overlays). You can use `PopoverPosition` without `Popover` (positioning a tooltip that never needs focus-out handling). And both trigger variants — `fiboPopoverTriggerToggle` and `fiboPopoverTriggerClick` — are just thin wrappers over the same `PopoverTrigger` directive.

### Why a Custom Portal System?

The standard approach in Angular is the CDK `Overlay` module — a powerful but heavy abstraction with its own scroll strategies, position strategies, and backdrop factory. fibo-ui's portal system intentionally avoids that dependency:

- **Zero `@angular/cdk` dependency** — the entire implementation is ~150 lines
- **Fully signal-driven** — no `BehaviorSubject`, no zone-based events, no `NgZone.run()`
- **Dead simple mental model** — one signal, one registry service, one outlet component
- **Predictable cleanup** — `PopoverTrigger`'s effect cleanup always unregisters; no zombie overlays

### Escaping Stacking Contexts

The core problem portals solve: a `<div class="overflow-hidden">` parent clips any `position: absolute` child, making dropdowns disappear. The portal system renders floating content as a sibling of `<fibo-portal-outlet>` at the app root — completely outside the component tree that triggered it.

```
Component tree                     Rendered DOM
─────────────────────────────────  ──────────────────────────────────────────
<card style="overflow:hidden">     <card style="overflow:hidden">
  <button fiboPopoverTriggerToggle>  <button aria-expanded="true">…</button>
    <div *fiboPortalContent>       </card>
      <div fiboPopover>…</div>
    </div>                         ← not here
  </button>
</card>

<fibo-portal-outlet>               <fibo-portal-outlet>
  <!-- renders here -->              <div fiboPopover>…</div>  ← here ✓
</fibo-portal-outlet>              </fibo-portal-outlet>
```

---

## Examples

### Action Menu

The most common pattern: a toggle button opens a keyboard-navigable list. `DataList` + `SelectOne` + `DataListItem` are layered on top of the popover infrastructure — each is optional and replaceable.

:::example cdk-popover-basic

```html {example="cdk-popover-basic"}
<button type="button" #trigger="PopoverTrigger" fiboPopoverTriggerToggle class="btn btn-primary">
  Toggle popover
  <ng-template fiboPortalContent let-trigger>
    <div
      fiboPopover
      [trigger]="trigger"
      placement="bottom-start"
      [offset]="8"
      fiboDataList
      fiboSelectOne
      [(value)]="selectedAction"
      (itemTriggered)="onActionTriggered(trigger)"
      class="popover-container min-w-72 p-2"
    >
      @for (action of actions; track action.id) {
        <button fiboDataListItem type="button" [value]="action.id" class="datalist-item w-full text-left">
          <span class="block">{{ action.label }}</span>
          <span class="block text-xs text-foreground-secondary">{{ action.description }}</span>
        </button>
      }
    </div>
  </ng-template>
</button>
<span class="text-sm text-foreground-secondary">Open: {{ trigger.isOpen() ? 'yes' : 'no' }}</span>
```

```ts {example="cdk-popover-basic"}
@Component({
  selector: 'cdk-popover-basic-example',
  imports: [PopoverTriggerToggle, Popover, PortalContent, DataList, DataListItem, SelectOne],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class CdkPopoverBasicExample {
  readonly actions: PopoverAction[] = [
    { id: 'open', label: 'Open details', description: 'Typical action item in overlay content' },
    { id: 'rename', label: 'Rename', description: 'Runs through DataList item trigger flow' },
    { id: 'archive', label: 'Archive', description: 'Popover closes after action trigger' },
  ];

  readonly selectedAction = signal<string>('');

  onActionTriggered(trigger: PopoverTrigger): void {
    trigger.close();
  }
}
```

---

### Custom Content (Profile Card)

The popover works with _any_ HTML content — not just lists. This example shows a profile card rendered inside a `Popover` with no `DataList`. The trigger is a toggle button; the close button inside the card calls `trigger.close()` explicitly.

:::example cdk-popover-info-card

```html {example="cdk-popover-info-card"}
<button type="button" #triggerRef="PopoverTrigger" fiboPopoverTriggerToggle
        class="btn btn-secondary flex items-center gap-2">
  <lucide-icon name="user" size="16" />
  Alex Johnson
  <ng-template fiboPortalContent let-trigger>
    <div fiboPopover [trigger]="trigger" placement="bottom-start" [offset]="8"
         class="popover-container p-4 w-72 flex flex-col gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <lucide-icon name="user" size="18" class="text-primary" />
        </div>
        <div class="min-w-0">
          <div class="font-semibold text-sm">Alex Johnson</div>
          <div class="text-xs text-foreground-secondary truncate">alex@company.io</div>
        </div>
      </div>
      <hr class="border-border-primary" />
      <div class="flex flex-col gap-2 text-sm">
        <div class="flex items-center gap-2 text-foreground-secondary">
          <lucide-icon name="briefcase" size="14" class="shrink-0" />
          <span>Senior Frontend Engineer</span>
        </div>
        <div class="flex items-center gap-2 text-foreground-secondary">
          <lucide-icon name="map-pin" size="14" class="shrink-0" />
          <span>Berlin, Germany</span>
        </div>
      </div>
      <button type="button" class="btn btn-sm btn-primary w-full" (click)="trigger.close()">
        View Profile
      </button>
    </div>
  </ng-template>
</button>
<span class="text-sm text-foreground-secondary">{{ triggerRef.isOpen() ? 'Open' : 'Closed' }}</span>
```

```ts {example="cdk-popover-info-card"}
@Component({
  selector: 'cdk-popover-info-card-example',
  imports: [PopoverTriggerToggle, Popover, PortalContent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class CdkPopoverInfoCardExample {}
```

---

### Placement Variants

`placement` accepts any value from `@floating-ui/dom`: `top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`. The `flip` and `shift` middleware are applied automatically — if there is not enough space the popover flips to the opposite side.

:::example cdk-popover-placements

```html {example="cdk-popover-placements"}
<button type="button" fiboPopoverTriggerToggle class="btn btn-secondary">
  top
  <div *fiboPortalContent="let trigger" fiboPopover [trigger]="trigger"
       placement="top" [offset]="8" class="popover-container px-3 py-2 text-sm">
    placement: <strong>top</strong>
  </div>
</button>

<!-- … same pattern per placement … -->
```

```ts {example="cdk-popover-placements"}
@Component({
  selector: 'cdk-popover-placements-example',
  imports: [PopoverTriggerToggle, Popover, PortalContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class CdkPopoverPlacementsExample {}
```

---

## Composition Patterns

The popover + portal layer is intentionally content-agnostic. The same three directives (`fiboPopoverTriggerToggle`, `fiboPortalContent`, `fiboPopover`) power every floating component in `@fibo-ui/components`:

| Component | What replaces the inner content |
|---|---|
| **Select** | `fiboDataList` + `fiboSelectOne` + `fiboDataListItem × N` |
| **Multi-Select** | `fiboDataList` + `fiboSelectMulti` + `fiboDataListItem × N` + `Checkbox` |
| **DatePicker** | `Calendar` + `SelectDate` |
| **Menu** | `MenuPanel` + `SubmenuTrigger` (recursive) |
| **Tooltip** | Plain `<div>` with text content |

Need a custom popover your design system doesn't provide? Import the three CDK primitives and compose your own.

---

## Trigger Variants

| Directive | Behaviour | Best for |
|---|---|---|
| `fiboPopoverTriggerToggle` | Click → toggle open/close; Escape → close | Dropdowns, menus |
| `fiboPopoverTriggerClick` | Click → open; Escape → close; click again stays open until focus-out | Tooltips, contextual info |
| `[fiboPopoverTrigger]` | No automatic event handling — call `open()`, `close()`, `toggle()` programmatically | Fully custom triggers |

All three expose the same `PopoverTrigger` directive via `exportAs: 'PopoverTrigger'`. Use `#ref="PopoverTrigger"` when you need to read `isOpen()` in the outer template (e.g. for status display).

---

## Advantages

**1. No `@angular/cdk` overhead**
The portal system is ~150 lines of signals code. No scroll strategies, no backdrop factory, no `OverlayContainer` singleton to style.

**2. Escapes stacking contexts reliably**
`PortalOutletComponent` is placed once at the app root. Floating content renders outside any `overflow: hidden` or `transform` ancestor that would otherwise clip it.

**3. Fully composable**
`PopoverTrigger + PortalContent + Popover` is the minimal kernel. Add `DataList` for keyboard navigation. Add `SelectOne` for selection semantics. Add `DataListItem` for individual items. None of these layers know about each other — they communicate through Angular's DI.

**4. Signals-native**
`isOpen` is a plain `Signal<boolean>`. No subscriptions, no `async` pipe, no `BehaviorSubject`. The trigger's effect reacts to it automatically with `OnPush`.

**5. ARIA wired automatically**
`PopoverTrigger` sets `aria-expanded` on its host element. `DataList` manages `aria-activedescendant`. `DataListItem` sets `aria-selected` and `aria-disabled`. Keyboard handling (Arrow keys, Enter, Escape) is built into `DataList`, not the popover.

**6. Auto-repositions on resize**
`PopoverPosition` uses `ResizeObserver` on both the trigger and the floating element, plus a `window resize` listener. The popover follows its trigger when the layout shifts.

**7. Multiple portals simultaneously**
`PortalRegistry` is a `Map<id, PortalEntry>`. Multiple popovers can be open at the same time (e.g., a menu with a submenu), each rendered independently through `PortalOutletComponent`.

---

## API Reference

### PopoverTrigger

Base directive. Use via `fiboPopoverTriggerToggle` or `fiboPopoverTriggerClick`.

| Member | Type | Description |
|---|---|---|
| `isOpen` | `Signal<boolean>` | Current open state |
| `open()` | `() => void` | Open the popover |
| `close()` | `() => void` | Close the popover |
| `toggle()` | `() => void` | Toggle open / close |
| `popover` | `Signal<Popover \| null>` | Reference to the active `Popover` directive (set by Popover on init) |
| `element` | `HTMLElement` | Native host element |

### PortalContent

Selector: `ng-template[fiboPortalContent]`

Auto-discovers the nearest `PopoverTrigger` (or any `PORTAL_OWNER` provider) via DI and passes its `TemplateRef` to it. No inputs needed — just place the `<ng-template>` inside a trigger element.

Usage: `*fiboPortalContent="let trigger"` or `<ng-template fiboPortalContent let-trigger>`. The `trigger` variable is the `PopoverTrigger` instance, passed via template context.

### Popover

Selector: `[fiboPopover]`

Composes `PopoverPosition` (positioning) and `ClickOutside` (close on outside click).

| Input | Type | Default | Description |
|---|---|---|---|
| `trigger` | `PopoverTrigger` | **required** | The trigger that controls this popover |
| `placement` | `Placement` | `'bottom'` | Floating UI placement string |
| `offset` | `number` | `5` | Distance from trigger in px |
| `matchWidth` | `boolean` | `false` | Match the trigger element's width |
| `referenceElement` | `HTMLElement` | — | Override the anchor element (defaults to trigger's host) |

### PopoverPosition

Selector: `[fiboPopoverPosition]`

Standalone positioning directive — use directly when you need positioning without focus-out / click-outside handling.

Same inputs as `Popover`: `trigger`, `placement`, `offset`, `matchWidth`, `referenceElement`.

### PortalRegistry

Root-level service (`providedIn: 'root'`).

| Member | Type | Description |
|---|---|---|
| `openPortalsList` | `Signal<PortalEntry[]>` | Computed list of currently open portals |
| `register(id, templateRef, context?)` | method | Called by `PopoverTrigger` when opening |
| `unregister(id)` | method | Called by `PopoverTrigger` effect cleanup when closing |

### PopoverArrow

Selector: `[PopoverArrow]`

Add inside a `[fiboPopoverPosition]` element to render a positioned arrow indicator. Uses `contentChild` to locate itself and feeds arrow data back into the middleware chain.
