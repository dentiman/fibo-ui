# Drawer

A slide-in side panel rendered through the shared portal outlet (`<fibo-overlay-outlet>`). `fibo-drawer` is the visual shell, and opening uses the same trigger pattern as `fibo-dialog`.

## Setup

Drawer does not need a dedicated global outlet in `app.html`.

Your root component only needs the shared portal outlet once:

```html
<router-outlet />
<fibo-overlay-outlet />
```

> See the [Installation](/getting-started/installation) guide for the full root setup with all global overlay containers.

## Basic Usage

Use `fiboPopoverTriggerClick` with `overlayCategory="dialog"` and pass an `ng-template`.
Inside the template, wrap the content with `<fibo-drawer>`.

:::example drawer-basic

```html {example="drawer-basic"}
<button class="btn btn-primary" fiboPopoverTriggerClick overlayCategory="dialog" [content]="content">
  Open Drawer
</button>

<ng-template #content>
  <fibo-drawer>
    <div class="flex h-full flex-col p-6">
      <h2 class="text-lg font-semibold mb-4">Drawer Title</h2>
      <p class="text-sm text-muted">Drawer content goes here.</p>
    </div>
  </fibo-drawer>
</ng-template>
```

```ts {example="drawer-basic"}
@Component({
  selector: 'drawer-basic-example',
  imports: [PopoverTriggerClick, FiboDrawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class DrawerBasicExample {}
```

## Closing

Drawer closes automatically on backdrop click.

For custom actions inside content, use trigger context:

```html
<ng-template #content let-trigger>
  <fibo-drawer>
    <button class="btn" (click)="trigger.close()">Close</button>
  </fibo-drawer>
</ng-template>
```

## Architecture

Drawer and Dialog now share one opening mechanism (`PopoverTrigger` with category `dialog`).
The difference is only the visual wrapper component (`fibo-drawer` vs `fibo-dialog`).

| Piece | Role |
| --- | --- |
| `fiboPopoverTriggerClick` + `overlayCategory="dialog"` | Opens the overlay through `OverlayRegistry` and `<fibo-overlay-outlet>`. |
| `<fibo-overlay-outlet>` | Shared global portal outlet. |
| `<fibo-drawer>` (`FiboDrawer`) | Drawer shell: backdrop, right-side panel, focus trap, enter/leave animations. |

## API

### `FiboDrawer` component

| | |
| --- | --- |
| Selector | `fibo-drawer` |
| Package | `@fibo-ui/components` |

No inputs. Uses `OVERLAY_REF` from the portal outlet to close and participate in shared dialog-layer stacking.
