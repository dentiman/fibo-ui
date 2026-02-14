import {Component, computed, inject, input, output, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Popover, Option, PortalContent, SubmenuPanel, SubmenuTrigger} from '@fibo-ui/cdk';
import {RouterLink} from '@angular/router';
import {MenuItemType} from '../menu-item.type';
import {LucideAngularModule} from 'lucide-angular';


@Component({
  selector: 'fibo-menu',
  standalone: true,
  hostDirectives: [
    SubmenuPanel,
    {
      directive: Popover,
      inputs: ['trigger']
    }
  ],
  host: {
    'class': 'popover-container  group min-w-40',
  },
  imports: [CommonModule, Option, SubmenuTrigger, RouterLink, LucideAngularModule, PortalContent],
  templateUrl: './popover-menu.html',
})
export class PopoverMenu {
  items = input<MenuItemType[]>();
  menuContent = input<TemplateRef<any>>()
  popover = inject(Popover);

  itemsHaveIcons = computed(() => this.items()?.some((item) => !!item.icon));

  closeParent = output()

  closeMenuWithParent() {
    this.popover.close();
    this.closeParent.emit()
  }
}
