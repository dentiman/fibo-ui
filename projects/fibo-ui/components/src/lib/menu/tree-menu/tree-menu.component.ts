import {ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {MenuItemType} from '../menu-item.type';
import {Option, SELECTION_MODEL, SelectionModel} from '@fibo-ui/cdk';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {LucideAngularModule} from 'lucide-angular';
import {CollapseSubmenuItem} from './collapse-submenu-item';
import {TreeMenuChain} from './tree-menu-chain.component';
import {findActiveMenuItemByUrl} from '../menu-active-route.utils';

@Component({
  selector: 'fibo-tree-menu',
  standalone: true,
  host: {
    'class': 'flex flex-col',
  },
  imports: [CommonModule, RouterLink, Option, LucideAngularModule, CollapseSubmenuItem, TreeMenuChain],
  templateUrl: './tree-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeMenu implements OnInit {
  router = inject(Router);
  destroyRef = inject(DestroyRef)
  items = input<MenuItemType[]>([]);
  menuContent = input<TemplateRef<any>>()
  level = input<number>(0);
  removeChainFromLevel = input<number|null>(null);
  selectionModel = inject<SelectionModel<MenuItemType>>(SELECTION_MODEL, {optional: true})

  ngOnInit(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.updateActiveStates()
        }
      });
    this.updateActiveStates()
  }


  private updateActiveStates() {
    const activeUrlItem = findActiveMenuItemByUrl(this.items(), this.router);
    if (activeUrlItem && this.selectionModel) {
      this.selectionModel.select(activeUrlItem);
    }
  }

}
