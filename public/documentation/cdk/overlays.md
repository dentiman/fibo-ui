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

  <p class="mt-3 text-sm text-foreground-secondary">
    This overlay is created directly from component state through
    <code>createOverlay(...)</code>.
  </p>

  <ng-template #overlayTpl>
    <div class="w-64 rounded-xl bg-background p-4 shadow-lg outline-1 -outline-offset-1 outline-black/13 dark:outline-white/5">
      <div class="text-sm font-medium">Overlay lifecycle</div>
      <p class="mt-2 text-sm text-foreground-secondary">
        Close it with outside click, focus leave, or the explicit action below.
      </p>
      <div class="mt-4 flex items-center gap-2">
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
  private readonly overlayTpl = viewChild.required<TemplateRef<unknown>>('overlayTpl');

  readonly isOpen = signal(false);
  readonly actionCount = signal(0);

  readonly overlayHandle = createOverlay(
    this.isOpen,
    connectedBehavior(),
    connectedPosition(() => ({ referenceElement: this.triggerButton().nativeElement })),
    this.overlayTpl,
    session => { restoreTriggerFocusOnClose(session, () => this.triggerButton().nativeElement); },
  );

  toggle() { this.isOpen.update(v => !v); }
  close() { this.isOpen.set(false); }
  increment() { this.actionCount.update(v => v + 1); }
}
```

## Core Contract

`createOverlay` accepts four required arguments and an optional setup function:

```ts
createOverlay(
  isOpen: WritableSignal<boolean>,
  behavior: OverlayBehaviorConfig,
  position: Signal<OverlayPositionConfig>,
  content: Signal<TemplateRef | string | null>,
  setup?: (session: OverlaySession) => void,
): Signal<OverlayHandle | null>
```

- `isOpen` — source of truth for open/closed state
- `behavior` — static flags: which shell to use, which close triggers to attach
- `position` — reactive positioning; use `connectedPosition()` or `signal(globalPosition())`
- `content` — reactive content; `null` defers opening until a template is available
- `setup(session)` — optional, called once per open cycle for lifecycle hooks

## Behavior Config

`OverlayBehaviorConfig` is a plain object — build it with a preset or inline:

```ts
interface OverlayBehaviorConfig {
  shell: InjectionToken<Type<any>>;

  needsBackdrop?: boolean;
  closeOnEscape?: boolean;         // default true for most presets
  closeOnOutsideClick?: boolean;
  closeOnFocusLeave?: boolean;
  closeOnScroll?: boolean;
  blockScroll?: boolean;
  tag?: string;                    // e.g. 'menu' — used by closeAllByTag
}
```

## Position

### `connectedPosition(factory)`

Pass a factory function — `connectedPosition` wraps it in `computed()` and returns a reactive `Signal<ConnectedPosition>`:

```ts
connectedPosition(() => ({
  referenceElement: this.triggerEl().nativeElement,
  placement?: Placement,   // floating-ui placement string, e.g. 'bottom-start'
  matchWidth?: boolean,    // match reference element width
  offset?: number,         // gap in px
}))
```

### `globalPosition()`

For centered modals and drawers:

```ts
signal(globalPosition())  // → Signal<{ type: 'global' }>
```

## Behavior Presets

`@fibo-ui/components` provides preset factories that fill in sensible defaults:

| Function | Shell | Close triggers |
|---|---|---|
| `dialogBehavior()` | `MODAL_SHELL_TOKEN` | backdrop, blockScroll, outsideClick, escape |
| `drawerBehavior()` | `DRAWER_SHELL_TOKEN` | backdrop, blockScroll, outsideClick, escape |
| `connectedBehavior()` | `CONNECTED_SHELL_TOKEN` | outsideClick, focusLeave, escape |
| `menuBehavior()` | `CONNECTED_SHELL_TOKEN` | same as connected + `tag: 'menu'` |
| `tooltipBehavior()` | `TOOLTIP_SHELL_TOKEN` | scroll, no escape |
| `notificationBehavior()` | `NOTIFICATION_SHELL_TOKEN` | no escape |

## Template Context

Overlay content templates receive a `close` function as `$implicit` context:

```html
<ng-template #dialogTpl let-close>
  <div class="p-6">
    <h2 class="text-lg font-semibold mb-2">Confirm action</h2>
    <div class="mt-4 flex justify-end gap-2">
      <button class="btn" (click)="close()">Cancel</button>
      <button class="btn btn-primary" (click)="confirm(); close()">Confirm</button>
    </div>
  </div>
