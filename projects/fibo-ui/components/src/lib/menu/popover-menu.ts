import {Component, computed, inject, input, output, TemplateRef, viewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Popover, DataList, DataListItem} from '@fibo-ui/cdk';
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
      inputs: ['overlayTrigger']
    }
  ],
  host: {
    'class': 'p-1 min-w-[180px] group rounded-md bg-white shadow-md outline-1 outline-gray-200',
    '(keydown.arrowleft)': 'focusToTrigger($event)'
  },
  imports: [CommonModule, DataListItem, PopoverSubmenuTrigger, RouterLink, LucideAngularModule],
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
    if (this.popover.overlayTrigger().isListItem) {
      this.popover.overlayTrigger().element.focus();
      this.dataList.resetActiveOption();
      event.stopPropagation();
      this.submenuItems()
        .forEach(item => {
          item.overlayTrigger.close()
        });

    }
  }
}
