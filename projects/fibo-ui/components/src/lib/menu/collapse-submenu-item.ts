import {DestroyRef, Directive, inject, input, model, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {DataListItem, MenuItemType} from '@spacy-ui/components';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Directive({
  selector: '[suiCollapseSubmenuItem]',
  exportAs: 'suiCollapseSubmenuItem',
  hostDirectives: [
    {
      directive: DataListItem,
      inputs: ['disabled'],
    },
  ],
  host: {
    '(click)': "toggle()",
    '[attr.aria-expanded]': 'expanded() || null',
  }
})
export class CollapseSubmenuItem implements OnInit {
  router = inject(Router);
  items = input<MenuItemType[]>([]);
  expanded = model(false);
  toggle = () => this.expanded.set(!this.expanded());
  destroyRef = inject(DestroyRef)


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
    if (this.items().some(item => this.hasActiveUrl(item))) {
      this.expanded.set(true);
    }
  }

  private hasActiveUrl(item: MenuItemType): boolean {
    if (item.url && this.router.isActive(item.url, {
      paths: 'exact', // Use 'subset' for partial matches
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    })) {
      return true;
    }
    if (item.children) {
      return item.children.some(child => this.hasActiveUrl(child));
    }
    return false;
  };
}
