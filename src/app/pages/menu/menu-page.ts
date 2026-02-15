import {Component, computed, signal, viewChild} from '@angular/core';
import {
  DataList,
  Popover,
  PopoverTriggerToggle, PortalContent,
  SelectOne
} from '@fibo-ui/cdk';
import {MenuItem, Menu, type MenuItemType} from '@fibo-ui/components';
import {RouterLink} from '@angular/router';
import {UsageDemo} from '../../common/usage-demo';
import {developerSkillsMenuItems} from '../../common/form-data-example';

@Component({
  imports: [
    RouterLink,
    PopoverTriggerToggle,
    Popover,
    Menu,
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
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Orange', value: 'orange' },
      ],
    },
    {
      label: 'Vegetables',
      icon: 'leaf',
      children: [
        { label: 'Carrot', value: 'carrot' },
        { label: 'Broccoli', value: 'broccoli' },
        { label: 'Tomato', value: 'tomato' },
      ],
    },
    { label: 'Water', value: 'water' },
    { label: 'Juice', value: 'juice' },
  ]);

  onTriggerClick() {
    alert('Menu trigger clicked!');
  }

  items = computed((): MenuItemType[] => [
    ...developerSkillsMenuItems,
  ]);
}
