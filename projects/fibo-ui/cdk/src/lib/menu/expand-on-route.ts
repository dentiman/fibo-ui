import { DestroyRef, Directive, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IsActiveMatchOptions, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Expandable } from './expandable';
import { hasActiveMenuUrl, MENU_ACTIVE_ROUTE_OPTIONS } from './menu-active-route.utils';
import { MenuItemType } from './menu-item.type';

/**
 * Directive that automatically expands when a child route is active.
 *
 * **Requirements:**
 * - Host element must have `fiboExpandable` directive
 *
 * **Accepts two input modes:**
 * - `items`: Array of MenuItemType (uses hasActiveMenuUrl)
 * - `routes`: Array of URL strings (uses router.isActive directly)
 *
 * Usage with MenuItemType:
 * ```html
 * <div fiboExpandable fiboExpandOnRoute [items]="menuItems">
 * ```
 *
 * Usage with string routes:
 * ```html
 * <div fiboExpandable fiboExpandOnRoute [routes]="['/users', '/settings']">
 * ```
 *
 * Behavior:
 * - Checks on init and after each navigation
 * - Only expands (never collapses) — user can manually collapse
 */
@Directive({
  selector: '[fiboExpandOnRoute]',
})
export class ExpandOnRoute implements OnInit {
  private router = inject(Router);
  private expandable = inject(Expandable);
  private destroyRef = inject(DestroyRef);

  /** MenuItemType array for complex menu structures */
  items = input<MenuItemType[]>([]);

  /** Simple URL string array for direct route checking */
  routes = input<string[]>([]);

  /** Route matching options (defaults to MENU_ACTIVE_ROUTE_OPTIONS) */
  routeMatchOptions = input<IsActiveMatchOptions>(MENU_ACTIVE_ROUTE_OPTIONS);

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.checkAndExpand());

    this.checkAndExpand();
  }

  private checkAndExpand() {
    const hasActive = this.items().length
      ? hasActiveMenuUrl(this.items(), this.router)
      : this.routes().some(url => this.router.isActive(url, this.routeMatchOptions()));

    if (hasActive) {
      this.expandable.expanded.set(true);
    }
  }
}
