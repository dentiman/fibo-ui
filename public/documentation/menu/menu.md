# Menu

Floating dropdown menu with support for nested submenus, icons, URL navigation, and action callbacks. Rendered through the overlay stack via `fiboPopoverTrigger`.

## Basic Usage

Attach `fiboPopoverTrigger` to any button and pass the menu template via `[content]`. Inside the template use `<fibo-menu>` with `fiboMenuItem` items projected directly in markup:

:::example menu

```html {example="menu" title="Template"}
<button
  type="button"
  class="btn btn-primary"
  fiboPopoverTrigger
  [content]="menuTpl"
>
  Menu
</button>

<ng-template #menuTpl let-overlay>
  <fibo-menu [overlay]="overlay">
    <button type="button" fiboMenuItem>My Profile</button>
    <button type="button" fiboMenuItem>Settings</button>
    <button type="button" fiboMenuItem>Log Out</button>
  </fibo-menu>
</ng-template>
```

```ts {example="menu" title="Component"}
@Component({
  selector: 'menu-component-example',
  imports: [Menu, MenuItem, PopoverTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class MenuComponentExample {}
```

## Multi-level Menu

Nest items arbitrarily deep using `children`. Each level opens as a connected submenu on hover or arrow key navigation:

:::example menu-multilevel

```html {example="menu-multilevel" title="Template"}
<button
  type="button"
  class="btn btn-primary"
  fiboPopoverTrigger
  [content]="menuTpl"
>
  User Profile
</button>

<ng-template #menuTpl let-overlay>
  <fibo-menu [overlay]="overlay" [items]="menuItems"></fibo-menu>
</ng-template>
```

```ts {example="menu-multilevel" title="Component"}
@Component({
  selector: 'menu-multilevel-example',
  imports: [Menu, PopoverTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class MenuMultilevelExample {
  readonly menuItems: MenuItemType[] = [
    { label: 'My Profile', icon: 'user', url: '/' },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { label: 'Profile Settings', icon: 'user', url: '/' },
        {
          label: 'Notifications',
          icon: 'bell',
          children: [
            { label: 'Email', url: '/notifications' },
            { label: 'Push', url: '/notifications' },
            { label: 'SMS', url: '/notifications' },
          ],
        },
        { label: 'Appearance', icon: 'sun', url: '/theme-demo' },
      ],
    },
    {
      label: 'Account & Security',
      icon: 'shield-check',
      children: [
        { label: 'Change Password', icon: 'lock', url: '/' },
        { label: 'Two-Factor Auth', icon: 'shield-check', url: '/' },
        { label: 'Active Sessions', icon: 'monitor', url: '/' },
      ],
    },
    { label: 'Log Out', icon: 'log-out', callback: () => {} },
  ];
}
```

## Item Types

Each `MenuItemType` object describes one row. The rendered action depends on which fields are set:

| Field | Behavior |
|---|---|
| `url` | Navigates via Angular Router on click |
| `callback` | Calls the function and closes all menus |
| `children` | Opens a submenu panel on hover / ArrowRight |
| `content` | Renders a custom `TemplateRef` inside the submenu |
| `value` | Exposes a value for selection (used with data-list patterns) |

Items with `children` or `content` show a chevron-right indicator. Items without any action field are rendered but do nothing.

## Keyboard Navigation

| Key | Action |
|---|---|
| `ArrowDown` / `ArrowUp` | Move between items |
| `ArrowRight` / `Enter` | Open submenu |
| `ArrowLeft` / `Escape` | Close current level, return focus to parent |
| `Tab` / `Shift+Tab` | Close menu, restore focus to trigger |

Focus is restored to the trigger element when the menu closes.

## Programmatic Control

Use `createOverlay` directly with `menuBehavior()` when you need tighter control over open state — e.g. closing from inside a template:

```ts
import { createOverlay, connectedPosition, restoreTriggerFocusOnClose } from '@fibo-ui/cdk';
import { menuBehavior } from '@fibo-ui/components';

private readonly triggerEl = viewChild.required<ElementRef<HTMLElement>>('triggerEl');
private readonly menuTpl = viewChild.required<TemplateRef<unknown>>('menuTpl');

readonly isOpen = signal(false);

readonly overlay = createOverlay(
  this.isOpen,
  menuBehavior(),
  connectedPosition(() => ({ referenceElement: this.triggerEl().nativeElement })),
  this.menuTpl,
  session => { restoreTriggerFocusOnClose(session, () => this.triggerEl().nativeElement); },
);

toggle() {
  this.isOpen.update(v => !v);
}
```

`menuBehavior()` sets `tag: 'menu'` on the overlay, which lets nested menus close the entire chain at once via `MenuPanel.closeAll()`.

## API

### `<fibo-menu>`

| | |
|---|---|
| Selector | `fibo-menu` |
| Package | `@fibo-ui/components` |

**Inputs**

| Input | Type | Description |
|---|---|---|
| `overlay` | `OverlayHandle \| null` | The overlay handle passed via `let-overlay` from the template context. Required for ArrowLeft focus-return and submenu branch tracking |
| `items` | `MenuItemType[]` | List of menu items to render |
| `menuContent` | `TemplateRef<unknown>` | Optional custom content appended after items |
| `keyboardSource` | `KeyboardSource` | Connects an external keyboard source for arrow-key navigation |

---

### `[fiboPopoverTrigger]`

| | |
|---|---|
| Selector | `[fiboPopoverTrigger]` |
| Package | `@fibo-ui/cdk` |
| exportAs | `PopoverTrigger` |

**Inputs**

| Input | Type | Default | Description |
|---|---|---|---|
| `content` | `TemplateRef<unknown>` | required | Template to render inside the popover |
| `open` | `boolean` | `false` | Two-way model for open state |
| `placement` | `Placement` | auto | Floating-UI placement string, e.g. `'bottom-start'` |
| `offset` | `number` | — | Distance in px between trigger and popover |

**Methods**

| Method | Description |
|---|---|
| `open()` | Opens the popover |
| `close()` | Closes the popover |
| `toggle()` | Toggles open/closed |

---

### `MenuItemType`

```ts
type MenuItemType = {
  label: string;
  url?: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  children?: MenuItemType[];
  content?: TemplateRef<any>;
  callback?: () => void;
  value?: any;
};
```
