# Introduction

**fibo-ui** is an Angular 21 UI library built around one idea: a component library should be a collection of composable behaviours, not a bag of monolithic widgets.

## Two Packages, One System

The library ships as two independent npm packages with a clear build dependency.

| Package | Purpose |
| --- | --- |
| `@fibo-ui/cdk` | Headless, behaviour-only directives — keyboard navigation, selection models, floating positioning, portal system. No templates. No styles. |
| `@fibo-ui/components` | Styled, production-ready components built on top of the CDK — Select, TextField, Table, Menu, Dialog, and more. |

Use `@fibo-ui/components` when the default design fits your product. Drop down to `@fibo-ui/cdk` when you need full control over markup and styling — keyboard navigation, ARIA, and selection logic come for free.

## Core Principles

### Composition over monoliths

A `Select` in fibo-ui is not one component. It is a stack of small, single-responsibility layers:

```
FormUiState           — signal-form UI state
└─ FieldShell         — visual shell: label, icons, clear action, focus-within state
   └─ FieldTarget     — real focusable trigger inside the shell
      └─ createOverlay() + Popover  — floating positioning via @floating-ui/dom
         └─ DataList  — keyboard navigation, active-item tracking
            └─ SelectOne + DataListItem × N  — selection model
```

Every layer is replaceable independently. Swap `SelectOne` for `SelectMulti` to get a multi-select. Swap the inner list for a `Calendar` and you have a date picker. Change the `FieldTarget` mode from `focus` to `click` and the same shell now behaves like a trigger instead of a plain text field.

### One primitive, no duplicated logic

Because behaviour lives in the primitives, it is written once and reused everywhere — never copy-pasted from one component into the next. `Select` and `Menu` make this concrete. Both are keyboard-driven lists — arrow keys, `Home`/`End`, `Enter`, active-item tracking — and that navigation is defined a *single* time, in `DataList`:

```
Select = DataList + SelectOne + FieldShell   → produces a form value
Menu   = DataList + MenuPanel + actions      → runs a command
```

They share `DataList` and `DataListItem` verbatim; only the composition wrapped around them differs. `Select` adds a selection model and the field shell; `Menu` wraps the same `DataList` in a `MenuPanel` for submenu timing, and its items run actions instead of storing a value. Fix or improve the navigation in `DataList` once and both — along with `Table` and the date picker — inherit it immediately. This is why the components stay small: they add only what is unique to them.

### Signals-first, zoneless

Every piece of state is a `signal()`, `model()`, or `computed()`. All components use `ChangeDetectionStrategy.OnPush`. There is no `zone.js` dependency. Form integration targets `@angular/forms/signals` — the new signal-based forms API — rather than the classic `ControlValueAccessor`.

### Accessibility by default

ARIA is built into the CDK primitives, not bolted on at the component layer. `DataList` manages `aria-activedescendant` and keyboard navigation. `DataListItem` sets `aria-selected` and `aria-disabled`. Field semantics stay on the real inner `input` or `button`, while `FieldShell` remains visual-only. Every styled component inherits correct behaviour automatically because it is built on these primitives.

### Polymorphic selection via dependency injection

The `SELECTION_MODEL` injection token decouples *what is selectable* from *how selection works*. The same `[fiboDataListItem]` directive operates inside a dropdown, a calendar, a table, a sidebar menu — because it only ever calls `selectionModel.select(value)` and never cares about the semantics behind it.

> Provide a custom class that implements `SelectionModel<T>` and any `DataList` + `DataListItem` tree immediately gains your selection behaviour.

## Three Ways to Use It

fibo-ui is deliberately not an either/or between "use our widgets" and "build everything from scratch." The same building blocks support a spectrum:

1. **Use** — drop in `<fibo-select>` and it works. Most common scenarios are covered out of the box.
2. **Compose** — combine components with CDK directives to assemble richer patterns: add `DataList` to your own layout, or plug a `SelectionModel` into an existing list.
3. **Build** — take a component as a blueprint (most are under 100 lines), keep the CDK primitives, and swap in your own types, template, and business logic. A `UserSelect`, `BookingDatePicker`, or `CommandPalette` becomes a small file of *your* code — keyboard navigation, ARIA, and overlay behaviour keep working automatically.

You are never forced to choose between convenience and control. Start with a ready-made component, and drop down a level only where your product actually needs it.

## Who Is It For

- **Application teams** who want production-ready Angular components that work with signal forms out of the box.
- **Design system teams** who need headless CDK primitives to build fully custom-styled components without reinventing keyboard navigation or ARIA patterns.
- **Angular 21+ projects** that use signals, zoneless change detection, or the new `@angular/forms/signals` API.
