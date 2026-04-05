import { InjectionToken, Provider } from '@angular/core';
import type { DataList } from './data-list';

export interface DataListNavigationStrategy {
  /**
   * Applies DOM-level keyboard navigation behavior after DataList updates
   * its active item state.
   *
   * Examples:
   * - focus strategy: move DOM focus to the active option
   * - active-descendant strategy: keep focus on the trigger/input and only scroll
   */
  applyKeyboardNavigation(dataList: DataList, event: Event): void;
}

function focusActiveItem(dataList: DataList, preventScroll = true): void {
  const active = dataList.activeDataListItem();

  if (!active) {
    return;
  }

  active.element.focus({ preventScroll });
}

function scrollActiveItemIntoView(dataList: DataList): void {
  dataList.activeDataListItem()?.element.scrollIntoView({
    block: 'nearest',
  });
}

export const FOCUS_ACTIVE_DATA_LIST_NAVIGATION_STRATEGY: DataListNavigationStrategy = {
  applyKeyboardNavigation(dataList, event) {
    event.preventDefault();
    event.stopPropagation();
    focusActiveItem(dataList);
    scrollActiveItemIntoView(dataList);
  },
};

export const ACTIVE_DESCENDANT_DATA_LIST_NAVIGATION_STRATEGY: DataListNavigationStrategy = {
  applyKeyboardNavigation(dataList, event) {
    event.preventDefault();
    event.stopPropagation();
    scrollActiveItemIntoView(dataList);
  },
};

export const DATA_LIST_NAVIGATION_STRATEGY = new InjectionToken<DataListNavigationStrategy>(
  'DATA_LIST_NAVIGATION_STRATEGY',
  {
    // Most list-based UIs in the library are focus-driven by default:
    // select, menu, listbox, calendar, side menu.
    factory: () => FOCUS_ACTIVE_DATA_LIST_NAVIGATION_STRATEGY,
  },
);

export function provideDataListNavigationStrategy(
  strategy: DataListNavigationStrategy,
): Provider {
  return {
    provide: DATA_LIST_NAVIGATION_STRATEGY,
    useValue: strategy,
  };
}
