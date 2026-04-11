# Overlays

`createOverlay()` is the primary entry point into the fibo-ui overlay system.

It is the single public API for dialogs, drawers, popovers, menus, tooltips, context menus, and service-driven floating UI. The public function stays small on purpose: you describe one overlay config, and the runtime decides how to open it, render it, position it, wire close policies, and manage one open cycle.

## CreateOverlay

Start here. This is the shape to read first when you work with overlays:

```ts
import type {
  InjectionToken,
  Signal,
  TemplateRef,
  Type,
  WritableSignal,
} from '@angular/core';
import type { TrapOverlayFocusOptions } from '@fibo-ui/cdk';

export function createOverlay(
  factory: () => {
    // ─── Core: live reactive ─────────────────────────────
    state: WritableSignal<boolean>;
    content: TemplateRef<unknown> | string | null;

    position?:
      | {
          connectedTo: HTMLElement | null;
          placement?: Placement;
          matchWidth?: boolean;
          offset?: number;
        }
      | {
          x: number;
          y: number;
          placement?: Placement;
        };

    // ─── Shell / render policy (SNAPSHOT) ────────────────
    shell?: InjectionToken<Type<any>>;
    /** Render backdrop shell. This is render policy, not a close trigger. */
    backdrop?: boolean;
    /** Lock document scroll while the overlay is open. Also render policy. */
    blockScroll?: boolean;

    // ─── Focus (SNAPSHOT; restoreTo is lazy on close) ────
    focus?: {
      trap?: boolean | TrapOverlayFocusOptions;
      restoreTo?: () => HTMLElement | null;
    };

    // ─── Close triggers (SNAPSHOT) ───────────────────────
    close?: {
      outsideClick?: boolean;
      escape?: boolean;
      focusLeave?: boolean;
      scroll?: boolean;
    };

    // ─── Lifecycle hooks (SNAPSHOT) ──────────────────────
    lifecycle?: {
      afterOpened?: Array<(overlay: OverlayHandle) => void>;
      beforeClose?: Array<
        (ctx: OverlayCloseContext, overlay: OverlayHandle, reason: OverlayCloseReason) => void
      >;
      afterClose?: Array<(overlay: OverlayHandle, reason: OverlayCloseReason) => void>;
      canClose?: Array<(reason: OverlayCloseReason, event?: Event) => boolean | void>;
    };

    // ─── Escape hatch (SNAPSHOT) ─────────────────────────
    setup?: (session: OverlaySession) => void;
  },
): Signal<OverlayHandle | null>;
```

Important rules:

- `factory()` is intentionally read lazily, not synchronously in the constructor path
- this is what makes `input.required()` and `viewChild.required()` safe inside overlay configs
- `state` is always the source of truth for whether the overlay should exist
- `content` and `position` values stay live-reactive while the overlay is open
- everything else is treated as open-cycle snapshot configuration

## Example

This is the standard connected overlay shape used by field overlays, popovers, select panels, and similar UI:

```ts
readonly overlay = createOverlay(() => ({
  state: this.isOpen,
  content: this.overlayContent(),

  position: {
    connectedTo: this.host?.referenceElement() ?? this.interactive.element(),
    matchWidth: this.matchWidth(),
  },

  focus: {
    restoreTo: () =>
      this.host?.focusReturnTarget() ?? this.interactive.focusReturnTarget(),
  },
}));
```

Why this matters:

- `overlayContent()` may come from `input.required()`
- `connectedTo` may change reactively while the overlay is open
- `restoreTo` must stay lazy so focus can be restored to the latest valid target on close

## Reactive vs Snapshot

This is the most important runtime contract in the system.

### Live reactive during an open session

These values are meant to update while the current overlay instance stays alive:

- `content`
- `position.connectedTo`
- `position.placement`
- `position.matchWidth`
- `position.offset`
- `position.x`
- `position.y`

That means you can:

- swap the anchor element for a tooltip or popover without closing it
- update placement reactively
- update coordinates for a context menu
- keep the same `OverlayHandle` while content changes from one template or string to another

### Snapshot per open cycle

These values are read once for the current open cycle and are not supposed to change mid-session:

- `shell`
- `backdrop`
- `blockScroll`
- `focus.trap`
- `close.outsideClick`
- `close.escape`
- `close.focusLeave`
- `close.scroll`
- all `lifecycle` arrays
- `setup`

This is intentional. The shell host layer installs listeners and host behavior once when the shell is created. Reconfiguring those pieces reactively in the middle of an already-open overlay would produce stale listeners and unclear lifecycle ordering.

### Lazy on close

`focus.restoreTo` is special:

- the function reference is captured for the current open cycle
- the function itself is only called when closing
- this lets the runtime restore focus to the latest valid element instead of an early snapshot

## Position Families

Overlay family is derived from `position`.

- no `position` -> `global`
- `position.connectedTo` -> `connected`
- `position.x` and `position.y` -> `coordinate`

Defaults come from that family:

