import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, TemplateRef } from '@angular/core';
import { DataListItem, MenuPanel, Popover, SubmenuTrigger } from '@fibo-ui/cdk';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { MenuItemType } from '../menu-item.type';

@Component({
  selector: 'fibo-menu',
  hostDirectives: [
    {
      directive: MenuPanel,
      inputs: ['keyboardSource'],
    },
  ],
  host: {
    'class': 'popover-container  group min-w-40',
    'role': 'menu',
  },
  imports: [CommonModule, DataListItem, SubmenuTrigger, RouterLink, LucideAngularModule, Popover],
  templateUrl: './menu.html',
})
export class Menu {
  items = input<MenuItemType[]>();
  menuContent = input<TemplateRef<any>>();
  itemsHaveIcons = computed(() => this.items()?.some((item) => !!item.icon));
  menuPanel = inject(MenuPanel);
}
