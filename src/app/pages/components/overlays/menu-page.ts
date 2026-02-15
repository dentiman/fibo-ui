import {Component, computed, signal, viewChild} from '@angular/core';
import {
  DataList,
  Popover,
  PopoverTriggerToggle, PortalContent,
  SelectOne
} from '@fibo-ui/cdk';
import {MenuItem, Menu, type MenuItemType} from '@fibo-ui/components';
import {RouterLink} from '@angular/router';
import {UsageDemo} from '../../../common/usage-demo';
import {developerSkillsMenuItems} from '../../../common/form-data-example';

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
  template: `
<div class="px-4 flex flex-col space-y-12">
  <app-usage-demo [codeBlocks]="codeBlocksBasicMenu">
    <div class="mx-auto w-60 p-8">
      <button #menu="PopoverTrigger" class="btn mr-1" fiboPopoverTriggerToggle>Open Basic Menu</button>
      @if (menu.isOpen()) {
        <fibo-menu fiboPopover [trigger]="menu">
          <a fiboMenuItem class="datalist-item py-1 px-2 rounded-md relative group text-sm" [routerLink]="'/select'">
            Select</a>
          <a fiboMenuItem class="datalist-item py-1 px-2 rounded-md relative group text-sm"
             [routerLink]="'/select-multiple'"> Select Multiple</a>
        </fibo-menu>
      }
    </div>
  </app-usage-demo>

  <app-usage-demo [codeBlocks]="codeBlocksComplexMenu">
    <div class="mx-auto w-60 p-8">
      <button #trigger="PopoverTrigger" class="btn btn-primary" fiboPopoverTriggerToggle>Open Complex Menu</button>
      <ng-template [(isOpen)]="trigger.isOpen" fiboPortalContent>
        <fibo-menu fiboPopover [items]="items()" [trigger]="trigger" placement="bottom-start">
        </fibo-menu>
      </ng-template>
    </div>
  </app-usage-demo>

  <app-usage-demo [codeBlocks]="codeBlocksValueMenu">
    <div class="mx-auto w-60 p-8">
      <button #valueMenu="PopoverTrigger" class="btn" fiboPopoverTriggerToggle>
        Select Option: {{ selectedValue() || 'None' }}
      </button>
      <ng-template [(isOpen)]="valueMenu.isOpen" fiboPortalContent>
        <fibo-menu fiboPopover [items]="valueItems()"
                   [trigger]="valueMenu"
                   fiboSelectOne [(value)]="selectedValue"
                   placement="bottom-start">
        </fibo-menu>
      </ng-template>
    </div>
  </app-usage-demo>
</div>
  `,

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
