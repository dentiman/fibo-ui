import {Component, computed, inject, input, output, TemplateRef, viewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Popover, DataList, ListItem} from '@fibo-ui/cdk';
import {RouterLink} from '@angular/router';
import {PopoverSubmenuTrigger} from './popover-submenu-trigger';
import {MenuPanel} from './menu-panel';
import {MenuItemType} from './menu-item.type';
import {LucideAngularModule} from 'lucide-angular';


@Component({
  selector: 'fibo-menu',
  standalone: true,
  hostDirectives: [
    MenuPanel,
    {
      directive: Popover,
      inputs: ['trigger']
    }
  ],
  host: {
    'class': 'p-1 min-w-[180px]  group rounded-md fibo-popover',
    '(keydown.arrowleft)': 'focusToTrigger($event)'
  },
  imports: [CommonModule, ListItem, PopoverSubmenuTrigger, RouterLink, LucideAngularModule],
  templateUrl: './popover-menu.html',
})
export class PopoverMenu {
  items = input<MenuItemType[]>();
  menuContent = input<TemplateRef<any>>()
  dataList = inject(DataList);
  popover = inject(Popover);

  itemsHaveIcons = computed(() => this.items()?.some((item) => !!item.icon));

  submenuItems = viewChildren(PopoverSubmenuTrigger);

  closeParent = output()

  closeMenuWithParent() {
    this.popover.close();
    this.closeParent.emit()
  }


  focusToTrigger(event: Event) {
    if (this.popover.trigger().isListItem) {
      this.popover.trigger().element.focus();
      this.dataList.resetActiveOption();
      event.stopPropagation();
      this.submenuItems()
        .forEach(item => {
          item.popoverTrigger.close()
        });

    }
  }
}
