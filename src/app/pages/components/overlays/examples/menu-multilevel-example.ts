import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PopoverTrigger } from '@fibo-ui/cdk';
import { Menu, type MenuItemType } from '@fibo-ui/components';

@Component({
  selector: 'menu-multilevel-example',
  imports: [Menu, PopoverTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <button
        type="button"
        class="btn btn-primary"
        fiboPopoverTrigger
        [content]="menuTpl"
      >
        User Profile
      </button>
    </div>

    <ng-template #menuTpl>
      <fibo-menu [items]="menuItems"></fibo-menu>
    </ng-template>
  `,
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