</ng-template>
```

## Setup Function

`setup(session)` runs once per open cycle. Use it for hooks not covered by behavior flags:

```ts
createOverlay(this.isOpen, behavior, position, content, session => {
  // close guard
  session.canClose(reason => reason !== 'outside-click' || !this.isDirty());

  // after-close cleanup
  session.afterClose(() => this.formData.set(null));

  // effect scoped to overlay lifetime (auto-destroyed on close)
  session.effect(() => console.log('open, items:', this.items()));
});
```

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

Runtime object for one currently open overlay:

```ts
handle.id          // unique string
handle.behavior    // OverlayBehaviorConfig used to open
handle.position    // Signal<OverlayPositionConfig>
handle.content     // Signal<TemplateRef | string | undefined>
handle.closed      // boolean
handle.close(reason?)
```

## createSingletonOverlay

Reduces boilerplate for service-driven overlays (e.g. `ConfirmationService`, `Notifier`).

```ts
createSingletonOverlay(
  behavior: OverlayBehaviorConfig,
  position: Signal<OverlayPositionConfig>,
  setup?: (session: OverlaySession) => void,
): SingletonOverlay
```

```ts
// Inside a service (injection context required)
readonly overlay = createSingletonOverlay(
  dialogBehavior(),
  signal(globalPosition()),
  session => {
    trapOverlayFocus(session, { guard: true });
    restoreTriggerFocusOnClose(session, () => this.config()?.referenceElement ?? null);
    session.afterClose(() => this.cleanup());
  },
);

// Bind the template ref from the host component (afterNextRender ensures viewChild is ready)
afterNextRender(() => {
  this.overlay.templateRef.set(this.tpl());
});

open() { this.overlay.isOpen.set(true); }
close() { this.overlay.isOpen.set(false); }
```

`SingletonOverlay` exposes:
- `templateRef` — `WritableSignal<TemplateRef | null>` — bind from host via `viewChild`
- `isOpen` — `WritableSignal<boolean>` — open/close state
- `handle` — `Signal<OverlayHandle | null>` — current runtime handle

## Nested Overlays

Overlays can open from within other overlays. The child becomes part of the parent branch:

- Click inside child is **not** treated as outside click for the parent
- Focus moving from parent to child is **not** treated as focus-leave
- `session.isInOverlayBranch(target)` traverses the parent chain

## Bootstrap

Register overlay shells once at application startup with `provideOverlays()`:

```ts
// app.config.ts
import { provideOverlays, withShell, OverlayDrawerShellComponent } from '@fibo-ui/components';
import { DRAWER_SHELL_TOKEN } from '@fibo-ui/cdk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideOverlays(
      withShell(DRAWER_SHELL_TOKEN, OverlayDrawerShellComponent),  // required for drawers
    ),
  ],
};
```

`provideOverlays()` registers the default shells for modal, connected, notification, and tooltip overlays. Use `withShell` to add or override shells.

Place these in the root component template:

```html
<router-outlet />
<fibo-confirmation-overlay-container />
<fibo-notification-overlay-container />
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
2. Overlay opens when `content` is non-null
3. `setup(session)` runs, behaviors are attached
4. `afterOpened` fires after first render
5. Close requested → `beforeClose` hooks run
6. `isOpen` → `false`, leave animation plays
7. `afterClose` handlers run
