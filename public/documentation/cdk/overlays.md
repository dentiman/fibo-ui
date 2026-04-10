# Overlays

Overlays are the signal-driven runtime layer for temporary UI: dialogs, drawers, popovers, menus, tooltips, and other temporary surfaces.

This page is a guide to the system itself: how overlays are composed, how they render, how shells are registered, and which entry point to choose. Detailed API reference belongs elsewhere.

## Mental Model

Every overlay in fibo-ui is built from the same parts:

- `isOpen` — the source of truth for whether the overlay should exist
- `behavior` — close rules, backdrop, scroll locking, and the shell token to render
- `position` — `global`, `connected`, or `coordinate`
- `content` — a `TemplateRef`, string, or `null` while content is not ready yet
- `OverlayStack` — the runtime registry that opens, closes, orders, and tracks nesting
- `OverlayStackOutlet` — the app-level renderer that instantiates shell components
- `OverlayHandle` — the runtime object for one open cycle

The open flow is:

1. A component, directive, or service flips `isOpen` to `true`.
2. A recipe or `createOverlay()` asks `OverlayStack` to create a new open cycle.
3. The stack creates an `OverlayHandle`, registers it, and tracks parent-child branch relations.
4. The root outlet resolves the shell component from `behavior.shell` through DI.
5. The shell renders `OverlayContent` and attaches the right host directives such as `OverlayContainer`, `OverlayPosition`, or `OverlayPanel`.
6. Close policies, focus rules, guards, and lifecycle hooks run for that open cycle until the overlay is destroyed.

This separation is intentional:

- content decides what to show
- behavior decides how it closes
- position decides where it appears
- shell decides how it is hosted and styled

## App Setup

The overlay system needs one root renderer at the application root.

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { DRAWER_SHELL_TOKEN } from '@fibo-ui/cdk';
import { OverlayDrawerShellComponent, provideOverlays, withShell } from '@fibo-ui/components';

export const appConfig: ApplicationConfig = {
  providers: [
    provideOverlays(
      withShell(DRAWER_SHELL_TOKEN, OverlayDrawerShellComponent),
    ),
  ],
};
```

```html
<!-- app.html -->
<router-outlet />
<fibo-overlay-stack-outlet />
```

What this setup does:

- `provideOverlays()` registers the default shell mapping for the built-in shell tokens
- `withShell()` adds or overrides a shell mapping for a token such as `DRAWER_SHELL_TOKEN`
- `<fibo-overlay-stack-outlet>` renders every currently open overlay from the stack

If you are using CDK overlays only, the essential piece is still `<fibo-overlay-stack-outlet>`.

## Basic Usage

Use `createConnectedOverlay()` when you need a popover anchored to a trigger element and the open state is local to the component.

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

  readonly overlay = createConnectedOverlay(
    this.isOpen,
    () => ({ referenceElement: this.btn().nativeElement }),
    this.tpl,
    { restoreFocusTo: () => this.btn().nativeElement },
  );

  toggle() {
    this.isOpen.update(v => !v);
  }
}
```

The important part is the composition:

- `isOpen` owns the state
- the factory `() => ({ referenceElement })` anchors the overlay to the trigger
- the template receives the current `OverlayHandle` as `let-overlay`
- `restoreFocusTo` returns focus to the button when the overlay closes

## Shell Components

A shell component is the visual host for an overlay.

It is not the business content and it is not the trigger. The shell is the layer that the outlet creates dynamically when an overlay opens. Its job is to host the content, attach host directives, and provide the right layout semantics for that overlay kind.

Every shell follows the same contract:

```ts
readonly overlay = input.required<OverlayHandle>();
```

That `overlay` input is the current runtime handle. The same handle is also:

- available inside content templates as `let-overlay`
- injectable through the `OVERLAY_HANDLE` token
- used by the shell host directives to attach close policies and DOM metadata

In practice, shell components usually compose from these primitives:

- `OverlayContainer` — required host directive for lifecycle wiring, close policies, `OVERLAY_HANDLE`, and `data-overlay-container-id`
- `OverlayPosition` — used by connected or coordinate overlays that need floating positioning
- `OverlayPanel` — panel semantics for modal and drawer-style shells
- `OverlayContent` — renders the overlay content from the handle

Minimal custom shell example:

```ts
import { Component, ViewEncapsulation, input } from '@angular/core';
import { OverlayContainer, OverlayContent, OverlayHandle, OverlayPanel, OverlayShell } from '@fibo-ui/cdk';

@Component({
  selector: 'app-sheet-shell',
  imports: [OverlayContent],
  hostDirectives: [
    { directive: OverlayContainer, inputs: ['overlay'] },
    OverlayPanel,
  ],
  template: `<fibo-overlay-content [overlay]="overlay()" />`,
  host: {
    class: 'fixed inset-y-0 right-0 w-full max-w-lg bg-background shadow-xl',
  },
  encapsulation: ViewEncapsulation.None,
})
export class AppSheetShellComponent implements OverlayShell {
  readonly overlay = input.required<OverlayHandle>();
}
```

Rules of thumb:

- every shell should accept the `overlay` input
- every shell should attach `OverlayContainer`
- connected popovers need `OverlayPosition`
- dialog and drawer shells usually add `OverlayPanel`
- shell components should stay thin; content and state still belong to the overlay caller

## Registering Shells

Shell resolution is DI-driven. The outlet does not know about drawers, modals, or tooltips directly. It only receives an `OverlayHandle`, reads `overlay.behavior.shell`, and asks the injector which component is registered for that token.

