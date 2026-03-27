import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DataListKeyboardBridge,
  KeyboardTarget,
  PopoverTriggerToggle,
} from '@fibo-ui/cdk';
import { Menu, type MenuItemType } from '@fibo-ui/components';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [CommonModule, Menu, PopoverTriggerToggle, KeyboardTarget, DataListKeyboardBridge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-3xl space-y-8 p-8">
      <section class="space-y-3">
        <h1 class="text-2xl font-semibold">Playground</h1>
        <p class="text-sm text-foreground-secondary">
          Menu-only debug page for overlay behavior. Open the menus below and verify
          keyboard navigation, submenu open/close, and outside click behavior.
        </p>
      </section>

      <section class="space-y-4 rounded-xl border border-border-primary bg-background-secondary p-5 shadow-sm">
        <h2 class="text-lg font-medium text-foreground">Fibo Menu</h2>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="btn btn-primary"
            fiboKeyboardTarget
            #keyboardTarget="KeyboardTarget"
            fiboPopoverTriggerToggle
            [content]="menuTpl"
            placement="bottom-start"
          >
            Open Menu
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            fiboKeyboardTarget
            #keyboardTargetAlt="KeyboardTarget"
            fiboPopoverTriggerToggle
            [content]="altMenuTpl"
            placement="bottom-start"
          >
            Open Quick Menu
          </button>
        </div>

        <ng-template #menuTpl>
          <fibo-menu
            [fiboDataListKeyboardBridge]="keyboardTarget"
            [items]="menuItems"
          />
        </ng-template>

        <ng-template #altMenuTpl>
          <fibo-menu
            [fiboDataListKeyboardBridge]="keyboardTargetAlt"
            [items]="quickMenuItems"
          />
        </ng-template>
      </section>
    </div>
  `,
})
export class PlaygroundPageComponent {
  readonly menuItems: MenuItemType[] = [
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
      label: 'Account & Security',
      icon: 'shield-check',
      children: [
        { label: 'Edit Profile', icon: 'user', url: '/form-example' },
        { label: 'Change Password', icon: 'lock', url: '/input' },
        { label: 'Two-Factor Auth', icon: 'shield-check', url: '/switch' },
        { label: 'Active Sessions', icon: 'monitor', url: '/notifications' },
      ],
    },
    { label: 'Log Out', icon: 'log-out', callback: () => console.log('logout') },
  ];

  readonly quickMenuItems: MenuItemType[] = [
    { label: 'Single Select', icon: 'list', url: '/select-single' },
    { label: 'Multiple Select', icon: 'list-checks', url: '/select-multiple' },
    { label: 'Datepicker', icon: 'calendar', url: '/datepicker' },
  ];
}
