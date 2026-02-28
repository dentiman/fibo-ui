# fibo-ui — Concept & Documentation Plan

## Philosophy

fibo-ui is an Angular 21 UI library built around one conviction: **a component library should be a collection of composable behaviors, not a collection of monolithic widgets**.

Most UI libraries give you a `<Select>` that works out of the box but is impossible to customise beyond what its API surface allows. fibo-ui takes the opposite approach: it provides small, single-responsibility primitives (CDK layer) that you compose into rich components, and a set of pre-composed, styled components (Components layer) that demonstrate how those primitives fit together. You can use the pre-built components directly, or you can drop down to the CDK and build your own.

### Core Principles

---

#### 1. Composition over Monoliths

Instead of one big `SelectComponent`, a select is a composition:

```
FormFieldControl  ← visual shell (label, icons, errors)
└─ PopoverTriggerToggle  ← open/close behaviour
   └─ PortalContent  ← lifts content out of DOM stacking context
      └─ Popover + PopoverPosition  ← floating positioning
         └─ DataList  ← keyboard navigation over items
            └─ SelectOne  ← single-value selection model
               └─ DataListItem × N  ← individual selectable items
```

Every layer is replaceable. Need multi-select? Swap `SelectOne` for `SelectMulti`. Need a date picker instead of a list? Keep `PopoverTrigger` + `PortalContent` + `Popover`, swap the inner content for `Calendar` + `SelectDate`. Need navigation instead of selection? Use `RouterSelectOne` and the same `DataListItem` directive now navigates routes.

---

#### 2. Polymorphic Selection via Dependency Injection

The `SELECTION_MODEL` injection token is the heart of the library. It decouples *what is selectable* (DataListItems inside a DataList) from *how selection behaves* (SelectOne, SelectMulti, SelectDate, RouterSelectOne, or your own implementation).

The same `[fiboDataListItem]` directive works inside a dropdown, a calendar, a table row, a sidebar menu, or a set of tabs — because it never cares about the selection semantics, only about calling `selectionModel.select(value)` when triggered.

---

#### 3. Signals-First, Zoneless

The library is built for Angular's present and future. Every piece of state is a `signal()`, `model()`, or `computed()`. There is no `zone.js` dependency. `ChangeDetectionStrategy.OnPush` is on every component. The form integration targets `@angular/forms/signals` (Angular's signal-based forms API) rather than the classic `ControlValueAccessor` pattern.

This means:
- State changes are explicit and traceable.
- Template re-renders happen only when referenced signals change.
- The library works correctly with Angular's upcoming zone-less scheduler.

---

#### 4. Accessibility by Default

Accessibility is not an afterthought added at the component layer — it is embedded in the CDK primitives. `DataList` manages `aria-activedescendant` and keyboard navigation. `DataListItem` sets `aria-selected` and `aria-disabled` via host bindings. `PopoverTrigger` connects `aria-controls` and `aria-expanded`. `Expandable` manages `aria-expanded`. Because every styled component is built on these primitives, it inherits correct ARIA behaviour automatically.

---

#### 5. Behaviour via Host Attributes, Not Classes

State is expressed through `data-*` and `aria-*` attributes on elements, not through toggled CSS classes:

```html
<!-- Instead of class="option option--selected option--active" -->
<a fiboDataListItem aria-selected="true" data-active="" class="datalist-item">…</a>
```

This makes styles readable (`[aria-selected="true"]`, `[data-error]`), removes the CSS specificity battles of BEM, and naturally maps to Tailwind's `aria-selected:` variant.

---

#### 6. Portal System Without Overhead

Floating content (dropdowns, menus, tooltips) is rendered through a lightweight portal system (`PortalContent` + `OverlayRegistry` + `OverlayOutletComponent`) that is fully signal-driven. No dependency on Angular CDK Overlay. The trigger controls a signal; `PortalContent` watches it and registers/unregisters a `TemplateRef`; `OverlayOutletComponent` at the app root renders whatever is registered. Simple, predictable, zero magic.

---

#### 7. Two-Layer Architecture

```
┌──────────────────────────────────────────────┐
│  @fibo-ui/components  (styled, opinionated)   │
│  Select, TextField, Calendar, Table, Menu…    │
├──────────────────────────────────────────────┤
│  @fibo-ui/cdk  (headless, composable)         │
│  DataList, DataListItem, SelectOne, Popover,  │
│  PortalContent, FormFieldDirective…           │
└──────────────────────────────────────────────┘
```

If our styled components don't fit your design system, import from `@fibo-ui/cdk` only and style from scratch. If they do fit, `@fibo-ui/components` gives you production-ready components with zero configuration.

---

## Documentation Plan

The following pages should exist in a modern, complete UI library documentation. Each entry lists the page title, a short description, and its category.

---

### Getting Started

