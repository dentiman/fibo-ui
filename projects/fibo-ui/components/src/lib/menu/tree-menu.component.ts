import {ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {MenuItemType} from './menu-item.type';
import {Option, SELECTION_MODEL, SelectionModel} from '@fibo-ui/cdk';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {LucideAngularModule} from 'lucide-angular';
import {CollapseSubmenuItem} from './collapse-submenu-item';
import {TreeMenuChain} from './tree-menu-chain.component';

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
    this.items().forEach(item => {
      const activeUrlItem = this.findActiveUrlItem(item);
      if (activeUrlItem && this.selectionModel) {
        this.selectionModel.select(activeUrlItem);
      }
    });
  }

  private findActiveUrlItem(item: MenuItemType): MenuItemType | undefined {
    if (item.url && this.router.isActive(item.url, {
      paths: 'exact', // Use 'subset' for partial matches
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    })) {
      return item;
    }
    if (item.children) {
      // @ts-ignore
      item.children.forEach(item => {
        const activeUrlItem = this.findActiveUrlItem(item);
        if (activeUrlItem) {
          return activeUrlItem;
        }
      });
    }
    return undefined;
  };

}
