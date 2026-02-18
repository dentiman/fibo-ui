import {ChangeDetectionStrategy, Component, input, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MenuItemType} from '../menu-item.type';
import {DataListItem} from '@fibo-ui/cdk';
import {LucideAngularModule} from 'lucide-angular';
import {CollapseSubmenuItem} from './collapse-submenu-item';
import {TreeMenuChain} from './tree-menu-chain.component';

@Component({
  selector: 'fibo-tree-menu',
  standalone: true,
  host: {
    'class': 'flex flex-col',
  },
  imports: [CommonModule, RouterLink, DataListItem, LucideAngularModule, CollapseSubmenuItem, TreeMenuChain],
  templateUrl: './tree-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeMenu {
  items = input<MenuItemType[]>([]);
  menuContent = input<TemplateRef<any>>()
  level = input<number>(0);
  removeChainFromLevel = input<number|null>(null);
}
