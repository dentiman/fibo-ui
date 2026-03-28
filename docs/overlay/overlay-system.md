# Overlay System (Current)

This document describes the current overlay runtime in `@fibo-ui/cdk`.

It covers only active architecture and APIs.

## 1) Runtime Model

The runtime is strategy-driven and signal-driven.

- Entry point: `createOverlay(isOpen, strategy, setup?)`
- Global coordinator: `OverlayStack`
- Render host: `OverlayContainerComponent`
- Runtime object per open overlay: `OverlayHandle`
- Lifecycle API for one open cycle: `OverlaySession`

Current rendering is shell-based:

- `OverlayConnectedShellComponent` for `connected | menu | tooltip`
- `OverlayModalShellComponent` for `modal`
- `OverlayPlainShellComponent` fallback

There is no extra `overlay-layer` wrapper in container template now. Shell roots carry overlay identity (`data-overlay-container-id`) and z-index.

## 2) Core API

### `createOverlay(...)`

Defined in `projects/fibo-ui/cdk/src/lib/overlay/overlay-stack.ts`.

```ts
createOverlay(
  isOpen: WritableSignal<boolean>,
  strategy: OverlayStrategy | Signal<OverlayStrategy | null | undefined> | null | undefined,
  setup?: (overlay: OverlaySession) => void,
): Signal<OverlayHandle | null>
```

Behavior:

- Opens when `isOpen()` becomes `true` and strategy has `templateRef`.
- Closes when `isOpen()` becomes `false` or close is requested.
- Keeps render config synced while overlay is open.
- Supports close guards with `overlay.canClose(...)`.

### `OverlayHandle`

Defined in `projects/fibo-ui/cdk/src/lib/overlay/overlay-handle.ts`.

Important fields:

- `id: string`
- `category: 'popover' | 'menu' | 'dialog' | 'tooltip' | 'confirmation' | 'notification'`
- `zIndex: number`
- `templateRef`, `referenceElement`, `interactionRoot`, `focusReturnTarget`
- `strategy: OverlayStrategy`
- `closed: boolean`

Methods:

- `close(reason?: OverlayCloseReason)`
- `setInteractionRoot(root: HTMLElement | null)`

### `OverlaySession`

Defined in `projects/fibo-ui/cdk/src/lib/overlay/overlay-session.ts`.

Use this API inside `setup` only.

- `requestClose(reason, event?)`
- `afterOpened(handler)`
- `beforeClose(handler)`
- `afterClose(handler)`
- `canClose(guard)`
- `effect(runner)`
- `onCleanup(cleanup)`
- `findOverlayContainerId(target)`
- `isInOverlayBranch(target)`

### Close reasons

Defined in `projects/fibo-ui/cdk/src/lib/overlay/overlay-types.ts`.

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

## 3) Strategy Presets

Defined in `projects/fibo-ui/cdk/src/lib/overlay/overlay-strategy.ts`.

Kinds:

```ts
type OverlayStrategyKind = 'connected' | 'modal' | 'menu' | 'tooltip' | 'notification';
```

Factories:

- `connectedOverlay(options)` — category: `popover`, defaultBehaviors: `closeOnOutsideClick`, `closeOnFocusLeave`, `restoreTriggerFocusOnClose`
- `modalOverlay(options)` — category: `dialog`, defaultBehaviors: `blockScroll`, `closeOnOutsideClick`, `trapOverlayFocus`, `restoreTriggerFocusOnClose`
- `menuOverlay(options)` — category: `menu`, defaultBehaviors: `closeOnOutsideClick`, `closeOnFocusLeave`, `restoreTriggerFocusOnClose`
- `tooltipOverlay(options)` — category: `tooltip`, defaultBehaviors: `closeOnScroll`
- `notificationOverlay(options)` — category: `notification`, defaultBehaviors: none

Notes:

- `menuOverlay` default placement is `right-start`, default offset is `1`.
- `defaultBehaviors` is declarative metadata consumed by `OverlayContainer` directive.

## 4) Behavior Helpers

Defined in `projects/fibo-ui/cdk/src/lib/overlay/overlay-behaviors.ts`.

### Auto-applied by `OverlayContainer` (based on `defaultBehaviors`)

These are **not** called in `setup` — `OverlayContainer` directive reads `strategy.defaultBehaviors`
and attaches them automatically when the shell renders:

- `blockScroll` — locks document scroll (reference-counted for nested modals)
- `closeOnOutsideClick` — closes on click outside `interactionRoot` and overlay branch
- `closeOnFocusLeave` — closes on focus leaving `interactionRoot` and overlay branch
- `closeOnScroll` — closes when document scrolls outside the overlay container (tooltips)

### Used in `setup` callback (focus lifecycle, needs `OverlaySession` hooks)

- `restoreTriggerFocusOnClose(overlay)` — registers `beforeClose` hook, restores focus to trigger when focus was inside at close time
- `trapOverlayFocus(overlay, options?)` — auto-focus on open, cyclic Tab loop, modal focus guard

How safe zone checks work (in `OverlayContainer`):

- Compare event target with `handle.referenceElement` and `elementRef.nativeElement`.
- Respect nested branch boundaries using `overlayStack.isOverlayInBranch(id, targetId)`.