| Page | Description |
|------|-------------|
| **Introduction** | What fibo-ui is, the two-layer architecture, who it is for |
| **Installation** | npm install, peer dependencies, app.config.ts setup, LucideAngularModule, portal outlet placement |
| **Quick Start** | Build a form with Select + TextField + DatePicker in 5 minutes |
| **Theming** | CSS custom properties, semantic color tokens, `ThemeService`, light/dark/system modes, customising the palette |
| **Changelog** | Version history with migration notes |

---

### Architecture

Explains the mental model before diving into components. Adapted from Radix UI and Ark UI's approach of documenting the "why" before the "how".

| Page | Description |
|------|-------------|
| **Overview** | CDK vs Components layer, composition philosophy, when to use each |
| **Data List & Items** | The `DataList` + `DataListItem` primitive: how items register, keyboard navigation, active state |
| **Selection Models** | `SelectOne`, `SelectMulti`, `RouterSelectOne`, `SelectDate`, `SelectDateRange`, `SELECTION_MODEL` token, implementing your own |
| **Popover & Portal** | `PopoverTrigger`, `PortalContent`, `OverlayRegistry`, `OverlayOutletComponent`, `PopoverPosition`, `@floating-ui/dom` |
| **Form Integration** | `FormValueControl<T>`, `FormCheckboxControl`, `FormFieldDirective`, `FormFieldControl`, signal forms binding pattern |

---

### Form Controls

The most important category — the components developers reach for most often. Each page follows the same structure: Description → Basic Usage (live example) → Variants → Sizes → States (disabled, readonly, error, loading) → Validation → API table.

| Page | Description |
|------|-------------|
| **Text Field** | Single-line text input with label, icons, clearable, character count, error display |
| **Textarea** | Multi-line input with auto-resize, character limit |
| **Select** | Single-value dropdown: basic, disabled options, option groups, custom option template |
| **Multi Select** | Multi-value dropdown with chips, search/filter, select all |
| **Checkbox** | Boolean control: single, indeterminate, group/check-all pattern |
| **Switch** | Toggle with sizes (xs–xl), loading state, label placement |
| **Radio Group** | Mutually exclusive options: horizontal, vertical, card-style |
| **Date Picker** | Date selection with calendar popover: basic, range, min/max, custom format, localization |
| **File Upload** | Drag-and-drop zone, file list, size/type validation |
| **Slider** | Numeric range with single thumb and dual thumb (range) variants |
| **Form Field** | `FormFieldControl` wrapper: label, icons, error message display, the `[data-error]` pattern |
| **Form Errors** | `FormErrorService`, `FormErrorPipe`, `FirstFormErrorPipe`, `HasFormErrorPipe`, custom error messages |

---

### Data Display

| Page | Description |
|------|-------------|
| **Table** | Sortable columns, row selection, custom cell templates, pagination integration pattern |
| **Listbox** | Scrollable option list with single/multi select, custom item templates, `valueProp`/`labelProp` |
| **Loading Spin** | SVG spinner with `strokeWidth`, usage in buttons and full-page loaders |

---

### Navigation

| Page | Description |
|------|-------------|
| **Side Menu** | `SideMenuGroup` + `SideMenuItem`: collapsible groups, active route highlighting, nested levels |
| **Tree Menu** | `TreeMenu` + `CollapseSubmenuItem`: multi-level collapsible nav with visual connectors |
| **Tabs** | Horizontal tab bar with router integration via `RouterSelectOne` |

---

### Overlays

| Page | Description |
|------|-------------|
| **Menu (Dropdown)** | `fibo-menu` with `MenuItemType[]` data model: icons, submenus, disabled items, separators |
| **Context Menu** | Right-click triggered `Menu` |
| **Tooltip** | `[fiboTooltip]` with string and TemplateRef content, delay configuration |
| **Dialog** | `fiboPopoverTriggerClick` + `overlayCategory="dialog"` + `fibo-dialog`: centered modal shell with shared portal flow |
| **Drawer** | `fiboPopoverTriggerClick` + `overlayCategory="dialog"` + `fibo-drawer`: dialog-layer drawer shell with shared portal flow |
| **Confirmation** | `ConfirmationService`, `[confirm]` directive, `fibo-confirmation`: config object vs custom template |
| **Notifications** | `Notifier` service: `success()`, `error()`, `warning()`, `info()`, auto-dismiss, custom duration |
| **Popover (CDK)** | Raw CDK popover primitives for building custom floating content |

---

### Recipes

Pattern pages that demonstrate how to combine multiple components to solve real-world problems. Inspired by shadcn/ui's "Examples" and Angular Material's "Getting started" guides.

