# Overlays Quick Reference

## Core Contract

```ts
createOverlay(isOpen, strategy, setup?);
```

- `isOpen`: `WritableSignal<boolean>`
- `strategy`: `OverlayStrategy | Signal<OverlayStrategy | null | undefined>`
- `setup(overlay)`: register lifecycle behaviors for one open cycle

## Common Recipes

### Connected popover

```ts
const strategy = computed(() => connectedOverlay({
  templateRef: popoverTpl,
  referenceElement: triggerEl,
  interactionRoot: triggerEl,
  placement: 'bottom-start',
  matchWidth: true,
}));

createOverlay(isOpen, strategy, overlay => {
  closeOnFocusLeave(overlay);
  closeOnOutsideClick(overlay);
  restoreTriggerFocusOnClose(overlay);
});
```

### Modal dialog

```ts
const strategy = computed(() => modalOverlay({
  templateRef: dialogTpl,
  focusReturnTarget: triggerEl,
  backdropClosable: true,
  blockScroll: true,
}));

createOverlay(isOpen, strategy, overlay => {
  trapOverlayFocus(overlay);
  restoreTriggerFocusOnClose(overlay);
});
```

### Menu / submenu

```ts
const strategy = computed(() => menuOverlay({
  templateRef: menuTpl,
  referenceElement: triggerEl,
  placement: 'right-start',
  offset: 1,
}));

createOverlay(isOpen, strategy, overlay => {
  closeOnFocusLeave(overlay);
  closeOnOutsideClick(overlay);
  restoreTriggerFocusOnClose(overlay);
});
```

### Tooltip

```ts
createOverlay(isOpen, tooltipOverlay({
  templateRef: tooltipTpl,
  referenceElement: hostEl,
  placement: 'top',
}), overlay => {
  closeOnScroll(overlay);
});
```

## Closing and Guards

```ts
createOverlay(isOpen, strategy, overlay => {
  overlay.canClose((reason) => {
    if (reason === 'escape' && hasUnsavedChanges()) {
      return false;
    }
    return true;
  });
});
```

## Useful APIs

- `overlay.handle.close(reason?)`
- `overlay.requestClose(reason, event?)`
- `overlay.afterOpened(handler)`
- `overlay.beforeClose(handler)`
- `overlay.afterClose(handler)`
- `overlay.isInOverlayBranch(target)`

## Shell Animation Rule

- Put `animate.enter` / `animate.leave` on shell root.
- On leave end, call `overlayStack.completeAfterClose(handle.id)`.
- Do not rely on container-level wrapper animation.
