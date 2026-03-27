# Overlays

`Overlay` is the state-driven runtime for temporary UI that is rendered from a template and controlled by one open state.

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
    <div
      class="fixed top-28 left-1/2 z-10 w-80 -translate-x-1/2 rounded-xl bg-background p-4 shadow-lg outline-1 -outline-offset-1 outline-black/13 dark:outline-white/5"
    >
      <div class="text-sm font-medium">Overlay lifecycle</div>
      <p class="mt-2 text-sm text-foreground-secondary">
        Close it with outside click, focus leave, or the explicit action below.
      </p>

      <div class="mt-4 flex items-center gap-2">
        <button type="button" class="btn btn-sm" (click)="actionCount.update(v => v + 1)">
          Action
        </button>
        <button type="button" class="btn btn-sm btn-inverse" (click)="close()">
          Close
        </button>
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

  readonly overlayConfig = computed(() => ({
    templateRef: this.overlayTpl(),
    referenceElement: this.triggerButton().nativeElement,
    category: 'popover' as const,
  }));

  readonly overlayHandle = createOverlay(this.isOpen, this.overlayConfig, overlay => {
    closeOnFocusLeave(overlay);
    closeOnOutsideClick(overlay);
    trapOverlayFocus(overlay);
    restoreTriggerFocusOnClose(overlay);
  });

  toggle() {
    this.isOpen.update(value => !value);
  }

  close() {
    this.isOpen.set(false);
  }
}
```

## Core Contract

`createOverlay(isOpen, config, setup?)` connects component state to the overlay runtime.

- `isOpen` is the source of truth for open and close
- `config` describes what to render for the current open cycle
- `setup(...)` attaches temporary behavior for that overlay lifecycle

This keeps rendering, state, and interaction policies separate.

## Overlay Config

`config` is a computed object with three main responsibilities:

- `templateRef` provides the rendered content
- `referenceElement` describes the element that the overlay belongs to
- `category` defines runtime grouping such as z-index and global handling rules

`templateRef` and `referenceElement` can update while the overlay is open.  
`category` is fixed for one open cycle.

## Setup Function

`setup(...)` runs for one open cycle after the overlay is created.

Use it to register behavior such as:

- close requests
- focus handling
- outside interaction
- temporary effects and cleanup

The setup API exposes:

- `requestClose(...)`
- `beforeClose(...)`
- `afterClose(...)`
- `afterOpened(...)`
- `effect(...)`
- `onCleanup(...)`

## Behavior Helpers

Behavior helpers are reusable lifecycle policies that plug into `setup(...)`.

### `closeOnOutsideClick(...)`

Closes when the user clicks outside the reference element and outside the current overlay branch.

### `closeOnFocusLeave(...)`

Closes when focus leaves both the reference element and the current overlay branch.

### `trapOverlayFocus(...)`

Unified focus policy for overlays:

- autofocus on open
- cyclic `Tab/Shift+Tab` inside current overlay container
- branch-aware focus guard for modal categories (`dialog`, `confirmation`)

Use `[fiboFocusInitial]` marker on an element inside overlay content to override the initial focus target.

### `restoreTriggerFocusOnClose(...)`

Returns focus to the reference element when close completes from inside the same overlay branch.

### `backdropClosable` / `blockScroll`

Modal overlays can close on backdrop click and lock document scroll through strategy options:

```ts
createOverlay(isOpen, modalOverlay({
  templateRef,
  backdropClosable: true,
  blockScroll: true,
}), overlay => {
  restoreTriggerFocusOnClose(overlay);
  trapOverlayFocus(overlay);
});
```

### `closeOnScroll(...)`

Closes the overlay when the user scrolls outside the overlay container. Useful for tooltips and popovers that lose context when content scrolls.

## Runtime Architecture

The overlay system is split by responsibility.

### `OverlayContainerComponent`

Permanent rendering surface for active overlays.

It:

- renders the current overlay list
- provides `OVERLAY_HANDLE` to rendered content
- completes `afterClose(...)` after leave animation
- applies global document concerns such as scroll lock

### `OverlayStack`

Runtime coordinator for the whole overlay system.

It:

- creates and removes overlays
- manages ordering and z-index
- tracks nested overlay branches
- resolves topmost close on `Escape`
- waits for template readiness when open state is already `true`

### `OverlayHandle`

Runtime object for one currently open overlay.

It exposes:

- id
- category
- z-index
- current `templateRef`
- current `referenceElement`
- `close()`

### `OverlaySession`

Temporary lifecycle API passed into `setup(...)`.

It exists only for the current open cycle and is the place where behavior is wired.

## Nested Overlay Branches

Overlays can be nested.

If an overlay opens from inside another overlay container, it becomes part of that parent branch.

This keeps interaction stable:

- click inside a child overlay is not treated as outside click for the parent
- moving focus from parent to child overlay is not treated as leaving the overlay
- focus restore respects the whole branch, not only one container

## Lifecycle

Each overlay follows the same lifecycle:

1. component state sets `isOpen = true`
2. overlay opens when `templateRef` is ready
3. `setup(...)` connects behavior
4. `afterOpened(...)` runs after render
5. close is requested by state or a helper
6. `beforeClose(...)` runs
7. leave animation finishes
8. `afterClose(...)` runs

This is the base model for every overlay consumer in the system.
