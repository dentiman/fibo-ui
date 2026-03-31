# Overlays

`createOverlay` is the signal-driven entry point for all temporary UI: modals, popovers, menus, tooltips, drawers, and notifications.

## Basic Usage

:::example cdk-overlays-basic

```html {example="cdk-overlays-basic"}
<section class="mx-auto w-full max-w-xl p-6">
  <div class="flex items-center gap-3">
    <button #triggerButton type="button" class="btn btn-primary" (click)="toggle()">
      Toggle overlay
    </button>
    <span class="text-sm text-foreground-secondary">
      Open: {{ isOpen() ? 'yes' : 'no' }}
    </span>
  </div>

  <ng-template #overlayTpl>
    <div class="fixed top-28 left-1/2 z-10 w-80 -translate-x-1/2 rounded-xl bg-background p-4 shadow-lg">
      <div class="text-sm font-medium">Overlay is open</div>
      <div class="mt-4 flex gap-2">
        <button type="button" class="btn btn-sm" (click)="increment()">Action</button>
        <button type="button" class="btn btn-sm btn-inverse" (click)="close()">Close</button>
      </div>
      <div class="mt-3 text-xs text-foreground-secondary">
        Action count: {{ actionCount() }}
      </div>
    </div>
  </ng-template>
</section>
```

```ts {example="cdk-overlays-basic"}
@Component({
  selector: 'cdk-overlays-basic-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class CdkOverlaysBasicExample {
  private readonly triggerButton = viewChild.required<ElementRef<HTMLElement>>('triggerButton');
  private readonly overlayTpl = viewChild.required<TemplateRef<any>>('overlayTpl');

  readonly isOpen = signal(false);
  readonly actionCount = signal(0);

  readonly strategy = computed(() =>
    connectedConfig({
      content: this.overlayTpl(),
      referenceElement: this.triggerButton().nativeElement,
    })
  );

  readonly overlayHandle = createOverlay(this.isOpen, this.strategy, overlay => {
    restoreTriggerFocusOnClose(overlay);
  });

  toggle() { this.isOpen.update(v => !v); }
  close() { this.isOpen.set(false); }
  increment() { this.actionCount.update(v => v + 1); }
}
```

## Core Contract

`createOverlay(isOpen, config, setup?)` connects component state to the overlay runtime.

- `isOpen` — `WritableSignal<boolean>` is the source of truth for open and closed
- `config` — `OverlayConfig` or `Signal<OverlayConfig | null>` describes what and how to render
- `setup(session)` — optional, called once per open cycle for app-specific lifecycle logic

```ts
createOverlay(isOpen, config, setup?): Signal<OverlayHandle | null>
```

## OverlayConfig

A single flat config object covers all overlay types.

```ts
interface OverlayConfig {
  content: TemplateRef<any> | string;
  position: GlobalPosition | ConnectedPosition | CoordinatePosition;
  shell: InjectionToken<Type<any>>;

  needsBackdrop?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnFocusLeave?: boolean;
  closeOnScroll?: boolean;
  blockScroll?: boolean;
  trapFocus?: boolean;        // auto-applies trapOverlayFocus({ guard: true })
  restoreFocus?: boolean;     // auto-applies restoreTriggerFocusOnClose

  referenceElement?: HTMLElement | null;
  focusReturnTarget?: HTMLElement | null;
  tag?: string;
}
```

`content` accepts a `TemplateRef` or a plain string. Pass an empty string `''` as a sentinel when the template ref is not yet initialized — the overlay will not open until content is truthy.

### Position types

| Factory | Use case |
|---|---|
| `globalPosition()` | Modal, drawer — centered or fixed |
| `connectedPosition(options?)` | Popover, menu, tooltip — anchored to reference element |
| `coordinatePosition(x, y, options?)` | Context menu — anchored to cursor position |

```ts
connectedPosition({
  placement?: Placement,   // floating-ui placement, e.g. 'bottom-start'
  matchWidth?: boolean,    // match reference element width
  offset?: number,         // gap in px
})
```

## Behavior Flags

Behavior flags on `OverlayConfig` are applied automatically — no manual wiring needed.

### Applied by `OverlayContainer` (DOM listeners)

| Flag | Behavior |
|---|---|
| `blockScroll` | Locks document scroll while open |
| `closeOnOutsideClick` | Closes on click outside overlay |
| `closeOnFocusLeave` | Closes when focus leaves overlay |
| `closeOnScroll` | Closes on document scroll (for tooltips) |

### Applied by `createOverlay` (session behaviors)

| Flag | Applied behavior |
|---|---|
| `trapFocus: true` | Auto-focus on open, cyclic Tab inside overlay, focus guard |
| `restoreFocus: true` | Returns focus to trigger when overlay closes |

## Presets

`@fibo-ui/components` provides preset factories that fill in defaults:

