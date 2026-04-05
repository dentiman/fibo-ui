# Overlays

`createOverlay` is the signal-driven primitive for all temporary UI: modals, popovers, menus, tooltips, drawers, and notifications.

The overlay system handles:

- **Rendering** — any `ng-template` projected into a portal outside the component tree
- **Positioning** — connected (anchored to an element), global (centered), coordinate (x/y)
- **Behaviors** — outside click, focus leave, escape, scroll, backdrop, scroll lock
- **Stacking** — ordered stack with parent-child branch awareness for nested overlays
- **Focus** — auto-focus on open, Tab cycling, focus trap for modals, focus restore on close
- **Lifecycle** — open/close guards, before/after hooks, scoped effects per open cycle

## Basic Usage

:::example cdk-overlays-basic

```html {example="cdk-overlays-basic"}
<button #btn type="button" class="btn btn-primary" (click)="toggle()">Open</button>

<ng-template #tpl let-overlay>
  <div class="flex items-center justify-between gap-6 p-3">
    <span class="text-sm">Popover content</span>
    <button type="button" class="btn btn-sm" (click)="overlay.close()">Close</button>
  </div>
</ng-template>
```

```ts {example="cdk-overlays-basic"}
export class CdkOverlaysBasicExample {
  private readonly btn = viewChild.required<ElementRef<HTMLElement>>('btn');
  private readonly tpl = viewChild.required<TemplateRef<unknown>>('tpl');

  readonly isOpen = signal(false);

readonly overlay = createOverlay(
    this.isOpen,
    { shell: CONNECTED_SHELL_TOKEN, closeOnOutsideClick: true, closeOnFocusLeave: true, closeOnEscape: true },
    connectedPosition(() => ({ referenceElement: this.btn().nativeElement })),
    this.tpl,
    session => { restoreTriggerFocusOnClose(session, () => this.btn().nativeElement); },
  );

  toggle() { this.isOpen.update(v => !v); }
}
```

## createOverlay

```ts
createOverlay(
  isOpen: WritableSignal<boolean>,
  behavior: OverlayBehaviorConfig,
  position: Signal<OverlayPositionConfig>,
  content: Signal<TemplateRef | string | null>,
  setup?: (session: OverlaySession) => void,
): Signal<OverlayHandle | null>
```

- `isOpen` — source of truth; the overlay opens/closes reactively with this signal
- `behavior` — which shell to render into and which close triggers to attach
- `position` — reactive; use `connectedPosition()` or `signal(globalPosition())`
- `content` — `null` defers opening until a template is available
- `setup(session)` — optional, called once per open cycle for lifecycle hooks

**Behavior config** — `OverlayBehaviorConfig`:

```ts
interface OverlayBehaviorConfig {
  shell: InjectionToken<Type<any>>;
  needsBackdrop?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnFocusLeave?: boolean;
  closeOnScroll?: boolean;
  blockScroll?: boolean;
  tag?: string;           // e.g. 'menu' — used by closeAllByTag
}
```

**Position** — `connectedPosition(factory)` wraps the factory in `computed()`:

```ts
connectedPosition(() => ({
  referenceElement: this.triggerEl().nativeElement,
  placement?: Placement,  // e.g. 'bottom-start'
  matchWidth?: boolean,
  offset?: number,
}))
```

For centered modals and drawers: `signal(globalPosition())`.

**Template context** — templates receive the `OverlayHandle` as `$implicit`:

```html
<ng-template #tpl let-overlay>
  <button (click)="overlay.close()">Close</button>
</ng-template>
```

**OverlayHandle** — runtime object returned by `createOverlay`:

```ts
overlay.id           // unique string
overlay.behavior     // OverlayBehaviorConfig used to open
overlay.position     // Signal<OverlayPositionConfig>
overlay.content      // Signal<TemplateRef | string | undefined>
overlay.close(reason?)
```

## Bootstrap

Register overlay shells once at app startup with `provideOverlays()`:

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideOverlays(
      withShell(DRAWER_SHELL_TOKEN, OverlayDrawerShellComponent),
    ),
  ],
};
```

`provideOverlays()` registers default shells for modal, connected, notification, and tooltip overlays. Use `withShell` to add or override. Place outlet components in the root template:

```html
<router-outlet />
<fibo-confirmation-overlay-container />
<fibo-notification-overlay-container />
<fibo-overlay-stack-outlet />
```

## Advanced

**Setup function** — `setup(session)` runs once per open cycle for hooks not covered by behavior flags:

```ts
createOverlay(this.isOpen, behavior, position, content, session => {
  session.canClose(reason => reason !== 'outside-click' || !this.isDirty());
  session.afterClose(() => this.formData.set(null));
  session.effect(() => console.log('open, items:', this.items()));
});
```

Session API: `handle`, `requestClose(reason, event?)`, `afterOpened(handler)`, `beforeClose(handler)`, `afterClose(handler)`, `canClose(guard)`, `effect(runner)`, `onCleanup(fn)`, `isInOverlayBranch(target)`.

---

**Behavior composition functions** from `@fibo-ui/cdk` — composable inside `setup(session)`:

`restoreTriggerFocusOnClose(session, getTarget?)` — restores focus to the trigger on close, only if focus has not already moved elsewhere.

`trapOverlayFocus(session, options?)` — auto-focuses on open, cycles Tab inside the container, optionally guards focus escape (`guard: true` for modals).

| Option | Default | Description |
|---|---|---|
| `guard` | `false` | Prevent focus from leaving the overlay |
| `autoFocus` | `true` | Focus first element on open |
| `loopTab` | `true` | Cycle Tab at boundaries |

---

**`createSingletonOverlay`** — reduces boilerplate for service-driven overlays:

```ts
readonly overlay = createSingletonOverlay(
  dialogBehavior(),
  signal(globalPosition()),
  session => {
    trapOverlayFocus(session, { guard: true });
    restoreTriggerFocusOnClose(session, () => this.triggerEl ?? null);
  },
);

