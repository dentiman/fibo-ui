# Overlay System — Roadmap

## Completed (2026-03-29 — overlay-system-refactor branch)

### ✅ Unified OverlayConfig — replaces all strategy types

`OverlayStrategy`, `OverlayStrategyKind`, `OverlayRuntimeCategory`, `OverlayCategory` removed.
Single flat `OverlayConfig` with explicit behavior booleans.
`overlay-strategy.ts` deleted.

### ✅ Shell token routing — replaces @switch outlet

`OverlayConfig.shell: InjectionToken<Type<any>>` — outlet calls `injector.get(handle.config.shell)`.
Bootstrap: `provideOverlays(...features)` + `withShell(token, component)`.

### ✅ Flat behaviors — replaces defaultBehaviors array

`blockScroll`, `closeOnOutsideClick`, `closeOnFocusLeave`, `closeOnScroll` are direct booleans on config.
`OverlayContainer` reads them in `ngOnInit`.

### ✅ Auto-applied session behaviors

`trapFocus: true` / `restoreFocus: true` on config auto-calls `trapOverlayFocus` / `restoreTriggerFocusOnClose` inside `createOverlay`.

### ✅ Removed category system

No `firstInCategory`, no `openDialogs`/`hasOpenDialogs`, no `BASE_Z_INDEX`, no `ESCAPE_SKIP_CATEGORIES`.
`closeAllByCategory` → `closeAllByTag(tag)`. Menus use `tag: 'menu'`.

### ✅ Position types

`GlobalPosition | ConnectedPosition | CoordinatePosition` — direct on config.
`OverlayPosition` directive reads `handle.config.position`, supports coordinate virtual element.

### ✅ Presets in components

`dialogConfig`, `drawerConfig`, `connectedConfig`, `menuConfig`, `tooltipConfig`, `notificationConfig`
in `projects/fibo-ui/components/src/lib/overlay/overlay-presets.ts`.

### ✅ Drawer removed from library defaults

`DRAWER_SHELL_TOKEN` exists in CDK, app registers its own shell via `withShell(DRAWER_SHELL_TOKEN, DrawerShellComponent)`.

---

## Remaining / Future

### Singleton overlay pattern

`ConfirmationService`, `TooltipService`, `Notifier` all repeat the same pattern:

```ts
containerTemplateRef = signal<TemplateRef<any> | null>(null);
isOpen = signal(false);
overlayConfig = computed(() => {
  const templateRef = this.containerTemplateRef();
  if (!templateRef) return null;
  return someConfig({ templateRef, ... });
});
overlayHandle = createOverlay(this.isOpen, this.overlayConfig, ...);
```

Could extract `createSingletonOverlay(configFn, setup?)` utility — reduces ~15 lines of boilerplate per service.

### Custom Tooltip shell

Current `tooltipConfig` uses `CONNECTED_SHELL_TOKEN` (generic connected shell).
App-specific tooltip shells can be registered via `withShell(TOOLTIP_SHELL_TOKEN, CustomTooltipShell)`.
A `TOOLTIP_SHELL_TOKEN` could be added to CDK for library-level tooltip differentiation.

### animate.enter / animate.leave documentation

The `host: { 'animate.enter': '...', 'animate.leave': '...' }` binding pattern is undocumented.
Should be documented in `docs/overlay/` with an explanation of who reads these attributes and how.
