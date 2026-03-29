# Overlay System

Full architecture and API reference for `@fibo-ui/cdk`.

## Runtime Model

The overlay runtime is config-driven and signal-driven.

- Entry point: `createOverlay(isOpen, config, setup?)`
- Global coordinator: `OverlayStack`
- Render host: `OverlayStackOutlet` (components layer)
- Runtime object per open overlay: `OverlayHandle`
- Lifecycle API for one open cycle: `OverlaySession`

Shell routing is token-based: each config carries `shell: InjectionToken<Type<any>>`.
The outlet resolves the shell component via `injector.get(handle.config.shell)`.

## Core API

### `createOverlay(...)`

```ts
createOverlay(
  isOpen: WritableSignal<boolean>,
  config: OverlayConfig | Signal<OverlayConfig | null | undefined> | null | undefined,
  setup?: (overlay: OverlaySession) => void,
): Signal<OverlayHandle | null>
```

- Opens when `isOpen()` becomes `true` and config has `templateRef`.
- Closes when `isOpen()` becomes `false` or close is requested.
- Auto-applies `trapOverlayFocus({ guard: true })` when `config.trapFocus === true`.
- Auto-applies `restoreTriggerFocusOnClose` when `config.restoreFocus === true`.
- Keeps `templateRef`, `referenceElement`, `focusReturnTarget` synced while open.
- Supports close guards via `overlay.canClose(...)`.

### `OverlayConfig`

Flat config object — one type for all overlay kinds.

```ts
interface OverlayConfig {
  readonly templateRef: TemplateRef<any>;
  readonly position: OverlayPositionConfig;      // GlobalPosition | ConnectedPosition | CoordinatePosition
  readonly shell: InjectionToken<Type<any>>;      // resolved to shell component by outlet
  readonly tag?: string;                          // freeform tag, e.g. 'menu' for closeAllByTag

  // Close policies
  readonly needsBackdrop?: boolean;
  readonly closeOnEscape?: boolean;              // default: true (closeTopmost skips if false)
  readonly closeOnOutsideClick?: boolean;
  readonly closeOnFocusLeave?: boolean;
  readonly closeOnScroll?: boolean;
  readonly blockScroll?: boolean;

  // Session behaviors (auto-applied in createOverlay)
  readonly trapFocus?: boolean;                  // calls trapOverlayFocus({ guard: true })
  readonly restoreFocus?: boolean;               // calls restoreTriggerFocusOnClose

  // Reference elements
  readonly referenceElement?: HTMLElement | null;
  readonly focusReturnTarget?: HTMLElement | null;
}
```

### Position types

```ts
type OverlayPositionConfig = GlobalPosition | ConnectedPosition | CoordinatePosition;

globalPosition()                           // for modals, drawers
connectedPosition(options?)                // for popovers, menus, tooltips
coordinatePosition(x, y, options?)         // for context menus
```

`ConnectedPosition` options: `placement?`, `matchWidth?`, `offset?`

### Shell tokens (CDK)

```ts
MODAL_SHELL_TOKEN        // OverlayModalShellComponent
CONNECTED_SHELL_TOKEN    // OverlayConnectedShellComponent
NOTIFICATION_SHELL_TOKEN // OverlayPlainShellComponent
DRAWER_SHELL_TOKEN       // app-provided (use withShell)
```

Tokens throw a clear error if not provided. Register defaults via `provideOverlays()`.

### `OverlayHandle`

Runtime object for one currently open overlay.

```ts
interface OverlayHandle {
  readonly id: string;
  readonly config: OverlayConfig;
  readonly zIndex: number;
  readonly templateRef: TemplateRef<any> | undefined;
  readonly referenceElement: HTMLElement | null | undefined;
  readonly interactionRoot: HTMLElement | null | undefined;
  readonly focusReturnTarget: HTMLElement | null | undefined;
  readonly closed: boolean;
  close(reason?: OverlayCloseReason): void;
  setInteractionRoot(root: HTMLElement | null): void;
}
```

### `OverlaySession`

Temporary lifecycle API inside `setup(...)`.

- `requestClose(reason, event?)`
- `afterOpened(handler)`
- `beforeClose(handler)` — runs before isOpen flips to false
- `afterClose(handler)` — runs after leave animation
- `canClose(guard)`
- `effect(runner)`
- `onCleanup(cleanup)`
- `findOverlayContainerId(target)`
- `isInOverlayBranch(target)`

### Close reasons

```ts
type OverlayCloseReason =
  | 'programmatic'
  | 'escape'
  | 'focusout'
  | 'outside-click'
  | 'blur'
  | 'state'
  | 'destroy';
```

## Behavior Model

### DOM behaviors — applied by `OverlayContainer` directive (`ngOnInit`)

`OverlayContainer` reads flat booleans from `handle.config`:

| Config flag | Behavior |
|---|---|
| `blockScroll` | Locks document scroll (reference-counted for nesting) |
| `closeOnOutsideClick` | Closes on click outside `interactionRoot` and overlay branch |
| `closeOnFocusLeave` | Closes on focus leaving `interactionRoot` and overlay branch |
| `closeOnScroll` | Closes on document scroll outside overlay container |

