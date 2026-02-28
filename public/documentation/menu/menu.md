# Menu

Floating menu component with support for nested items, icons, and badges.

## One Level

:::example menu-one-level

```html {example="menu-one-level"}
<button type="button" class="btn btn-primary" fiboPopoverTriggerToggle>
  Menu (1 level)
  <ng-template fiboPortalContent let-trigger>
    <div
      fiboPopover [trigger]="trigger"
      fiboDataList (itemTriggered)="trigger.close()"
      class="popover-container min-w-40"
    >
      <a fiboDataListItem [routerLink]="'/'" class="datalist-item">Single Select</a>
      <a fiboDataListItem [routerLink]="'/select-multiple'" class="datalist-item">Multiple Select</a>
      <a fiboDataListItem [routerLink]="'/datepicker'" class="datalist-item">Datepicker</a>
    </div>
  </ng-template>
</button>
```

```ts {example="menu-one-level"}
@Component({
  selector: 'menu-one-level-example',
  imports: [PopoverTriggerToggle, Popover, PortalContent, DataList, DataListItem, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class MenuOneLevelExample {}
```

## Multi Level (Data Driven)

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
