import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Popover, PopoverTriggerToggle, PortalContent } from '@fibo-ui/cdk';
import { Menu, type MenuItemType } from '@fibo-ui/components';
import { UsageDemo } from '../../common/usage-demo';

@Component({
  selector: 'app-menu-multi-level-data-driven-page',
  standalone: true,
  imports: [PopoverTriggerToggle, Popover, PortalContent, Menu, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 flex flex-col space-y-12">
      <h2 class="text-foreground">Menu Multi Level (Data Driven)</h2>

      <app-usage-demo [codeBlocks]="codeBlocks">
        <div class="mx-auto w-80 p-8">
          <button #trigger="PopoverTrigger" class="btn btn-primary" fiboPopoverTriggerToggle>
            User Profile
          </button>

          <ng-template fiboPortalContent [(isOpen)]="trigger.isOpen">
            <fibo-menu fiboPopover
                       [trigger]="trigger"
                       [items]="userProfileMenuItems"
                       placement="bottom-start">
            </fibo-menu>
          </ng-template>
        </div>
      </app-usage-demo>
    </div>
  `
})
export class MenuMultiLevelDataDrivenPageComponent {
  readonly userProfileMenuItems: MenuItemType[] = [
    { label: 'My Profile', icon: 'user', url: '/form-example' },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { label: 'Profile Settings', icon: 'user', url: '/form-example' },
        { label: 'Notifications', icon: 'bell', url: '/notifications' },
        { label: 'Appearance', icon: 'sun', url: '/theme-demo' }
      ]
    },
    {
      label: 'Language',
      icon: 'globe',
      children: [
        { label: 'English', icon: 'check', url: '/select-multiple' },
        { label: 'Spanish', icon: 'check', url: '/select-multiple' },
        { label: 'German', icon: 'check', url: '/select-multiple' }
      ]
    },
    { label: 'Upgrade Plan', icon: 'circle-plus', url: '/dialog' },
    { label: 'Usage', icon: 'list', url: '/table' },
    {
      label: 'Account & Security',
      icon: 'shield-check',
      children: [
        { label: 'Edit Profile', icon: 'user', url: '/form-example' },
        { label: 'Change Password', icon: 'lock', url: '/input' },
        { label: 'Two-Factor Authentication', icon: 'shield-check', url: '/switch' },
        { label: 'Active Sessions', icon: 'monitor', url: '/notifications' },
        { label: 'API Keys', icon: 'wrench', url: '/input' }
      ]
    },
    { label: 'Log Out', icon: 'log-out', url: '/menu' }
  ];

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/menu-multi-level-data-driven/menu-multi-level-data-driven.html.md' },
    { name: 'ts', path: '/documentation/menu-multi-level-data-driven/menu-multi-level-data-driven.ts.md' }
  ];
}