## 5) Rendering and Animation Lifecycle

Container template (`projects/fibo-ui/cdk/src/lib/overlay/overlay-container.html`) renders shell components directly:

```html
@for (overlay of overlayStack.openOverlayList(); track overlay.id) {
  <ng-container
    [ngComponentOutlet]="shellComponent(overlay)"
    [ngComponentOutletInjector]="overlayInjector(overlay)"
  ></ng-container>
}
```

Animation ownership is on shell roots:

- `OverlayConnectedShellComponent`: `animate.enter="overlay-connected-enter"`, `animate.leave="overlay-connected-leave"`
- `OverlayModalShellComponent`: `animate.enter="overlay-modal-enter"`, `animate.leave="overlay-modal-leave"`

On leave animation end, shell calls:

```ts
overlayStack.completeAfterClose(handle.id)
```

This finalizes deferred `afterClose` handlers for strategies that wait for leave animation.

## 6) Z-Index and Escape

`OverlayStack` uses category tiers:

- dialog: 500
- confirmation: 600
- popover/menu: 1000
- tooltip: 2000
- notification: 3000

Escape handling is centralized in `OverlayContainerComponent` host:

- `document:keydown.escape -> overlayStack.closeTopmost()`
- skips closing `notification` and `tooltip` categories.

## 7) Accessibility API

Defined in `projects/fibo-ui/cdk/src/lib/overlay/overlay-panel.ts`.

- `[fiboOverlayPanel]`
  - sets `data-dialog-panel`
  - wires `role`, `aria-modal`, `aria-labelledby`, `aria-describedby`
- `[fiboOverlayTitle]`
- `[fiboOverlayDescription]`

Use for dialog-like overlays.

## 8) High-Level Trigger APIs

### Popover trigger directives

Defined in `projects/fibo-ui/cdk/src/lib/popover/popover-trigger.ts`.

- `[fiboPopoverTrigger]` (base)
- `[fiboPopoverTriggerClick]`
- `[fiboPopoverTriggerToggle]`

Supported inputs on trigger directives:

- `content: TemplateRef<any>`
- `strategyKind: 'connected' | 'menu'`
- `placement: Placement`
- `offset: number`
- `matchWidth: boolean`
- `delegatesFocus: boolean`

### Menu panel directives

Defined in `projects/fibo-ui/cdk/src/lib/menu/menu-panel.ts` and `submenu-trigger.ts`.

- `MenuPanel` coordinates submenu trigger registry and open/close delays.
- `SubmenuTrigger` opens submenu via `createOverlay(..., menuOverlay(...))` directly.

## 9) Usage Examples

### Connected overlay (custom popover)

`closeOnOutsideClick`, `closeOnFocusLeave` are auto-applied by `OverlayContainer` via `defaultBehaviors`.
Only `restoreTriggerFocusOnClose` stays in setup (needs `beforeClose` hook).

```ts
readonly strategy = computed(() => {
  const templateRef = this.popoverTpl();
  if (!templateRef) return null;

  return connectedOverlay({
    templateRef,
    referenceElement: this.triggerEl.nativeElement,
    placement: 'bottom-start',
    matchWidth: true,
  });
});

readonly overlayHandle = createOverlay(this.isOpen, this.strategy, overlay => {
  restoreTriggerFocusOnClose(overlay);
});
```

### Modal overlay

`blockScroll`, `closeOnOutsideClick` are auto-applied. `trapOverlayFocus` and `restoreTriggerFocusOnClose`
stay in setup (need `afterOpened` and `beforeClose` hooks).

```ts
readonly strategy = computed(() => {
  const templateRef = this.dialogTpl();
  if (!templateRef) return null;

  return modalOverlay({
    templateRef,
    referenceElement: this.triggerEl.nativeElement,
  });
});

readonly overlayHandle = createOverlay(this.isOpen, this.strategy, overlay => {
  trapOverlayFocus(overlay);
  restoreTriggerFocusOnClose(overlay);
});
```

### Menu overlay

```ts
readonly strategy = computed(() => {
  const templateRef = this.menuTpl();
  if (!templateRef) return null;

  return menuOverlay({
    templateRef,
    referenceElement: this.triggerEl.nativeElement,
    placement: 'right-start',
    offset: 1,
  });
});

readonly overlayHandle = createOverlay(this.isOpen, this.strategy, overlay => {
  restoreTriggerFocusOnClose(overlay);
});
```

## 10) Current Rules

- Keep `isOpen` as source of truth.
- Use strategy factories, not ad-hoc config objects.
- Close-policy behaviors (`closeOnOutsideClick`, `closeOnFocusLeave`, `closeOnScroll`, `blockScroll`) are declared in `defaultBehaviors` and applied automatically by `OverlayContainer`. Do not call them in `setup`.
- Focus behaviors (`trapOverlayFocus`, `restoreTriggerFocusOnClose`) go in `setup` — they need `OverlaySession` lifecycle hooks.
- Keep animations on shell roots, not in container wrappers.
- Use `fiboOverlayPanel` + title/description directives for modal semantics.