That means shell registration is just provider configuration:

```ts
import { InjectionToken, Type } from '@angular/core';
import { provideOverlays, withShell } from '@fibo-ui/components';

export const APP_SHEET_SHELL_TOKEN = new InjectionToken<Type<any>>('APP_SHEET_SHELL_TOKEN');

export const appConfig: ApplicationConfig = {
  providers: [
    provideOverlays(
      withShell(APP_SHEET_SHELL_TOKEN, AppSheetShellComponent),
    ),
  ],
};
```

Then pass that token to the `shell` option of a recipe:

```ts
readonly overlay = createGlobalOverlay(
  this.isOpen,
  this.sheetTpl,
  {
    shell: APP_SHEET_SHELL_TOKEN,
    restoreFocusTo: () => this.trigger().nativeElement,
  },
);
```

This is the main extension point of the system. If you want a new visual host, new animation, or a different layout surface, you usually add or override a shell. If you want different lifecycle or close logic, you change the recipe options or the `setup(session)` callback instead.

## Lifecycle, Close Rules, and Focus

Recipes accept an optional `setup(session)` callback for per-open-cycle logic that goes beyond what the standard options cover.

Use it for:

- `afterOpened()` when the DOM must already exist
- `beforeClose()` when the DOM is still alive and the current `activeElement` matters
- `afterClose()` for teardown after the shell is gone
- `canClose()` to block closing for some reasons
- `effect()` and `onCleanup()` for open-cycle scoped reactive work

```ts
readonly overlay = createGlobalOverlay(
  this.isOpen,
  this.dialogTpl,
  {
    restoreFocusTo: () => this.trigger().nativeElement,
    setup: session => {
      session.canClose(reason => reason !== 'outside-click' || !this.isDirty());
      session.afterClose(() => this.resetDraft());
    },
  },
);
```

For focus trapping and restoration without custom setup logic, use the declarative options directly:

```ts
readonly overlay = createGlobalOverlay(this.isOpen, this.dialogTpl, {
  trapFocus: { guard: true },
  restoreFocusTo: () => this.trigger().nativeElement,
});
```

How close rules are applied:

- `OverlayContainer` installs focus-leave, scroll, Escape, and scroll-lock behavior based on `behavior`
- `OverlayStackOutlet` handles outside-click dispatch centrally for the whole stack
- `OverlaySession` guards can still block a close request before `isOpen` flips back to `false`

This makes the control flow predictable: the recipe provides the default policy, and `setup(session)` adds the extra rules for a particular overlay.

## Nested Overlays

The stack is branch-aware.

If overlay B is opened from inside overlay A, B belongs to A's branch. That affects close behavior in the way users expect:

- clicking inside a child overlay is not an outside click for the parent
- moving focus into a child overlay is not a focus-leave for the parent
- Escape and outside-click are still resolved from the top of the stack downward

This is especially important for menu chains, submenu patterns, and popovers that can open nested child overlays.

Conceptually, the system treats overlays as an ordered stack with parent-child branches, not as isolated popups.

## Service-Driven Overlays

Use `createSingletonGlobalOverlay()` or `createSingletonConnectedOverlay()` when the overlay is owned by a service rather than by a single feature component.

This is the pattern for app-level or shared overlays:

- the service owns `isOpen`
- the service owns additional config state
- the service exposes a singleton overlay handle signal
- a root-level host component provides the actual template once via `templateRef`

```ts
readonly overlay = createSingletonGlobalOverlay({
  restoreFocusTo: () => this.config()?.referenceElement ?? null,
  setup: session => {
    session.afterClose(() => {
      if (!this.overlay.isOpen()) this.config.set(null);
    });
  },
});
```

The singleton variants remove the repeated `templateRef + isOpen + createOverlay()` boilerplate and keep app-wide overlays centralized.

## Entry Points

Not every overlay needs to start from the low-level primitive. Choose the highest layer that still fits the use case.

**Trigger directives** — declarative, zero configuration:

- `fiboPopoverTrigger` for anchored popovers
- `fiboDialogTrigger` for modal dialogs
- `fiboDrawerTrigger` for drawers

**Overlay recipes** — for programmatic overlays where state or content is managed by the component:

- `createConnectedOverlay()` — anchored to an element (select, combobox, popover, tooltip)
- `createGlobalOverlay()` — centered or fixed (dialog, drawer, notification)
- `createCoordinateOverlay()` — anchored to x/y coordinates (context menu)
- `createSingletonGlobalOverlay()` / `createSingletonConnectedOverlay()` — service-owned variants

Each recipe takes the open signal, a position factory or content signal, and an options object for shell overrides, close policies, and focus management. Focus trapping and restoration are declarative options, not manual setup calls.

**`createOverlay()` primitive** — when you need full control: a custom shell token, a position type not covered by recipes, or a setup callback with complex lifecycle logic.

## Choosing the Right Entry Point

Choose the highest-level entry point that still matches your use case:

- use trigger directives when the default interaction pattern already matches the feature
- use recipes for component-owned overlays such as select, combobox, datepicker, or a custom popover
- use singleton recipe variants for app-level or service-owned overlays
- use `createOverlay()` directly when registering a custom shell or composing unusual behaviors
- register a custom shell when the visual host must change

If you keep that layering in mind, the system stays easy to reason about:

- state opens the overlay
- the stack manages the cycle
- the outlet renders the shell
- the shell hosts the content
- the session owns lifecycle work
