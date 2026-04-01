# Drawer

A slide-in side panel rendered through the overlay outlet. Uses the same `createOverlay` mechanism as dialogs with `fiboDrawerTrigger` or a custom trigger.

## Setup

Register the drawer shell once at app bootstrap:

```ts
// app.config.ts
import { provideOverlays, withShell, OverlayDrawerShellComponent } from '@fibo-ui/components';
import { DRAWER_SHELL_TOKEN } from '@fibo-ui/cdk';

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
  fiboDrawerTrigger
  [content]="drawerContent"
>
  Open Drawer
</button>

<ng-template #drawerContent let-close>
  <div class="flex h-full flex-col p-6">
    <h2 class="text-lg font-semibold mb-4">Drawer Title</h2>
    <p class="text-sm text-foreground-secondary">Drawer content goes here.</p>
    <div class="mt-6">
      <button class="btn btn-primary" (click)="close()">Close Drawer</button>
    </div>
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

Use `createOverlay` directly with `drawerBehavior()` and `globalPosition()`:

```ts
import { createOverlay, globalPosition, signal } from '@fibo-ui/cdk';
import { drawerBehavior } from '@fibo-ui/components';

private readonly triggerEl = viewChild.required<ElementRef<HTMLElement>>('triggerEl');
private readonly drawerTpl = viewChild.required<TemplateRef<unknown>>('drawerTpl');
readonly isOpen = signal(false);

readonly overlayHandle = createOverlay(
  this.isOpen,
  drawerBehavior(),
  signal(globalPosition()),
  this.drawerTpl,
  session => { restoreTriggerFocusOnClose(session, () => this.triggerEl().nativeElement); },
);
```

## Closing

Templates receive a `close` function as `$implicit` context — no need to hold a trigger reference:

```html
<ng-template #drawerContent let-close>
  <div class="p-6">
    <button (click)="close()">Close</button>
  </div>
</ng-template>
```

## Architecture

| Piece | Role |
|---|---|
| `[fiboDrawerTrigger]` | Directive that manages `isOpen` signal and overlay creation |
| `DRAWER_SHELL_TOKEN` | InjectionToken resolved by the outlet to the drawer shell component |
| `OverlayDrawerShellComponent` | Visual shell: fixed right-side panel, slide animation |
| `<fibo-overlay-stack-outlet>` | Renders all open overlays including the drawer |

## Custom Drawer Shell

Register a custom token and component via `withShell`:

```ts
export const MY_DRAWER_TOKEN = new InjectionToken<Type<any>>('MyDrawerShell');

// app.config.ts
provideOverlays(withShell(MY_DRAWER_TOKEN, MyDrawerShellComponent))

// usage
readonly overlayHandle = createOverlay(
  this.isOpen,
  { shell: MY_DRAWER_TOKEN, needsBackdrop: true, blockScroll: true, closeOnEscape: true, closeOnOutsideClick: true },
  signal(globalPosition()),
  this.drawerTpl,
);
```

## API

### `DrawerTrigger` directive

| | |
|---|---|
| Selector | `[fiboDrawerTrigger]` |
| Package | `@fibo-ui/cdk` |

Inputs:
- `content: TemplateRef<unknown>` — the drawer template
- `open: boolean` — two-way model for open state