afterNextRender(() => { this.overlay.templateRef.set(this.tpl()); });

open() { this.overlay.isOpen.set(true); }
close() { this.overlay.isOpen.set(false); }
```

Exposes: `templateRef`, `isOpen`, `handle`.

---

**Nested overlays** — child overlays are part of the parent branch: clicks inside a child are not outside clicks for the parent; focus moving to a child is not focus-leave. Use `session.isInOverlayBranch(target)` to traverse the chain.

**Lifecycle**: `isOpen → true` → overlay opens (when content is non-null) → `setup(session)` → `afterOpened` → close requested → `beforeClose` → `isOpen → false` → `afterClose`.

**Close reasons**: `'programmatic'` | `'escape'` | `'focusout'` | `'outside-click'` | `'blur'` | `'state'` | `'destroy'`.

## Behavior Presets

`@fibo-ui/components` provides preset factories that fill in sensible defaults for `OverlayBehaviorConfig`:

| Function | Shell | Close triggers |
|---|---|---|
| `dialogBehavior()` | `MODAL_SHELL_TOKEN` | backdrop, blockScroll, outsideClick, escape |
| `drawerBehavior()` | `DRAWER_SHELL_TOKEN` | backdrop, blockScroll, outsideClick, escape |
| `connectedBehavior()` | `CONNECTED_SHELL_TOKEN` | outsideClick, focusLeave, escape |
| `menuBehavior()` | `CONNECTED_SHELL_TOKEN` | same + `tag: 'menu'` |
| `tooltipBehavior()` | `TOOLTIP_SHELL_TOKEN` | scroll, no escape |
| `notificationBehavior()` | `NOTIFICATION_SHELL_TOKEN` | no escape |

## Triggers

Ready-made directives that compose `createOverlay` with the right behavior, position, and focus management. Import from `@fibo-ui/cdk`.

:::example cdk-popover-trigger

**`[fiboPopoverTrigger]`** — connected overlay anchored to the trigger. Closes on outside click, focus leave, and Escape. Toggle semantics.

```html {example="cdk-popover-trigger" title="Template"}
<button type="button" class="btn btn-primary" fiboPopoverTrigger [content]="popoverTpl">
  Open Popover
</button>

<!-- exportAs gives access to open() / close() / toggle() from inside the template -->
<button
  #ref="PopoverTrigger"
  type="button"
  class="btn btn-secondary"
  fiboPopoverTrigger
  placement="bottom-start"
  [content]="actionsTpl"
>
  With actions
</button>

<ng-template #popoverTpl>
  <div class="w-64 p-3"> ... </div>
</ng-template>

<ng-template #actionsTpl>
  <div class="w-48">
    <button (click)="ref.close()">Action one</button>
    <button (click)="ref.close()">Action two</button>
  </div>
</ng-template>
```

```ts {example="cdk-popover-trigger" title="Component"}
@Component({
  imports: [PopoverTrigger],
  template: '...',
})
export class MyComponent {}
```

| Input | Type | Description |
|---|---|---|
| `content` | `TemplateRef<unknown>` | Required. Template rendered inside the overlay |
| `open` | `boolean` | Two-way model for open state |
| `placement` | `Placement` | Floating-UI placement, e.g. `'bottom-start'` |
| `offset` | `number` | Gap in px between trigger and overlay |

Methods via `exportAs: 'PopoverTrigger'`: `open()`, `close()`, `toggle()`.

---

**`[fiboDialogTrigger]`** — global-position overlay with backdrop, scroll lock, and focus trap. Opens on click or Enter.

```html
<button fiboDialogTrigger [content]="dialogTpl">Open Dialog</button>

<ng-template #dialogTpl>
  <div class="p-6 w-96">
    <h2 class="text-lg font-semibold mb-2">Dialog Title</h2>
  </div>
</ng-template>
```

| Input | Type | Description |
|---|---|---|
| `content` | `TemplateRef<unknown>` | Required. Dialog body template |
| `open` | `boolean` | Two-way model for open state |

Methods via `exportAs: 'DialogTrigger'`: `open()`, `close()`.

---

**`[fiboDrawerTrigger]`** — global-position overlay with backdrop and scroll lock via `DRAWER_SHELL_TOKEN`. Requires the drawer shell registered in `provideOverlays()`.

```html
<button fiboDrawerTrigger [content]="drawerTpl">Open Drawer</button>

<ng-template #drawerTpl let-overlay>
  <div class="flex h-full flex-col p-6">
    <div class="mt-auto">
      <button class="btn" (click)="overlay.close()">Close</button>
    </div>
  </div>
</ng-template>
```

| Input | Type | Description |
|---|---|---|
| `content` | `TemplateRef<unknown>` | Required. Drawer body template |
| `open` | `boolean` | Two-way model for open state |

Methods via `exportAs: 'DrawerTrigger'`: `open()`, `close()`.
