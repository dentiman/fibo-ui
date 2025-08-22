import {Component, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DataList, SingleSelectionModel} from '@fibo-ui/cdk';
import {CollapseMenu} from '@fibo-ui/components';

@Component({
  selector: 'app-root-nav',
  standalone: true,
  imports: [CommonModule, CollapseMenu, DataList, SingleSelectionModel],
  templateUrl: './root-nav.html'
})
export class RootNavComponent {

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
                url: 'menu',
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
          },
          {
            label: 'Button',
            url: '/button',
          },
          {
            label: 'Checkbox',
            url: '/checkbox',
          },
          {
            label: 'Switch',
            url: '/switch',
          },
          {
            label: 'Chip',
            url: '/chip',
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
            label: 'Loading Spin',
            url: '/loading-spin',
          },
          {
            label: 'Playground',
            url: '/playground',
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
