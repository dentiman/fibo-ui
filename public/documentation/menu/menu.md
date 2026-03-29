# Menu

Floating menu component with support for nested items, icons, and badges.

## Basic Usage

:::example menu

```html {example="menu"}
<button
  #triggerBtn
  type="button"
  class="btn btn-primary"
  (click)="toggle()"
>
  Menu
</button>

<ng-template #menuTpl>
  <fibo-menu [items]="menuItems"></fibo-menu>
</ng-template>
```

```ts {example="menu"}
@Component({
  selector: 'menu-component-example',
  imports: [Menu],
  template: '...',
})
export class MenuComponentExample {
  readonly isOpen = signal(false);

  readonly strategy = computed(() => menuOverlay({
    templateRef: this.menuTemplate(),
    referenceElement: this.triggerBtn(),
    interactionRoot: this.triggerBtn(),
    focusReturnTarget: this.triggerBtn(),
  }));

  readonly overlayHandle = createOverlay(this.isOpen, this.strategy);

  readonly menuItems: MenuItemType[] = [
    { label: 'My Profile', icon: 'user', url: '/' },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { label: 'Profile Settings', icon: 'user', url: '/' },
        { label: 'Notifications', icon: 'bell', url: '/notifications' },
      ],
    },
    { label: 'Log Out', icon: 'log-out', url: '/menu' },
  ];

  toggle() {
    this.isOpen.update(open => !open);
  }
}
```

## API

### Inputs

- `items: input<MenuItemType[]>` - menu items configuration
- `menuContent: input<TemplateRef<any>>()` - optional template for custom content

### Types

```ts
export interface MenuItemType {
  label: string;
  icon?: string;
  url?: string;
  children?: MenuItemType[];
  disabled?: boolean;
  badge?: string | number;
}
```
