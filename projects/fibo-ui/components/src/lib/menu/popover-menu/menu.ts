import {Component, computed, inject, input, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuPanel, Popover, DataListItem, PortalContent, SubmenuTrigger} from '@fibo-ui/cdk';
import {RouterLink} from '@angular/router';
import {MenuItemType} from '../menu-item.type';
import {LucideAngularModule} from 'lucide-angular';


@Component({
  selector: 'fibo-menu',
  standalone: true,
  hostDirectives: [
    {
      directive: MenuPanel,
      outputs: ['closeParent'],
    },
  ],
  host: {
    'class': 'popover-container  group min-w-40',
  },
  imports: [CommonModule, DataListItem, SubmenuTrigger, RouterLink, LucideAngularModule, PortalContent, Popover],
  templateUrl: './menu.html',
})
export class Menu {
  items = input<MenuItemType[]>();
  menuContent = input<TemplateRef<any>>()
  itemsHaveIcons = computed(() => this.items()?.some((item) => !!item.icon));
  menuPanel = inject(MenuPanel);
}
