# Drawer

A slide-in side panel rendered through the overlay outlet. Uses the same `createOverlay` mechanism as dialogs with `fiboDrawerTrigger` or a custom trigger.

## Setup

Register the drawer shell once at app bootstrap:

```ts
// app.config.ts
import { provideOverlays, withShell } from '@fibo-ui/components';
import { DRAWER_SHELL_TOKEN } from '@fibo-ui/cdk';
import { OverlayDrawerShellComponent } from '@fibo-ui/components';

provideOverlays(
  withShell(DRAWER_SHELL_TOKEN, OverlayDrawerShellComponent),
)
```

Add `<fibo-overlay-stack-outlet>` once in the root component:

```html
<router-outlet />
<fibo-overlay-stack-outlet />
```

## Basic Usage

Use `[fiboDrawerTrigger]` with an `ng-template`:

:::example drawer-basic

```html {example="drawer-basic"}
<button
  type="button"
  class="btn btn-primary"
  [fiboDrawerTrigger]
  [content]="drawerContent"
>
  Open Drawer
</button>

<ng-template #drawerContent>
  <div class="flex h-full flex-col p-6">
    <h2 class="text-lg font-semibold mb-4">Drawer Title</h2>
    <p class="text-sm text-foreground-secondary">Drawer content goes here.</p>
  </div>
</ng-template>
```

```ts {example="drawer-basic"}
@Component({
  selector: 'drawer-basic-example',
  imports: [DrawerTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class DrawerBasicExample {}
```

## Programmatic Control

Use `createOverlay` directly with `drawerConfig`:

```ts
import { createOverlay } from '@fibo-ui/cdk';
import { drawerConfig } from '@fibo-ui/components';

readonly config = computed(() => {
  const templateRef = this.drawerTpl();
  if (!templateRef) return null;
  return drawerConfig({
    templateRef,
    referenceElement: this.triggerEl().nativeElement,
  });
});

readonly overlayHandle = createOverlay(this.isOpen, this.config);
```

## Closing

Drawer closes automatically on backdrop click, Escape key, and outside click.

To close programmatically from inside the template, use `OVERLAY_HANDLE`:

```ts
// inside drawer content component
private readonly handle = inject(OVERLAY_HANDLE);

close() {
  this.handle.close();
}
```

## Architecture

| Piece | Role |
|---|---|
| `[fiboDrawerTrigger]` | Directive that manages `isOpen` signal and builds `drawerConfig` |
| `DRAWER_SHELL_TOKEN` | InjectionToken resolved by outlet to the drawer shell component |
| `OverlayDrawerShellComponent` | Visual shell: fixed right-side panel, slide animation |
| `<fibo-overlay-stack-outlet>` | Renders all open overlays including the drawer |

## Custom Drawer Shell

To use a custom shell component:

```ts
export const MY_DRAWER_TOKEN = new InjectionToken<Type<any>>('MyDrawerShell');

// app.config.ts
provideOverlays(withShell(MY_DRAWER_TOKEN, MyDrawerShellComponent))

// usage
const config = drawerConfig({ templateRef });
// override shell token:
createOverlay(this.isOpen, { ...config, shell: MY_DRAWER_TOKEN });
```

## API

### `DrawerTrigger` directive

| | |
|---|---|
| Selector | `[fiboDrawerTrigger]` |
| Package | `@fibo-ui/cdk` |

Inputs:
- `content: TemplateRef<any>` — the drawer template
- `open: boolean` — two-way model for open state

### `drawerConfig(options)`

| | |
|---|---|
| Package | `@fibo-ui/components` |

Options:
- `templateRef: TemplateRef<any>`
- `referenceElement?: HTMLElement | null`
- `focusReturnTarget?: HTMLElement | null`
