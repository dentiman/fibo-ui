import {computed, Directive, inject, input, signal} from '@angular/core';
import {IsActiveMatchOptions, NavigationEnd, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter} from 'rxjs';
import {SELECTION_MODEL, SelectionModel} from './selection-models';

const DEFAULT_ROUTE_MATCH_OPTIONS: IsActiveMatchOptions = {
  paths: 'exact',
  queryParams: 'ignored',
  fragment: 'ignored',
  matrixParams: 'ignored',
};

@Directive({
  selector: '[fiboRouterSelectOne]',
  standalone: true,
  providers: [{provide: SELECTION_MODEL, useExisting: RouterSelectOne}]
})
export class RouterSelectOne<T> implements SelectionModel<T> {
  private router = inject(Router);

  // Extract URL from value - handles both string URLs and objects with .url property
  urlOf = input<(value: T) => string | undefined>((value: any) => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && 'url' in value) return value.url;
    return undefined;
  });

  routeMatchOptions = input<IsActiveMatchOptions>(DEFAULT_ROUTE_MATCH_OPTIONS);

  // Internal state - tracks current URL to trigger reactivity
  private _currentUrl = signal<string>(this.router.url);

  // Public value signal - triggers Option.isSelected recomputation
  value = computed(() => this._currentUrl());

  lastSelection = computed(() => {
    const url = this._currentUrl();
    return url as T | null;
  });

  constructor() {
    // Subscribe to route changes
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this._currentUrl.set(event.urlAfterRedirects);
      });
  }

  isSelected(value: T): boolean {
    const url = this.urlOf()(value);
    if (!url) return false;
    return this.router.isActive(url, this.routeMatchOptions());
  }

  select(value: T): void {
    const url = this.urlOf()(value);
    if (url) {
      this.router.navigateByUrl(url);
    }
  }
}
