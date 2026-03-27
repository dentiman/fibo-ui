# Overlay Strategies

Current strategy presets in `projects/fibo-ui/cdk/src/lib/overlay/overlay-strategy.ts`.

## Shared Base Options

Every strategy accepts:

- `templateRef: TemplateRef<any>`
- `referenceElement?: HTMLElement | null`
- `interactionRoot?: HTMLElement | null`
- `focusReturnTarget?: HTMLElement | null`

`createOverlay(...)` uses `strategy.config` to sync render inputs while open.

## Strategy Kinds

```ts
type OverlayStrategyKind = 'connected' | 'modal' | 'menu' | 'tooltip' | 'notification';
```

## Presets

### `connectedOverlay(options)`

For anchored interactive popovers (select, combobox, datepicker, custom popover).

Extra options:

- `placement?: Placement` (default in shell: `'bottom'`)
- `matchWidth?: boolean` (default `false`)
- `offset?: number` (default in shell: `5`)

Defaults metadata:

- `category: 'popover'`
- `defaultBehaviors: ['closeOnOutsideClick', 'closeOnFocusLeave', 'restoreTriggerFocusOnClose']`

### `modalOverlay(options)`

For dialogs and confirmations.

Extra options:

- `backdropClosable?: boolean` (default `true`)
- `blockScroll?: boolean` (default `true`)

Defaults metadata:

- `category: 'dialog'`
- `defaultBehaviors: ['trapOverlayFocus', 'restoreTriggerFocusOnClose']`

### `menuOverlay(options)`

For root menus and submenus.

Extra options:

- `placement?: Placement` (default `'right-start'`)
- `offset?: number` (default `1`)
- `openDelay?: number` (default `0`)
- `closeDelay?: number` (default `0`)

Defaults metadata:

- `category: 'menu'`
- `defaultBehaviors: ['closeOnOutsideClick', 'closeOnFocusLeave', 'restoreTriggerFocusOnClose']`

### `tooltipOverlay(options)`

For passive floating hints.

Extra options:

- `placement?: Placement` (default in shell: `'top'`)
- `showDelay?: number` (default `0`)
- `hideDelay?: number` (default `0`)

Defaults metadata:

- `category: 'tooltip'`
- `defaultBehaviors: ['closeOnScroll']`

### `notificationOverlay(options)`

For global toast/notification containers.

Defaults metadata:

- `category: 'notification'`
- `defaultBehaviors: []`

## Important Notes

- `defaultBehaviors` are strategy metadata. Behaviors are still attached in `setup` manually.
- `category` affects z-index tier and Escape handling.
- Runtime entry point stays the same for all presets:

```ts
createOverlay(isOpenSignal, strategySignalOrValue, setup?);
```
