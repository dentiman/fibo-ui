# Overlays — Quick Reference

Short checklist for common overlay setup patterns in fibo-ui CDK.

## Core Pattern

```ts
createOverlay(isOpen, config, overlay => {
  // behavior composition here
});
```

## Modal Pattern (`dialog`, `confirmation`, `drawer`)

```ts
createOverlay(isOpen, config, overlay => {
  closeOnBackdropClick(overlay);
  blockScroll(overlay);
  trapOverlayFocus(overlay);
  restoreTriggerFocusOnClose(overlay);
});
```

## Non-modal Pattern (`popover`, `menu`, `datepicker`)

```ts
createOverlay(isOpen, config, overlay => {
  closeOnFocusLeave(overlay);
  closeOnOutsideClick(overlay);
  trapOverlayFocus(overlay); // guard is auto-disabled for non-modal categories
  restoreTriggerFocusOnClose(overlay);
});
```

## Focus Notes

- Put `fiboFocusInitial` on the preferred initial focus target.
- Do not add template-level `fiboFocusTrap` (removed). Focus is behavior-driven.
- Keep close-time restore centralized via `restoreTriggerFocusOnClose(...)`.

## See Also

- Full guide: `overlay-system.md`
- Runtime status: `overlay-improvements-status.md`
