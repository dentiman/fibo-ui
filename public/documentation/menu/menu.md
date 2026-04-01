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
  private readonly triggerBtn = viewChild.required<ElementRef<HTMLButtonElement>>('triggerBtn');
  private readonly menuTemplate = viewChild.required<TemplateRef<unknown>>('menuTpl');

  readonly isOpen = signal(false);

  readonly overlayHandle = createOverlay(
    this.isOpen,
    menuBehavior(),
    connectedPosition(() => ({ referenceElement: this.triggerBtn().nativeElement })),
    this.menuTemplate,
    session => { restoreTriggerFocusOnClose(session, () => this.triggerBtn().nativeElement); },
  );

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
- `menuContent: input<TemplateRef<unknown>>()` - optional template for custom content

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
