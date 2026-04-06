/**
 * Minimal structural contract that navigation strategies need from DataList.
 * Intentionally avoids importing DataList directly to prevent a circular
 * module dependency (data-list → strategy → data-list).
 */
interface DataListContext {
  activeDataListItem(): { element: HTMLElement } | null;
}

export interface DataListNavigationStrategy {
  /**
   * Applies DOM-level keyboard navigation behavior after DataList updates
   * its active item state.
   *
   * Examples:
   * - focus strategy: move DOM focus to the active option
   * - active-descendant strategy: keep focus on the trigger/input and only scroll
   */
  applyKeyboardNavigation(dataList: DataListContext, event: Event): void;
}

function focusActiveItem(dataList: DataListContext, preventScroll = true): void {
  const active = dataList.activeDataListItem();

  if (!active) {
    return;
  }

  active.element.focus({ preventScroll });
}

function scrollActiveItemIntoView(dataList: DataListContext): void {
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
