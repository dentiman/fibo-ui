import {DestroyRef, Directive, inject, input, model, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Option} from '@fibo-ui/cdk';
import {MenuItemType} from '../menu-item.type';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {hasActiveMenuUrl} from '../menu-active-route.utils';

@Directive({
  selector: '[fiboCollapseSubmenuItem]',
  exportAs: 'fiboCollapseSubmenuItem',
  hostDirectives: [
    {
      directive: Option,
      inputs: ['disabled'],
    },
  ],
  host: {
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
    if (hasActiveMenuUrl(this.items(), this.router)) {
      this.expanded.set(true);
    }
  }
}
