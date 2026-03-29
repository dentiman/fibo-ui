# Overlay Docs Index

Internal developer documentation for the overlay system.

## Read Order

1. `overlay-system.md` — full architecture and API reference
2. `overlay-strategies.md` — config presets and usage patterns
3. `overlays.md` — quick implementation cookbook

## Scope

- Config-driven runtime (`createOverlay(isOpen, config, setup?)`)
- Token-based shell routing (`InjectionToken<Type<any>>` on config)
- Bootstrap via `provideOverlays(withShell(...))` (components layer)
- Flat behavior flags on `OverlayConfig` (no strategy types, no categories)
- Position types: `GlobalPosition`, `ConnectedPosition`, `CoordinatePosition`
- Shell components: modal, connected, plain, backdrop, drawer (app-provided)
- Animation lifecycle (leave completion via shell panel)

## Key Design Decisions

- **One config type** (`OverlayConfig`) replaces all strategy factories and kind/category types.
- **Shell tokens** instead of switch-case routing — extensible via `withShell(token, component)`.
- **Flat booleans** for behaviors — no `defaultBehaviors` array, no category-based auto-detection.
- **Session behaviors** (`trapFocus`, `restoreFocus`) auto-applied from config in `createOverlay`, not deferred to `setup`.
- **DOM order** determines visual stacking — all overlays share base z-index (1000+counter).
- **`tag` field** for grouping — replaces category-based `closeAllByCategory` with `closeAllByTag`.
