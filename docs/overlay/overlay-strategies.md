# Overlay Presets

Convenience factories in `@fibo-ui/components` for common overlay types.
All return a plain `OverlayConfig` object — no inheritance, no class instances.

## Source

```
projects/fibo-ui/components/src/lib/overlay/overlay-presets.ts
```

## Preset Factories

### `dialogConfig(options)`

For modal dialogs and confirmations.

```ts
dialogConfig({
  templateRef,
  referenceElement?,   // used for focus restore
  focusReturnTarget?,  // overrides focus restore target
})
```

Resulting config:
- `position: globalPosition()`
- `shell: MODAL_SHELL_TOKEN`
- `needsBackdrop: true`
- `blockScroll: true`
- `closeOnOutsideClick: true`
- `closeOnEscape: true`
- `trapFocus: true` — auto-applies `trapOverlayFocus({ guard: true })`
- `restoreFocus: true` — auto-applies `restoreTriggerFocusOnClose`

### `drawerConfig(options)`

For slide-in drawer panels. Requires `DRAWER_SHELL_TOKEN` registered via `withShell`.

```ts
drawerConfig({
  templateRef,
  referenceElement?,
  focusReturnTarget?,
})
```

Same behavior flags as `dialogConfig`, but `shell: DRAWER_SHELL_TOKEN`.

### `connectedConfig(options)`

For anchored popovers (select, combobox, datepicker, custom dropdown).

```ts
connectedConfig({
  templateRef,
  referenceElement?,
  placement?,           // Placement, default: 'bottom'
  offset?,              // number, default: 5
  matchWidth?,          // boolean
  focusReturnTarget?,
  trapFocus?,           // boolean (not set by default)
  restoreFocus?,        // boolean, default: true
})
```

Resulting config:
- `position: connectedPosition({ placement, offset, matchWidth })`
- `shell: CONNECTED_SHELL_TOKEN`
- `closeOnOutsideClick: true`
- `closeOnFocusLeave: true`
- `closeOnEscape: true`
- `restoreFocus: true` (unless overridden)

### `menuConfig(options)`

For root menus and submenu panels.

```ts
menuConfig({
  templateRef,
  referenceElement?,
  placement?,           // default: 'right-start'
  offset?,              // default: 1
  focusReturnTarget?,
})
```

Like `connectedConfig` plus `tag: 'menu'` — allows `overlayStack.closeAllByTag('menu')`.

### `tooltipConfig(options)`

For passive floating hints.

```ts
tooltipConfig({
  templateRef,
  referenceElement?,
  placement?,           // default: 'top'
})
```

Resulting config:
- `closeOnScroll: true`
- `closeOnEscape: false`
- No backdrop, no focus trap, no focus restore

### `notificationConfig(options)`

For toast/notification containers.

```ts
notificationConfig({ templateRef })
```

Resulting config:
- `shell: NOTIFICATION_SHELL_TOKEN`
- `closeOnEscape: false`
- No backdrop, no close behaviors

## Direct Config

Presets are convenience only. Any component can build `OverlayConfig` directly:

```ts
readonly config = computed(() => {
  const templateRef = this.tpl();
  if (!templateRef) return null;
  return {
    templateRef,
    position: connectedPosition({ placement: 'bottom-start' }),
    shell: CONNECTED_SHELL_TOKEN,
    closeOnOutsideClick: true,
    closeOnFocusLeave: true,
    restoreFocus: true,
    referenceElement: this.trigger().nativeElement,
  };
});

createOverlay(this.isOpen, this.config);
```

## Custom Shells

App-specific shell components (e.g. drawer):

```ts
// my-drawer-shell.ts
export const MY_DRAWER_TOKEN = new InjectionToken<Type<any>>('MyDrawerShell');

// app.config.ts
provideOverlays(withShell(MY_DRAWER_TOKEN, MyDrawerShellComponent))

// usage
drawerConfig({ templateRef }) // or custom config with shell: MY_DRAWER_TOKEN
```
