import {Component, computed, viewChild} from '@angular/core';
import {
  DataList,
  PopoverTriggerToggle, PortalTemplateDirective,
  SingleSelectionModel
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
    PortalTemplateDirective
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



