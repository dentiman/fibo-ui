import {Component, computed, signal, viewChild} from '@angular/core';
import {
  DataList,
  PopoverTriggerToggle, PortalContent,
  SelectOne
} from '@fibo-ui/cdk';
import { MenuItem,
  PopoverMenu,
} from '@fibo-ui/components';
import {RouterLink} from '@angular/router';
import {UsageDemo} from '../../common/usage-demo';

@Component({
  imports: [
    RouterLink,
    PopoverTriggerToggle,
    PopoverMenu,
    MenuItem,
    DataList,
    UsageDemo,
    PortalContent,
    SelectOne
  ],
  templateUrl: './menu-page.html',

})
export class MenuPageComponent {

  readonly codeBlocksBasicMenu = [
    { name: 'html', path: '/documentation/menu/basic-menu.html.md' },
    { name: 'ts', path: '/documentation/menu/basic-menu.ts.md' }
  ];

  readonly codeBlocksComplexMenu = [
    { name: 'html', path: '/documentation/menu/complex-menu.html.md' },
    { name: 'ts', path: '/documentation/menu/complex-menu.ts.md' }
  ];

  readonly codeBlocksValueMenu = [
    { name: 'html', path: '/documentation/menu/value-menu.html.md' },
    { name: 'ts', path: '/documentation/menu/value-menu.ts.md' }
  ];

  selectedValue = signal('apple');

  valueItems = computed(() => [
    {
      label: 'Fruits',
      icon: 'apple',
      children: [
        { label: 'Apple', value: 'apple', icon: 'circle' },
        { label: 'Banana', value: 'banana', icon: 'circle' },
        { label: 'Orange', value: 'orange', icon: 'circle' },
      ],
    },
    {
      label: 'Vegetables',
      icon: 'leaf',
      children: [
        { label: 'Carrot', value: 'carrot', icon: 'circle' },
        { label: 'Broccoli', value: 'broccoli', icon: 'circle' },
        { label: 'Tomato', value: 'tomato', icon: 'circle' },
      ],
    },
    { label: 'Water', value: 'water', icon: 'droplet' },
    { label: 'Juice', value: 'juice', icon: 'cup-soda' },
  ]);

  onTriggerClick() {
    alert('Menu trigger clicked!');
  }

  items = computed(() => {
    return [
      {
        label: 'Components',
        icon: 'folder',
        children: [
          {
            label: 'Select',
            icon: 'folder',
            children: [
              { label: 'Single', url: '/menu', icon: 'check' },
              { label: 'Multiple', url: '/menu', icon: 'list' },
              { label: 'Autocomplete', url: '/menu', icon: 'search' },
            ],
          },
          {
            label: 'Popovers',
            icon: 'folder',
            children: [
              { label: 'Menu', url: '/menu', icon: 'panel-right' },
              { label: 'Dialog', url: '/menu', icon: 'message-square' },
              { label: 'Confirmation', url: '/menu', icon: 'shield-check' },
            ],
          },
          {
            label: 'Inputs',
            icon: 'folder',
            children: [
              {
                label: 'Text',
                icon: 'file-text',
                children: [
                  { label: 'Basic', url: '/menu', icon: 'dot' },
                  { label: 'With Icon', url: '/menu', icon: 'dot' },
                ],
              },
              {
                label: 'Datepicker',
                icon: 'calendar',
                children: [
                  { label: 'Single', url: '/menu', icon: 'dot' },
                  { label: 'Range', url: '/menu', icon: 'dot' },
                ],
              },
            ],
          },
        ],
      },
      { label: 'Alert on Click', callback: this.onTriggerClick, icon: 'bell' },
      {
        label: 'Settings',
        icon: 'settings',
        children: [
          { label: 'Profile', url: '/menu', icon: 'user' },
          { label: 'Security', url: '/menu', icon: 'lock' },
        ],
      },
    ];
  });
}



