# Introduction

**fibo-ui is a signal-native Angular 21 component library — accessible, themeable, and pleasantly small.** Ready-made components when you want to move fast; headless CDK primitives when you want to build your own. The same behaviour underneath.

> **Status: beta** · [npm](https://www.npmjs.com/package/@fibo-ui/components) · [GitHub](https://github.com/dentiman/fibo-ui) · [Live demo](https://dentiman.github.io/fibo-ui/)

The core idea: a component library should be a collection of **composable behaviours**, not a bag of monolithic widgets.


Keyboard navigation, ARIA, focus management, and overlay positioning are already handled — you wrote none of it.

## Two packages, one system

Two independent npm packages with a clear build dependency.

| Package | Purpose |
| --- | --- |
| `@fibo-ui/cdk` | Headless, behaviour-only directives — keyboard navigation, selection models, floating positioning, portal system. No templates. No styles. |
| `@fibo-ui/components` | Styled, production-ready components built on the CDK — Select, TextField, Table, Menu, Dialog, and more. |

Use `@fibo-ui/components` when the default design fits. Drop down to `@fibo-ui/cdk` when you need full control over markup and styling — the behaviour comes for free either way.

## Core principles

### Composition over monoliths

A `Select` is not one component. It is a stack of small, single-responsibility layers:

![The fibo-ui Select composition — six nested, independently replaceable layers, from FormUiState down to the SelectOne selection model](/documentation/getting-started/select-composition.png)

Every layer is replaceable on its own. Swap `SelectOne` for `SelectMulti` to get a multi-select. Swap the inner list for a `Calendar` and you have a date picker. Flip `FieldTarget` from `focus` to `click` and the same shell becomes a trigger instead of a text field.

### One primitive, no duplicated logic

Behaviour lives in the primitives, so it is written once and reused everywhere. `Select` and `Menu` are both keyboard-driven lists — arrow keys, `Home`/`End`, `Enter`, active-item tracking — and that navigation is defined a *single* time, in `DataList`:

```
Select = DataList + SelectOne + FieldShell   → produces a form value
Menu   = DataList + MenuPanel + actions      → runs a command
```

Improve the navigation in `DataList` once and `Select`, `Menu`, `Table`, and the date picker all inherit it. That is why the components stay small — they add only what is unique to them.

### Signals-first, zoneless

Every piece of state is a `signal()`, `model()`, or `computed()`, and every component is `OnPush`. No `zone.js`. Forms target `@angular/forms/signals` — the new signal-based API — not the classic `ControlValueAccessor`.

### Accessibility by default

ARIA is built into the CDK, not bolted on later. `DataList` manages `aria-activedescendant`; `DataListItem` sets `aria-selected` and `aria-disabled`; field semantics stay on the real `input`/`button` while `FieldShell` stays visual-only. Every styled component inherits this for free.

### Polymorphic selection

The `SELECTION_MODEL` token decouples *what* is selectable from *how* selection works. The same `[fiboDataListItem]` runs inside a dropdown, a calendar, a table, or a sidebar — it only ever calls `selectionModel.select(value)`.

> Provide a class implementing `SelectionModel<T>` and any `DataList` tree instantly gains your selection behaviour.

## Three ways to use it

fibo-ui is not an either/or between "use our widgets" and "build everything yourself." The same blocks support a spectrum:

1. **Use** — drop in `<fibo-select>` and it works. Most scenarios are covered out of the box.
2. **Compose** — combine components with CDK directives: add `DataList` to your own layout, or plug a `SelectionModel` into an existing list.
3. **Build** — take a component as a blueprint (most are under 100 lines), keep the CDK primitives, swap in your own types and template. A `UserSelect`, `BookingDatePicker`, or `CommandPalette` becomes a small file of *your* code — navigation, ARIA, and overlays keep working.

You never choose between convenience and control. Start ready-made; drop a level only where your product needs it.

## Who is it for

- **Application teams** who want production-ready Angular components that work with signal forms out of the box.
- **Design-system teams** who need headless primitives to build custom-styled components without reinventing keyboard navigation or ARIA.
- **Angular 21+ projects** on signals, zoneless change detection, or `@angular/forms/signals`.

---

**Next:** [Installation →](/getting-started/installation) — add fibo-ui to your project and import the theme.
