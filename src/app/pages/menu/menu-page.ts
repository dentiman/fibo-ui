import {Component, computed, viewChild} from '@angular/core';
import {
  DataList,
  OverlayTriggerToggle,
  SingleSelectionModel
} from '@fibo-ui/cdk';
import {
  CollapseMenu, MenuItem,
  PopoverMenu,
} from '@fibo-ui/components';
import {RouterLink} from '@angular/router';

@Component({
  imports: [
    RouterLink,
    OverlayTriggerToggle,
    PopoverMenu,
    MenuItem,
    CollapseMenu,
    DataList,
    SingleSelectionModel
  ],
  templateUrl: './menu-page.html',

})
export class MenuPageComponent {
  folderIcon = viewChild('folderSvgIcon');

  onTriggerClick() {
    alert('Menu trigger clicked!');
  }

  // @ts-ignore
  items = computed<MenuItemType[]>(() => {
    return [

      {
        label: 'Components',
        url: null,
         icon: 'folder',
        children: [
          {
            label: 'Select',
             icon: 'folder',
            children: [
              {
                label: 'Single',
                url: '/',
              },
              {
                label: 'Multiple',
                url: '/select-multiple',
              },
              {
                label: 'Autocomplete',
                url: '/au',
              },
            ],
          },
          {
            label: 'Overlays',
             icon: 'folder',
            children: [
              {
                label: 'Menu',
                url: '/menu',
              },
              {
                label: 'Dialog',
                url: '/dialog',
              },
              {
                label: 'Confirmation',
                url: '/confirmation',
              },
            ],
          },
          {
            label: 'Notifications',
            url: '/notifications',
            disabled: true
          },
          {
            label: 'Button',
            url: '/button',
            disabled: true
          },
          {
            label: 'Checkbox',
            url: '/checkbox',
            disabled: true
          },
          {
            label: 'Switch',
          },
          {
            label: 'Chip',
            url: '/chip',
            disabled: true
          },
          {
            label: 'Input',
            url: '/input',
          },
          {
            label: 'Datepicker',
            url: '/datepicker',
          },
          {
            label: 'Form Example',
            url: '/form-example',
          },
          {
            label: 'Radio',
            url: '/radio-box',
          },
          {
            label: 'Tooltips',
            url: '/tooltips',
          },
          {
            label: 'Popup Playground',
            url: '/popup-playground',
          },
          {
            label: 'Tabs',
            url: '/tabs',
          },
        ],
      },
      {
        label: 'Alert on Click',
        callback: this.onTriggerClick
      },
      {
        label: 'Input',
        url: '/input',
        children: [
          {
            label: 'Dropdown',
            url: '/dropdown',
             icon: 'folder',
          },
          {
            label: 'List',
            url: '/list',
             icon: 'folder',
          },
        ],
      },
    ];
  });
}

