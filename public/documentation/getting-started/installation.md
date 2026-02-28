# Installation

fibo-ui requires **Angular 21** and is designed for projects using **zoneless change detection** and **Tailwind CSS 4**.

## Prerequisites

| Requirement | Version |
| --- | --- |
| Angular | `^21.0.0` |
| Tailwind CSS | `^4.1.0` |
| Node.js | `^18.19.0` or `^20.9.0` |

## Install Packages

### Full install — components + CDK

Install both packages and their peer dependencies:

```bash
npm install @fibo-ui/components @fibo-ui/cdk
npm install @floating-ui/dom date-fns lucide-angular ngxtension
```

### CDK only

If you only need the headless primitives without pre-built styled components:

```bash
npm install @fibo-ui/cdk date-fns
```

## Configure `app.config.ts`

Add `provideZonelessChangeDetection()` and `provideHttpClient()`. Register the Lucide icons you plan to use — the library is tree-shakeable, so only include what you need.

```ts
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LUCIDE_ICONS, LucideIconProvider, ChevronDown, X } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ ChevronDown, X }),
    },
  ],
};
```

> `provideHttpClient()` is required because `DocViewer` fetches markdown files at runtime. If you are not using the documentation viewer, it is still needed by some internal resource utilities.

## Import Styles

Add the following imports to your global `styles.css`. The order of layers matters.

```css
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@import "@fibo-ui/components/theme" layer(theme);
@import "@fibo-ui/components/buttons";
@import "@fibo-ui/components/components" layer(components);

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

The `@custom-variant dark` line configures Tailwind's `dark:` variant to read the `data-theme="dark"` attribute set by `ThemeService`, instead of relying on `prefers-color-scheme` alone.

## Set Up the Root Component

Add the overlay containers and the portal outlet to your root component. These elements are singletons — they must appear exactly once in the application, at the top level.

`app.ts`:

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Notification,
  FiboConfirmation,
  FiboDialog,
  FiboDrawer,
  TooltipContainer,
} from '@fibo-ui/components';
import { OverlayOutletComponent } from '@fibo-ui/cdk';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TooltipContainer,
    FiboDialog,
    FiboDrawer,
    FiboConfirmation,
    Notification,
    OverlayOutletComponent,
  ],
  templateUrl: './app.html',
})
export class App {}
```

`app.html`:

```html
<router-outlet />
<fibo-tooltip-container />
<fibo-dialog />
<fibo-drawer />
<fibo-confirmation />
<fibo-notification />
<fibo-overlay-outlet />
```

Each element serves a distinct role:

| Element | Purpose |
| --- | --- |
| `<fibo-overlay-outlet>` | Renders all open dropdown and popover portals outside their DOM origin |
| `<fibo-tooltip-container>` | Renders the active tooltip using floating positioning |
| `<fibo-dialog>` | Renders the modal dialog driven by `DialogService` |
| `<fibo-drawer>` | Renders the side drawer driven by `DrawerService` |
| `<fibo-confirmation>` | Renders the confirmation dialog driven by `ConfirmationService` |
| `<fibo-notification>` | Renders the toast stack driven by `Notifier` service |

> If you are using **CDK only**, add `<fibo-overlay-outlet>` and import `OverlayOutletComponent`. All other overlay containers are part of `@fibo-ui/components` and can be omitted.

## Verify the Setup

Add a Select component to any page and confirm it renders and opens correctly:

```ts
import { Component, signal } from '@angular/core';
import { Select } from '@fibo-ui/components';

@Component({
  selector: 'app-verify',
  imports: [Select],
  template: `
    <fibo-select label="Role" [items]="roles" [(value)]="role" />
    <p>Selected: {{ role() }}</p>
  `,
})
export class VerifyComponent {
  role = signal('');
  roles = ['Admin', 'Editor', 'Viewer'];
}
```

If the dropdown opens, items are keyboard-navigable, and the selected value updates — the setup is complete.
