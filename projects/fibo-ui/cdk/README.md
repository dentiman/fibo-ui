# @fibo-ui/cdk

Signal-native **headless behavior primitives** for Angular. No styles, no markup opinions — just the hard parts: overlays, keyboard navigation, selection models, form field composition, and accessibility.

`@fibo-ui/cdk` is the foundation of [`@fibo-ui/components`](https://www.npmjs.com/package/@fibo-ui/components), but it is designed to be used on its own to build custom design systems.

> **Status: beta.** APIs may change between minor versions until 1.0.

## Installation

```bash
npm install @fibo-ui/cdk
```

Peer dependencies: `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router` (v21+), `@floating-ui/dom`, `date-fns`, `rxjs`.

## What's inside

### Overlay system

A single `createOverlay(factory)` API powers every floating surface — dialogs, drawers, popovers, tooltips, notifications.

- **Sessions** manage open state, focus restore, and the overlay stack
- **Shells** define presentation (modal, drawer, connected, plain) and are swappable via injection tokens (`MODAL_SHELL_TOKEN`, `DRAWER_SHELL_TOKEN`, …)
- **Triggers** — `DialogTrigger` (`[fiboDialogTrigger]`), `DrawerTrigger` (`[fiboDrawerTrigger]`), `PopoverTrigger` (`[fiboPopoverTrigger]`) are thin directives on top of `createOverlay`
- **Positioning** — `OverlayPosition`, `OverlayArrow`, `OverlayPanel` wrap `@floating-ui/dom` for connected placement

```typescript
export class MyTrigger {
  isOpen = model(false);
  content = input.required<TemplateRef<unknown>>();

  overlay = createOverlay(() => ({
    state: this.isOpen,
    content: this.content(),
  }));
}
```

### DataList + selection models

`DataList` (`[fiboDataList]`) manages a collection of `DataListItem` directives with keyboard navigation and active-item tracking. Selection behavior is composed by attaching a model directive:

- `SelectOne` (`[fiboSelectOne]`) — single selection
- `SelectMulti` (`[fiboSelectMulti]`) — multi selection
- `RouterSelectOne` (`[fiboRouterSelectOne]`) — selection driven by the active route

The same primitives power Select, Combobox, Menu, Listbox, and Table in `@fibo-ui/components`.

### Field stack

Composition primitives for building form fields that integrate with `@angular/forms/signals`:

- `FieldContainer`, `FieldLabel`, `FieldInput`, `FieldInteractive`, `FieldOverlay`, `FieldAuxiliary`
- `FieldUiState` — shared reactive UI state (focus, hover, filled, disabled, invalid)
- `FieldTarget` — focus delegation between the container and its interactive parts
- `FormValueControl<T>` token — bridge to signal forms (`value`, `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`)

### Menu primitives

`Expandable`, `SubmenuTrigger`, `MenuPanel`, plus `ExpandOnRoute` / `ExpandOnSelection` behaviors for tree navigation.

### Date primitives

`DateAdapter` abstraction (backed by `date-fns`), `SelectDate` and `SelectDateRange` selection models for building calendars and date pickers.

### Table primitives

`Column` (`*fiboColumn`), `ColumnHeader`, and `TableRow` structural building blocks.

### Utilities

`IsEmpty`, `RandomId`, and property helpers.

## Documentation

Full guides with live examples are served by the [demo app](https://github.com/dentiman/fibo-ui) (`npm start` → CDK section).

## License

[MIT](https://github.com/dentiman/fibo-ui/blob/main/LICENSE) © Denys Timanovskiy
