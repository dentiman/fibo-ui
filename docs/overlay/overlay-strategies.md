# Overlay Strategies

This document introduces the first migration step toward strategy-driven overlays.

## Goal

- keep `createOverlay(...)` as the runtime entry point
- move from ad-hoc category handling to typed strategies
- prepare a future shell-driven rendering model

## Current contract

```ts
createOverlay(isOpen, connectedOverlay({...}), session => {
  closeOnOutsideClick(session);
});

createOverlay(isOpen, modalOverlay({...}), session => {
  closeOnBackdropClick(session);
  blockScroll(session);
});
```

## Strategy types

```ts
type OverlayStrategyKind = 'connected' | 'modal' | 'menu' | 'tooltip';
```

### Connected overlay

Use for anchored floating content like select, combobox, datepicker, and simple popovers.

```ts
const strategy = connectedOverlay({
  templateRef: contentTpl,
  referenceElement: triggerEl,
  placement: 'bottom',
  matchWidth: true,
});
```

### Modal overlay

Use for dialogs and confirmations.

```ts
const strategy = modalOverlay({
  templateRef: dialogTpl,
  focusReturnTarget: triggerEl,
});
```

### Menu overlay

Use for menu and submenu flows.

```ts
const strategy = menuOverlay({
  templateRef: menuTpl,
  referenceElement: triggerEl,
});
```

### Tooltip overlay

Use for passive non-interactive floating content.

```ts
const strategy = tooltipOverlay({
  templateRef: tooltipTpl,
  referenceElement: hostEl,
});
```

## What each strategy carries

- `kind` — intent of the overlay
- `shell` — future rendering shell kind
- `category` — transitional runtime mapping for the current stack
- `config` — normalized render config for the current implementation
- `defaultBehaviors` — built-in lifecycle policy ids

## Migration order

1. introduce strategy factories and typed contracts
2. migrate consumers gradually
3. move DOM shell rendering into strategy-owned shell components
4. remove category-centric usage from consumers
