# Documentation Format

This folder contains markdown docs rendered by `doc-viewer`.

## File Layout

```
public/documentation/<component>/
  <component>.md          ← main doc page
src/app/pages/<group>/<component>/
  <component>-page.ts     ← thin Angular page component
  examples/
    <name>-example.ts     ← live example component(s)
src/app/layout/
  root-nav.html           ← sidebar navigation
src/app/app.routes.ts     ← route registration
```

## How to Add a New Documentation Page

Follow these four steps in order.

---

### Step 1 — Create the markdown file

Create `public/documentation/<component>/<component>.md`:

````md
# ComponentName

Short description of the component.

## Basic Usage

:::example component-basic

```html {example="component-basic"}
<!-- html snippet shown in the code tab -->
```

```ts {example="component-basic"}
// ts snippet shown in the code tab
```

## API

…
````

Rules:
- Use `:::example <name>` to insert a live example block (rendered by `DocViewer`).
- Attach code tabs with fenced blocks and `{example="<name>"}` attribute.
- `<name>` must match the key you register in `EXAMPLE_REGISTRY` (Step 3).
- Multiple code blocks for one example are fine (html, ts, css, etc.) — they become tabs.
- Raw HTML in markdown is not supported; use markdown syntax.

---

### Step 2 — Create the example component(s)

Create `src/app/pages/<group>/<component>/examples/<name>-example.ts`:

```ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
// import whatever CDK/components directives the example needs

@Component({
  selector: '<name>-example',
  imports: [/* ... */],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- full working template here -->
  `,
})
export class NameExample { /* ... */ }
```

- Follow all project code conventions: signals, `inject()`, `input()`, OnPush, etc.
- The `selector` is not rendered anywhere — only the class is used by `DocViewer`.

---

### Step 3 — Create the page component

Create `src/app/pages/<group>/<component>/<component>-page.ts`:

```ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { NameExample } from './examples/name-example';

const EXAMPLES = new Map<string, any>([
  ['component-basic', NameExample],
  // add more examples here as needed
]);

@Component({
  selector: 'app-component-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/<component>/<component>.md" />`,
})
export class ComponentPageComponent {}
```

- The `EXAMPLES` map keys must exactly match the names used in `:::example <name>` in the markdown.
- The `docUrl` path is relative to the `public/` folder (served as static assets).

---

### Step 4 — Register the route and add a nav item

**`src/app/app.routes.ts`** — import the page component and add a route:

```ts
import { ComponentPageComponent } from './pages/<group>/<component>/<component>-page';

// inside the children array:
{ path: '<component>', component: ComponentPageComponent },
```

**`src/app/layout/root-nav.html`** — add a menu item inside the appropriate `<side-menu-group>`:

```html
<side-menu-item url="/<component>">Component Name</side-menu-item>
<!-- with an icon: -->
<side-menu-item icon="icon-name" url="/<component>">Component Name</side-menu-item>
```

Icons come from Lucide Angular. Use kebab-case icon names (e.g. `chevron-down`, `bell`, `loader`).

---

## How DocViewer Works

`DocViewer` (`src/app/common/doc-viewer/doc-viewer.ts`):

1. Fetches the markdown file from `docUrl`.
2. Parses `:::example <name>` blocks and fenced `{example="<name>"}` code blocks via a remark plugin.
3. Highlights code with Shiki.
4. Renders the HTML via `[innerHTML]`.
5. After render, finds `:::example <name>` markers in the DOM and replaces each with:
   - A live Angular component (looked up by name in `EXAMPLE_REGISTRY`).
   - A tabbed code panel (one tab per fenced block for that example).

`EXAMPLE_REGISTRY` is an `InjectionToken<Map<string, any>>` provided by the page component. If a page has no examples, you can omit the `providers` array.
