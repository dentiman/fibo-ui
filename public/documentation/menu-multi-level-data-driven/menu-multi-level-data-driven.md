# Menu Multi Level

Data-driven multi-level menu with icons, badges, and nested navigation.

## Basic Usage

:::example menu-multi-level

```html {example="menu-multi-level"}
<button class="btn btn-primary" fiboPopoverTriggerToggle>
  User Profile
  <ng-template fiboPortalContent let-trigger>
    <fibo-menu
      fiboPopover
      [trigger]="trigger"
      [items]="userProfileMenuItems"
      placement="bottom-start"
    ></fibo-menu>
  </ng-template>
</button>
```

```ts {example="menu-multi-level"}
@Component({
  selector: 'menu-multi-level-example',
  imports: [PopoverTriggerToggle, Popover, PortalContent, Menu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class MenuMultiLevelExample {
  readonly userProfileMenuItems: MenuItemType[] = [
    { label: 'My Profile', icon: 'user', url: '/form-example' },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { label: 'Profile Settings', icon: 'user', url: '/form-example' },
        { label: 'Notifications', icon: 'bell', url: '/notifications' },
        { label: 'Appearance', icon: 'sun', url: '/theme-demo' },
      ],
    },
    { label: 'Log Out', icon: 'log-out', url: '/menu' },
  ];
}
```
