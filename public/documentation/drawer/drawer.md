# Drawer

A slide-in side panel driven by a global `DrawerService`. Content is defined as a template and rendered in the single `<fibo-drawer>` outlet placed in the root component.

## Setup

`FiboDrawer` is the outlet component — it must be added **once** to your root component alongside other global overlays.

`app.ts`:

```ts
import { FiboDrawer } from '@fibo-ui/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FiboDrawer /* ...other overlays */],
  templateUrl: './app.html',
})
export class App {}
```

`app.html`:

```html
<router-outlet />
<fibo-drawer />
```

> See the [Installation](/getting-started/installation) guide for the full root component setup with all overlay containers.

## Basic Usage

Add `DrawerTrigger` to any clickable element. Bind `[fiboDrawerTrigger]` to an `ng-template` reference. Clicking the element calls `DrawerService.open()` with that template as content.

:::example drawer-basic

```html {example="drawer-basic"}
<button class="btn btn-primary" [fiboDrawerTrigger]="content">Open Drawer</button>

<ng-template #content>
  <div class="flex h-full flex-col p-6">
    <h2 class="text-lg font-semibold mb-4">Drawer Title</h2>
    <p class="text-sm text-muted">Drawer content goes here.</p>
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

## Closing

The drawer closes when the user clicks the backdrop. To close it programmatically, inject `DrawerService` and call `close()`:

```ts
import { DrawerService } from '@fibo-ui/components';

readonly drawer = inject(DrawerService);
```

```html
<button (click)="drawer.close()">Close</button>
```

## Architecture

Drawer uses a **service-based outlet pattern** — the outlet lives in the root component, and any descendant can open it via the service or the `DrawerTrigger` directive.

| Piece | Role |
| --- | --- |
| `<fibo-drawer>` (`FiboDrawer`) | Global outlet — renders the active drawer content with enter/leave animations. Add once to `app.html`. |
| `[fiboDrawerTrigger]` (`DrawerTrigger`) | Directive — on click, calls `DrawerService.open()` with the bound `TemplateRef`. |
| `DrawerService` | Singleton service — holds the active `content` signal and `isOpen` computed signal. |

**Data flow:**

1. `DrawerTrigger` listens for a click event on the host element.
2. On click it calls `DrawerService.open(templateRef)`.
3. The `content` signal is updated; the computed `isOpen` becomes `true`.
4. `FiboDrawer` reacts to `isOpen` and renders the backdrop + sliding panel with CSS animations.
5. A click on the backdrop calls `DrawerService.close()`, setting `content` back to `null`.

## API

### `DrawerTrigger` directive

| | |
| --- | --- |
| Selector | `[fiboDrawerTrigger]` |
| Export as | `FiboDrawerTrigger` |
| Package | `@fibo-ui/components` |

| Input | Type | Description |
| --- | --- | --- |
| `fiboDrawerTrigger` | `TemplateRef<unknown>` | Template to render inside the drawer panel. **Required.** |

### `DrawerService`

| Member | Type | Description |
| --- | --- | --- |
| `content` | `WritableSignal<TemplateRef \| null>` | Currently active template. `null` when the drawer is closed. |
| `isOpen` | `Signal<boolean>` | `true` when a template is active. |
| `open(content)` | `(TemplateRef) => void` | Sets the active template and opens the drawer. |
| `close()` | `() => void` | Clears the active template and closes the drawer. |

### `FiboDrawer` component

| | |
| --- | --- |
| Selector | `fibo-drawer` |
| Package | `@fibo-ui/components` |

No inputs. Reads `DrawerService` directly. Renders a fixed overlay with a semi-transparent backdrop and a right-side sliding panel (`max-w-md`). Backdrop click closes the drawer.
