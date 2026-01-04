import {Component, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DataList, SelectOne} from '@fibo-ui/cdk';
import { SideMenu} from '@fibo-ui/components';

@Component({
  selector: 'app-root-nav',
  standalone: true,
  imports: [CommonModule, DataList, SideMenu, SelectOne],
  templateUrl: './root-nav.html'
})
export class RootNavComponent {

  // @ts-ignore
  items = computed<MenuItemType[]>(() => {
    return [

      {
        label: 'CDK',
        children: [
          {
            label: 'Data List',
            url: '/cdk/data-list',
          },
          {
            label: 'Popover',
            url: '/cdk/popover',
          }
        ]
      },

      {
        label: 'Components',
        url: null,
        children: [
          {
            label: 'Form Fields',
            icon: 'folder',
            children: [
              {
                label: 'Input',
                url: '/input',
              },
              {
                label: 'Single Select',
                url: '/',
              },
              {
                label: 'Multiple Select',
                url: '/select-multiple',
              },
              {
                label: 'Datepicker',
                url: '/datepicker',
              },
              {
                label: 'Checkbox',
                url: '/checkbox',
              },
              {
                label: 'Listbox',
                url: '/listbox',
              },
              {
                label: 'Switch',
                url: '/switch',
              },
              {
                label: 'Button Demo',
                url: '/button-demo',
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
              {
                label: 'Tooltips',
                url: '/tooltips',
              },
            ],
          },
          {
            label: 'Notifications',
            url: '/notifications',
          },
          {
            label: 'Table',
            url: '/table',
          },

          {
            label: 'Form Example',
            url: '/form-example',
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
            label: 'Side Menu',
            url: '/side-menu',
          },
          {
            label: 'Theme Demo',
            url: '/theme-demo',
          },
        ],
      },
    ];
  });
}