| Page | Description |
|------|-------------|
| **Signal Form** | Full form with validation using `@angular/forms/signals`, all field types, submit handling |
| **Data Table with Filters** | Table + Select filters + search input + pagination |
| **Sidebar Navigation** | App shell with collapsible Side Menu, active route highlighting, mobile responsive |
| **Multi-Step Dialog** | Dialog with internal step navigation |
| **Searchable Select** | Extending Select with a filter input inside the dropdown |
| **Infinite Scroll Listbox** | Listbox connected to a paginated API with intersection observer |

---

### CDK Reference

Low-level API reference for library authors and advanced users building their own components on top of `@fibo-ui/cdk`.

| Page | Description |
|------|-------------|
| **DataList** | Directive API, keyboard events, `activeDataListItem` signal, `itemTriggered` output |
| **DataListItem** | Directive API, `value` input, `disabled`, self-registration pattern |
| **SelectOne / SelectMulti** | API, `value` model, `compareFn`, `isSelected()` |
| **RouterSelectOne** | API, how `router.isActive()` is used, query params |
| **PopoverTrigger** | `isOpen` signal, `open()`, `close()`, `toggle()`, focus delegation |
| **PortalContent / PortalOutlet** | Template portal pattern, `OverlayRegistry`, multiple portals |
| **PopoverPosition** | `placement` input, `offset`, `matchWidth`, `@floating-ui/dom` integration |
| **Expandable** | `expanded` model, `toggle()`, `aria-expanded` |
| **MenuPanel / SubmenuTrigger** | Submenu coordination, open/close delays |
| **Date Adapter** | Interface contract, implementing a custom adapter (e.g. Luxon, Day.js) |
| **FormFieldDirective** | Reading `FORM_FIELD` token, derived signals |
| **FormErrorService** | Built-in error keys, adding custom messages |

---

## Prior Art & Inspiration

Libraries that share fibo-ui's philosophy or serve a similar audience, grouped by their approach.

### Angular — component libraries

| Library | Approach | Link |
| --- | --- | --- |
| **Angular Material** | Official Google component library for Angular. Form integration via `ControlValueAccessor`, CDK layer separated from styled components. | [material.angular.io](https://material.angular.io) |
| **PrimeNG** | Feature-rich Angular library with the widest component coverage in the ecosystem. | [primeng.org](https://primeng.org) |
| **Ng-Zorro (Ant Design)** | Angular port of Ant Design. Enterprise-focused, comprehensive data display components. | [ng.ant.design](https://ng.ant.design) |
| **Spartan UI** | shadcn/ui-style library for Angular — unstyled Tailwind components, copy-paste approach. Closest Angular equivalent to fibo-ui's two-layer idea. | [spartan.ng](https://spartan.ng) |

### Headless / behaviour-only (cross-framework)

Libraries that separate behaviour from styling — the same philosophy as `@fibo-ui/cdk`.

| Library | Approach | Link |
| --- | --- | --- |
| **Radix UI** | The benchmark for headless primitives in React. Accessibility-first, composable, zero styles. Direct inspiration for fibo-ui's CDK layer. | [radix-ui.com](https://www.radix-ui.com) |
| **Headless UI** | Unstyled, accessible components by the Tailwind CSS team. Designed to pair with Tailwind utility classes. | [headlessui.com](https://headlessui.com) |
| **Ark UI** | Headless component library built on Zag.js state machines. Supports React, Vue, and Solid. | [ark-ui.com](https://ark-ui.com) |
| **Angular CDK** | Angular's official Component Dev Kit. Provides overlays, virtual scrolling, drag-and-drop, and accessibility utilities. | [material.angular.io/cdk](https://material.angular.io/cdk/categories) |

### Styled + Tailwind

Libraries that pair pre-built components with Tailwind CSS — the same space as `@fibo-ui/components`.

| Library | Approach | Link |
| --- | --- | --- |
| **shadcn/ui** | Copy-paste component collection built on Radix UI + Tailwind for React. Defines the modern pattern of "own your components". | [ui.shadcn.com](https://ui.shadcn.com) |
| **daisyUI** | Tailwind CSS component library using semantic class names. Pure CSS, no JS, works with any framework. | [daisyui.com](https://daisyui.com) |
| **Tailwind UI** | Premium component library by the Tailwind CSS team. High-quality templates and patterns. | [tailwindui.com](https://tailwindui.com) |

---

## Priority Order for Implementation

Based on what developers need first:

1. Introduction + Installation + Quick Start
2. Text Field, Select, Checkbox, Switch (most-used controls)
3. Theming
4. Table, Listbox
5. Dialog, Drawer, Notifications, Confirmation
6. Menu (Dropdown), Tooltip
7. Architecture pages (CDK concepts)
8. Multi Select, Date Picker
9. Side Menu, Tree Menu
10. Recipes
11. Remaining CDK reference pages
12. Less common controls (Radio Group, File Upload, Slider, Textarea)
