import {IsActiveMatchOptions, Router} from '@angular/router';
import {MenuItemType} from './menu-item.type';

export const MENU_ACTIVE_ROUTE_OPTIONS: IsActiveMatchOptions = {
  paths: 'exact',
  queryParams: 'ignored',
  fragment: 'ignored',
  matrixParams: 'ignored',
};

export function findActiveMenuItemByUrl(items: MenuItemType[], router: Router): MenuItemType | undefined {
  for (const item of items) {
    if (item.url && router.isActive(item.url, MENU_ACTIVE_ROUTE_OPTIONS)) {
      return item;
    }

    if (item.children?.length) {
      const nestedActiveItem = findActiveMenuItemByUrl(item.children, router);
      if (nestedActiveItem) {
        return nestedActiveItem;
      }
    }
  }

  return undefined;
}

export function hasActiveMenuUrl(items: MenuItemType[], router: Router): boolean {
  return !!findActiveMenuItemByUrl(items, router);
}
