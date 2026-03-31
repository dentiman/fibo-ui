# Overlays Quick Reference

## Core Contract

```ts
createOverlay(isOpen, config, setup?);
```

- `isOpen`: `WritableSignal<boolean>`
- `config`: `OverlayConfig | Signal<OverlayConfig | null | undefined>`
- `setup(session)`: optional — app-specific lifecycle logic for one open cycle

## Common Recipes

### Connected popover (custom)

```ts
import { createOverlay } from '@fibo-ui/cdk';
import { connectedConfig } from '@fibo-ui/components';

readonly config = computed(() => connectedConfig({
  content: this.popoverTpl(),
  referenceElement: this.triggerEl().nativeElement,
  placement: 'bottom-start',
  matchWidth: true,
}));

readonly overlayHandle = createOverlay(this.isOpen, this.config);
// closeOnOutsideClick, closeOnFocusLeave, restoreFocus applied automatically
```

### Modal dialog

```ts
import { createOverlay } from '@fibo-ui/cdk';
import { dialogConfig } from '@fibo-ui/components';

readonly config = computed(() => dialogConfig({
  content: this.dialogTpl(),
  referenceElement: this.triggerEl().nativeElement,
}));

readonly overlayHandle = createOverlay(this.isOpen, this.config);
// blockScroll, closeOnOutsideClick, trapFocus, restoreFocus applied automatically
```

### Dialog with close guard

```ts
readonly overlayHandle = createOverlay(this.isOpen, this.config, session => {
  session.canClose(reason => reason === 'escape' && this.isDirty() ? false : true);
  session.afterClose(() => this.formData.set(null));
});
```

### Menu

```ts
import { menuConfig } from '@fibo-ui/components';

readonly config = computed(() => menuConfig({
  content: this.menuTpl(),
  referenceElement: this.triggerEl().nativeElement,
  placement: 'bottom-start',
}));

readonly overlayHandle = createOverlay(this.isOpen, this.config);
```

### Drawer

```ts
import { drawerConfig } from '@fibo-ui/components';
// DRAWER_SHELL_TOKEN must be registered via provideOverlays(withShell(...))

readonly config = computed(() => drawerConfig({
  content: this.drawerTpl(),
  referenceElement: this.triggerEl().nativeElement,
}));

readonly overlayHandle = createOverlay(this.isOpen, this.config);
```

### Direct config (no preset)

```ts
import { createOverlay, connectedPosition, CONNECTED_SHELL_TOKEN } from '@fibo-ui/cdk';

readonly config = computed(() => ({
  content: this.tpl(),
  position: connectedPosition({ placement: 'bottom', offset: 8 }),
  shell: CONNECTED_SHELL_TOKEN,
  closeOnOutsideClick: true,
  closeOnFocusLeave: true,
  closeOnEscape: true,
  restoreFocus: true,
  referenceElement: this.trigger().nativeElement,
}));
```

### Coordinate position (context menu)

```ts
import { coordinatePosition, CONNECTED_SHELL_TOKEN } from '@fibo-ui/cdk';

readonly config = signal<OverlayConfig | null>(null);

onContextMenu(event: MouseEvent) {
  event.preventDefault();
  this.config.set({
    content: this.menuTpl(),
    position: coordinatePosition(event.clientX, event.clientY, { placement: 'right-start' }),
    shell: CONNECTED_SHELL_TOKEN,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    tag: 'menu',
  });
  this.isOpen.set(true);
}
```

### Service-driven overlay (singleton)

Use `createSingletonOverlay` to reduce boilerplate in services that own both the template and the open state (e.g. `ConfirmationService`, `Notifier`).

```ts
import { createSingletonOverlay } from '@fibo-ui/cdk';
import { dialogConfig } from '@fibo-ui/components';

// Inside service (injection context required)
readonly overlay = createSingletonOverlay(tpl =>
  dialogConfig({ content: tpl, referenceElement: this.config()?.referenceElement ?? null }),
  session => { session.afterClose(() => this.cleanup()); },
);

// Host component binds the template ref
this.overlay.templateRef.set(this.tpl());

// Open / close
open() { this.overlay.isOpen.set(true); }
close() { this.overlay.isOpen.set(false); }
```

`SingletonOverlay` exposes `templateRef`, `isOpen`, and `handle` signals.

## Useful APIs

- `overlay.handle.close(reason?)`
- `overlay.requestClose(reason, event?)`
- `overlay.afterOpened(handler)`
- `overlay.beforeClose(handler)`
- `overlay.afterClose(handler)`
- `overlay.canClose(guard)`
- `overlay.isInOverlayBranch(target)`

## Close topmost / all

```ts
overlayStack.closeTopmost()          // Escape key — handled by outlet automatically
overlayStack.closeAllByTag('menu')   // close all overlays with config.tag === 'menu'
```

## Bootstrap

```ts
// app.config.ts
import { provideOverlays, withShell } from '@fibo-ui/components';
import { DRAWER_SHELL_TOKEN } from '@fibo-ui/cdk';

provideOverlays(
  withShell(DRAWER_SHELL_TOKEN, DrawerShellComponent), // required for drawers
)
```

`provideOverlays()` registers modal, connected, notification, and tooltip shells by default.
`DRAWER_SHELL_TOKEN` is intentionally not included — register it explicitly via `withShell`.

## Shell Animation Rule

- Put `animate.enter` / `animate.leave` on shell root (host binding).
- On leave animation end, shell calls `overlayStack.completeAfterClose(handle.id)`.
- Do not rely on container-level wrapper animation.
