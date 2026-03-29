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
  templateRef: this.popoverTpl(),
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
  templateRef: this.dialogTpl(),
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
  templateRef: this.menuTpl(),
  referenceElement: this.triggerEl().nativeElement,
  placement: 'bottom-start',
}));

readonly overlayHandle = createOverlay(this.isOpen, this.config);
```

### Tooltip

```ts
import { tooltipConfig } from '@fibo-ui/components';

readonly config = computed(() => tooltipConfig({
  templateRef: this.tooltipTpl(),
  referenceElement: this.hostEl().nativeElement,
  placement: 'top',
}));

readonly overlayHandle = createOverlay(this.isOpen, this.config);
```

### Drawer

```ts
import { drawerConfig } from '@fibo-ui/components';
// DRAWER_SHELL_TOKEN must be registered via provideOverlays(withShell(...))

readonly config = computed(() => drawerConfig({
  templateRef: this.drawerTpl(),
  referenceElement: this.triggerEl().nativeElement,
}));

readonly overlayHandle = createOverlay(this.isOpen, this.config);
```

### Direct config (no preset)

```ts
import { createOverlay, connectedPosition, CONNECTED_SHELL_TOKEN } from '@fibo-ui/cdk';

readonly config = computed(() => ({
  templateRef: this.tpl(),
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
    templateRef: this.menuTpl(),
    position: coordinatePosition(event.clientX, event.clientY, { placement: 'right-start' }),
    shell: CONNECTED_SHELL_TOKEN,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    tag: 'menu',
  });
  this.isOpen.set(true);
}
```

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
import { DrawerShellComponent } from './drawer-shell.component';

provideOverlays(
  withShell(DRAWER_SHELL_TOKEN, DrawerShellComponent),
)
```

## Shell Animation Rule

- Put `animate.enter` / `animate.leave` on shell root (host binding).
- On leave animation end, shell calls `overlayStack.completeAfterClose(handle.id)`.
- Do not rely on container-level wrapper animation.