### Session behaviors — auto-applied by `createOverlay`

| Config flag | Applied behavior |
|---|---|
| `trapFocus: true` | `trapOverlayFocus(session, { guard: true })` |
| `restoreFocus: true` | `restoreTriggerFocusOnClose(session)` |

These are still importable and callable directly in `setup` for custom options.

### `trapOverlayFocus(overlay, options?)`

- Autofocuses on open (via `afterOpened`)
- Cyclic Tab/Shift+Tab inside overlay container
- `guard: true` — prevents focus escaping (for modals)
- Use `[fiboFocusInitial]` to override initial focus target

### `restoreTriggerFocusOnClose(overlay)`

- Registers `beforeClose` hook
- Restores focus to reference/interaction element when focus was inside at close time

## `OverlayStack` API

```ts
overlayStack.openOverlayList()       // Signal<OverlayHandle[]>
overlayStack.topmost()               // Signal<OverlayHandle | null>
overlayStack.closeTopmost()          // closes top overlay where config.closeOnEscape !== false
overlayStack.closeAllByTag(tag)      // closes all overlays with matching config.tag
overlayStack.completeAfterClose(id)  // called by shell panel after leave animation
```

## Shell Architecture

### `OverlayStackOutlet`

Renders the active overlay list. Resolves shell via `injector.get(handle.config.shell)`.
Shows backdrop if `handle.config.needsBackdrop`.

```html
@for (overlay of overlayStack.openOverlayList(); track overlay.id) {
  @if (needsBackdrop(overlay)) {
    <fibo-overlay-backdrop-shell [handle]="overlay" />
  }
  <ng-container
    [ngComponentOutlet]="resolveShell(overlay)"
    [ngComponentOutletInputs]="{ handle: overlay }"
  />
}
```

### Shell components

Each shell has `hostDirectives: [OverlayShellHost, OverlayContainer, ...]` and carries:
- `data-overlay-container-id` — for branch tracking
- `animate.enter` / `animate.leave` — animation class names
- Shell calls `overlayStack.completeAfterClose(id)` on leave animation end

Available shells:
- `OverlayModalShellComponent` — fixed centered, scale animation
- `OverlayConnectedShellComponent` — absolute positioned via `OverlayPosition` directive
- `OverlayPlainShellComponent` — display:contents, no styling (notification containers)
- `OverlayBackdropShellComponent` — semi-transparent fullscreen backdrop
- `OverlayDrawerShellComponent` — slide-in from right (app must register via `withShell`)

### `OverlayPosition` directive

Used by `OverlayConnectedShellComponent`. Reads `handle.config.position`:

- `type: 'connected'` — uses `referenceElement` + `autoUpdate` from floating-ui
- `type: 'coordinate'` — uses virtual element at `(x, y)` for context menus

Applies `placement`, `matchWidth`, `offset` from the position config.

## Bootstrap

```ts
// app.config.ts
provideOverlays(
  withShell(DRAWER_SHELL_TOKEN, DrawerShellComponent)  // only needed if using drawers
)
```

`provideOverlays()` registers `MODAL_SHELL_TOKEN`, `CONNECTED_SHELL_TOKEN`, `NOTIFICATION_SHELL_TOKEN` with the library defaults. Custom shells via `withShell(token, component)`.

## Z-Index and Stacking

All overlays are assigned incrementing z-indices from base 1000. Visual stacking follows DOM insertion order (outlet renders in `openOverlayList()` order).

Escape handling is centralized:
- `document:keydown.escape` → `overlayStack.closeTopmost()`
- Skips overlays where `config.closeOnEscape === false`

## Nested Overlay Branches

When an overlay opens from inside another overlay container, it becomes part of that parent branch.

- Click inside child overlay is not treated as outside click for parent
- Focus moving from parent to child is not treated as focus-leave
- `isOverlayInBranch(ownerOverlayId, targetOverlayId)` traverses parent chain

## Lifecycle

1. `isOpen` → `true`
2. Overlay opens when `templateRef` is ready (pending effect if config not ready)
3. DOM behaviors attached in `OverlayContainer.ngOnInit()`
4. Session behaviors auto-applied from config, then `setup(session)` runs
5. `afterOpened` fires after first render
6. Close requested (any reason)
7. `beforeClose` hooks run (focus restore)
8. `isOpen` → `false`
9. Shell leave animation plays
10. `afterClose` handlers run

## Current Rules

- `isOpen` is source of truth — never call `overlay.close()` when you mean `isOpen.set(false)`.
- Use `OverlayConfig` flat objects or presets from `@fibo-ui/components`.
- DOM behaviors (blockScroll, closeOnOutside, etc.) are config booleans — `OverlayContainer` attaches them automatically.
- Focus behaviors (`trapFocus`, `restoreFocus`) can be set on config or called manually in `setup`.
- `setup` callback is for app-specific logic: `canClose`, `afterClose`, `beforeClose`, custom effects.
- Keep animations on shell roots (`animate.enter` / `animate.leave`).
- Use `fiboOverlayPanel` + title/description directives for modal semantics.
