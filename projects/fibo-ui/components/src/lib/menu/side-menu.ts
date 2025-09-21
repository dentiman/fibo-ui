import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {MenuItemType} from './menu-item.type';
import {ListItem, SELECTION_MODEL, SelectionModel} from '@fibo-ui/cdk';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {LucideAngularModule} from 'lucide-angular';
import {CollapseSubmenuItem} from './collapse-submenu-item';
import {SideMenuChain} from './side-menu-chain';

@Component({
  selector: 'fibo-side-menu',
  standalone: true,
  host: {
    'class': 'flex flex-col',
  },
  imports: [CommonModule, RouterLink, ListItem, LucideAngularModule, CollapseSubmenuItem, SideMenuChain],
  templateUrl: './side-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenu implements OnInit {
  router = inject(Router);
  destroyRef = inject(DestroyRef)
  items = input<MenuItemType[]>([]);
  menuContent = input<TemplateRef<any>>()
  level = input<number>(0);
  collapsable =  input<boolean>(true);
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
        console.log(activeUrlItem)
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
