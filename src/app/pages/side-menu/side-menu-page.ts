import {Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SideMenu} from '@fibo-ui/components';
import {MenuItemType} from '@fibo-ui/components';
import {ChangeDetectionStrategy} from '@angular/core';
import {DataList, SingleSelectionModel} from '@fibo-ui/cdk';

@Component({
  selector: 'app-side-menu-page',
  standalone: true,
  imports: [CommonModule, SideMenu, DataList, SingleSelectionModel],
  template: `
    <fibo-side-menu SingleSelectionModelHost fiboDataList [items]="menuItems()"></fibo-side-menu>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuPage {
  menuItems = input<MenuItemType[]>([
    // Title item
    {
      label: 'Components'
    },

    // Link items
    {
      label: 'Select',
      url: '/',
      icon: 'folder'
    },
    {
      label: 'Multiple Select',
      url: '/select-multiple',
      icon: 'folder'
    },
    {
      label: 'Autocomplete',
      url: '/au',
      icon: 'folder'
    },
    {
      label: 'Popovers',
      url: '/popovers',
      icon: 'folder'
    },
    {
      label: 'Menu',
      url: '/menu',
      icon: 'folder'
    },
    {
      label: 'Dialog',
      url: '/dialog',
      icon: 'folder'
    },
    {
      label: 'Confirmation',
      url: '/confirmation',
      icon: 'folder'
    },
    {
      label: 'Notifications',
      url: '/notifications',
      icon: 'folder'
    },
    {
      label: 'Button',
      url: '/button',
      icon: 'folder'
    },
    {
      label: 'Checkbox',
      url: '/checkbox',
      icon: 'folder'
    },
    {
      label: 'Switch',
      url: '/switch',
      icon: 'folder'
    },
    {
      label: 'Chip',
      url: '/chip',
      icon: 'folder'
    },
    {
      label: 'Input',
      url: '/input',
      icon: 'folder'
    },
    {
      label: 'Datepicker',
      url: '/datepicker',
      icon: 'folder'
    },
    {
      label: 'Form Example',
      url: '/form-example',
      icon: 'folder'
    },
    {
      label: 'Radio',
      url: '/radio-box',
      icon: 'folder'
    },
    {
      label: 'Tooltips',
      url: '/tooltips',
      icon: 'folder'
    },
    {
      label: 'Loading Spin',
      url: '/loading-spin',
      icon: 'folder'
    },
    {
      label: 'Playground',
      url: '/playground',
      icon: 'folder'
    },
    {
      label: 'Popup Playground',
      url: '/popup-playground',
      icon: 'folder'
    },
    {
      label: 'Side Menu',
      url: '/side-menu',
      icon: 'folder'
    },
    {
      label: 'Tabs',
      url: '/tabs',
      icon: 'folder'
    },

    // Title item
    {
      label: 'Input Components'
    },

    // Link items
    {
      label: 'Dropdown',
      url: '/dropdown',
      icon: 'folder'
    },
    {
      label: 'List',
      url: '/list',
      icon: 'folder'
    },

    // Title item for callbacks
    {
      label: 'Callback Examples'
    },

    // Callback items
    {
      label: 'Alert Hello',
      callback: () => alert('Hello!')
    },
    {
      label: 'Console Log',
      callback: () => console.log('Callback clicked!')
    },
    {
      label: 'Log Current Path',
      callback: () => console.log('Current URL:', window.location.href)
    }
  ]);
}