- `global` defaults to modal shell, backdrop, scroll lock, and focus trap with guard
- `connected` defaults to connected shell, no backdrop, no scroll lock, no trap, and `focusLeave: true`
- `coordinate` shares the connected shell defaults, but is positioned from a point instead of an element

Inside one open session, the position family must not change. A connected overlay can update its anchor element or placement, but it must not become a global overlay without closing first and reopening with a new config.

## Lifecycle Model

Each open cycle creates exactly one `OverlayHandle`.

The close pipeline is:

1. A close request happens.
2. `canClose` guards run first.
3. `beforeClose` runs synchronously while the DOM is still alive.
4. `state` flips back to `false`.
5. The overlay is removed from the stack.
6. The shell is destroyed.
7. `afterClose` runs after shell destruction is complete.

Lifecycle hooks are for policy, not for rendering. Use them when the standard config is not enough:

- `afterOpened` for DOM-dependent logic after the overlay is rendered
- `beforeClose` for focus-sensitive or DOM-sensitive cleanup
- `afterClose` for cleanup that must wait until the shell is gone
- `canClose` to veto some close reasons
- `setup(session)` as the lowest-level escape hatch

## Focus and Close Policies

The overlay runtime deliberately separates focus policy from close policy.

### Focus

Use `focus.trap` for modal or guarded focus behavior:

```ts
focus: {
  trap: { guard: true },
  restoreTo: () => this.trigger().nativeElement,
}
```

Typical guidance:

- dialogs and drawers usually trap focus
- popovers, menus, select panels, and tooltips usually do not
- use `restoreTo` whenever the overlay was opened from a meaningful trigger

### Close triggers

Use `close` for interaction-driven close rules:

```ts
close: {
  outsideClick: true,
  escape: true,
  focusLeave: true,
  scroll: false,
}
```

Typical guidance:

- modal overlays usually close on outside click and Escape
- connected overlays often use `focusLeave: true`
- tooltips often disable outside click, Escape, and focus leave, but enable scroll close
- notification overlays usually disable all interactive close triggers

## Shell and Render Policy

The shell is the visual host component resolved through DI.

Use `shell` when you want a specific shell token such as drawer, tooltip, or notification. If you omit it, the runtime chooses the default shell from the overlay family.

`backdrop` and `blockScroll` live at the top level because they are render policy, not close policy:

- `backdrop` decides whether a backdrop shell should be rendered
- `blockScroll` decides whether document scroll should be locked while the overlay is open

This distinction is important because these settings affect hosting and document behavior, not just close conditions.

## Runtime Architecture

The public API is small, but the runtime is layered.

- `createOverlay()` accepts one config factory
- `OverlayStack` owns open cycles, lifecycle state, nesting, guards, and teardown
- `OverlayStackOutlet` renders every currently open overlay
- `OverlayContainer` attaches DOM metadata, host element wiring, and shell-scoped listeners
- `OverlayPosition` handles connected and coordinate floating positioning
- `OverlayContent` renders the actual string or template content

Think in terms of responsibilities:

- content decides what to render
- position decides where it should appear
- shell decides how it is hosted
- close and focus decide how the user can leave it
- the stack owns the lifecycle of the whole session

## App Setup

The system needs one root overlay outlet in the application tree:

```html
<router-outlet />
<fibo-overlay-stack-outlet />
```

If you use shell mappings from `@fibo-ui/components`, register them in app providers:

```ts
import { ApplicationConfig } from '@angular/core';
import { DRAWER_SHELL_TOKEN } from '@fibo-ui/cdk';
import {
  OverlayDrawerShellComponent,
  provideOverlays,
  withShell,
} from '@fibo-ui/components';

export const appConfig: ApplicationConfig = {
  providers: [
    provideOverlays(
      withShell(DRAWER_SHELL_TOKEN, OverlayDrawerShellComponent),
    ),
  ],
};
```

## Custom Shells

A shell is the visual host for an overlay. Every shell accepts the same runtime handle:

```ts
readonly overlay = input.required<OverlayHandle>();
```

Most custom shells stay thin and compose from CDK primitives:

- `OverlayContainer` for lifecycle wiring and host metadata
- `OverlayPosition` for floating positioning
- `OverlayPanel` for dialog-style panel semantics
- `OverlayContent` for rendering the content itself

Minimal shell example:

```ts
import { Component, ViewEncapsulation, input } from '@angular/core';
import {
  OverlayContainer,
  OverlayContent,
  OverlayHandle,
  OverlayPanel,
  OverlayShell,
} from '@fibo-ui/cdk';

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

## Nested Overlays

The stack is branch-aware.

If one overlay opens another, the child belongs to the parent branch. This ensures that:

- clicking inside a child overlay is not an outside click for the parent
- moving focus into a child overlay is not a focus leave for the parent
- topmost close behavior still resolves correctly for Escape and outside click

This matters for submenu chains, nested popovers, combobox panels with child overlays, and other multi-surface interactions.
