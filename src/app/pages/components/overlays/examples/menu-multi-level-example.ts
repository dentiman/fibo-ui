import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Popover, PopoverTriggerToggle } from '@fibo-ui/cdk';
import { Menu, type MenuItemType } from '@fibo-ui/components';

@Component({
  selector: 'menu-multi-level-example',
  imports: [PopoverTriggerToggle, Popover, Menu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-80 p-8">
      <button class="btn btn-primary" fiboPopoverTriggerToggle [contentTemplate]="menuTpl">
        User Profile
      </button>
      <ng-template #menuTpl let-trigger>
        <fibo-menu fiboPopover [trigger]="trigger" [items]="userProfileMenuItems" placement="bottom-start"></fibo-menu>
      </ng-template>
    </div>
  `,
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
    {
      label: 'Language',
      icon: 'globe',
      children: [
        { label: 'English', icon: 'check', url: '/select-multiple' },
        { label: 'Spanish', icon: 'check', url: '/select-multiple' },
        { label: 'German', icon: 'check', url: '/select-multiple' },
      ],
    },
    { label: 'Upgrade Plan', icon: 'circle-plus', url: '/dialog' },
    { label: 'Usage', icon: 'list', url: '/table' },
    {
      label: 'Account & Security',
      icon: 'shield-check',
      children: [
        { label: 'Edit Profile', icon: 'user', url: '/form-example' },
        { label: 'Change Password', icon: 'lock', url: '/input' },
        { label: 'Two-Factor Auth', icon: 'shield-check', url: '/switch' },
        { label: 'Active Sessions', icon: 'monitor', url: '/notifications' },
        { label: 'API Keys', icon: 'wrench', url: '/input' },
      ],
    },
    { label: 'Log Out', icon: 'log-out', url: '/menu' },
  ];
}