| Function | shell | behaviors |
|---|---|---|
| `dialogConfig(opts)` | `MODAL_SHELL_TOKEN` | backdrop, blockScroll, outsideClick, escape, trapFocus, restoreFocus |
| `drawerConfig(opts)` | `DRAWER_SHELL_TOKEN` | same as dialog |
| `connectedConfig(opts)` | `CONNECTED_SHELL_TOKEN` | outsideClick, focusLeave, escape, restoreFocus |
| `menuConfig(opts)` | `CONNECTED_SHELL_TOKEN` | same as connected + `tag: 'menu'` |
| `notificationConfig(opts)` | `NOTIFICATION_SHELL_TOKEN` | no escape |

All presets accept `content: TemplateRef<any> | string` and return a plain `OverlayConfig`.

## Setup Function

`setup(session)` runs once per open cycle. Use it for app-specific logic:

```ts
createOverlay(this.isOpen, this.config, session => {
  // close guard
  session.canClose(reason => reason !== 'outside-click' || !this.isDirty());

  // custom after-close cleanup
  session.afterClose(() => this.formData.set(null));

  // custom effect scoped to overlay lifetime
  session.effect(() => console.log('overlay open with', session.handle.config));
});
```

`setup` is **not** needed for standard behaviors — those come from config flags.

### Session API

- `session.handle` — current `OverlayHandle`
- `session.requestClose(reason, event?)` — request close programmatically
- `session.afterOpened(handler)` — fires after first render
- `session.beforeClose(handler)` — fires before `isOpen` flips false
- `session.afterClose(handler)` — fires after leave animation
- `session.canClose(guard)` — return `false` to block close
- `session.effect(runner)` — Angular effect scoped to overlay lifetime
- `session.onCleanup(fn)` — runs on overlay destroy
- `session.isInOverlayBranch(target)` — returns true if target is inside this overlay branch

## OverlayHandle

Runtime object for one currently open overlay. Returned by `createOverlay()`.

```ts
handle.id               // unique string
handle.config           // the OverlayConfig used to open
handle.zIndex           // numeric z-index
handle.content          // current rendered content (TemplateRef | string | undefined)
handle.referenceElement
handle.focusReturnTarget
handle.closed
handle.close(reason?)
```

## createSingletonOverlay

Reduces the `templateRef / isOpen / overlayConfig / createOverlay` boilerplate common to service-driven overlays (e.g. `ConfirmationService`, `Notifier`).

```ts
createSingletonOverlay(configFn, setup?): SingletonOverlay
```

- `configFn(templateRef)` — runs inside a `computed`, receives the resolved `TemplateRef`, returns `OverlayConfig | null`
- `setup` — same as in `createOverlay`

```ts
// Inside a service (injection context required)
readonly overlay = createSingletonOverlay(tpl =>
  dialogConfig({
    content: tpl,
    referenceElement: this.config()?.referenceElement ?? null,
  }),
  session => {
    session.afterClose(() => this.cleanup());
  },
);

// Bind the template ref from the host component
ngAfterViewInit() {
  this.overlay.templateRef.set(this.tpl());
}

// Open / close
open() { this.overlay.isOpen.set(true); }
close() { this.overlay.isOpen.set(false); }
```

`SingletonOverlay` exposes:
- `templateRef` — `WritableSignal<TemplateRef | null>` — bind from host via `viewChild`
- `isOpen` — `WritableSignal<boolean>` — open/close state
- `handle` — `Signal<OverlayHandle | null>` — current runtime handle

## Nested Overlays

Overlays can open from within other overlays.

The child becomes part of the parent branch:
- Click inside child is **not** treated as outside click for the parent
- Focus moving from parent to child is **not** treated as focus-leave
- `session.isInOverlayBranch(target)` traverses the parent chain

## Bootstrap

Register overlay shells once at application startup with `provideOverlays()`:

```ts
// app.config.ts
import { provideOverlays, withShell } from '@fibo-ui/components';
import { DRAWER_SHELL_TOKEN } from '@fibo-ui/cdk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideOverlays(
      withShell(DRAWER_SHELL_TOKEN, DrawerShellComponent),  // required for drawers
    ),
  ]
};
```

`provideOverlays()` registers the default shells for modal, connected, notification, and tooltip overlays. Use `withShell` to register additional shells (e.g. `DRAWER_SHELL_TOKEN`) or override defaults with a custom component.

Place `<fibo-overlay-stack-outlet>` once in the root component template:

```html
<router-outlet />
<fibo-overlay-stack-outlet />
```

## Close Reasons

```ts
type OverlayCloseReason =
  | 'programmatic'
  | 'escape'
  | 'focusout'
  | 'outside-click'
  | 'blur'
  | 'state'
  | 'destroy';
```

## Lifecycle

1. `isOpen` → `true`
2. Overlay opens when `content` is truthy
3. `setup(session)` runs, behaviors are attached
4. `afterOpened` fires after first render
5. Close requested → `beforeClose` hooks run
6. `isOpen` → `false`, leave animation plays
7. `afterClose` handlers run
