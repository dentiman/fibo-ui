import { Directive, effect, inject, InjectionToken, input, model, output, signal } from '@angular/core';
import { DataListItem } from './data-list-item.directive';
import {
  type DataListNavigationStrategy,
  DATA_LIST_NAVIGATION_STRATEGY,
} from './data-list-navigation-strategy';

export const DATA_LIST = new InjectionToken<DataList>('DataList');

let nextDataListId = 0;

@Directive({
  selector: '[fiboDataList]',
  exportAs: 'DataList',
  standalone: true,
  host: {
    '(mouseleave)': 'onMouseleave($event)',
    '(keydown)': 'onKeydown($event)',
  },
  // providers: [
  //   {
  //     provide: DATA_LIST,
  //     deps: [[new Optional(), new SkipSelf(), DATA_LIST], forwardRef(() => DataList)],
  //     useExisting: DataList,
  //   },
  // ],
})
export class DataList {
  // Inject the default policy once so plain fiboDataList instances work
  // without any local setup. Feature components can override it via
  // viewProviders or, rarely, per-instance via [navigationStrategy].
  private readonly defaultNavigationStrategy = inject(DATA_LIST_NAVIGATION_STRATEGY);

  disabled = input(false);
  keyboardSourceElement = model<HTMLElement | null>(null);
  autoActivateFirst = input(false);
  navigationStrategy = input<DataListNavigationStrategy>(this.defaultNavigationStrategy);

  itemTriggered = output<Event>();

  options = model<DataListItem[]>([]);

  id = `data-list-${nextDataListId++}`;

  protected _activeDataListItem = signal<DataListItem | null>(null);

  readonly mouseleaveResetGuard = signal<((event: MouseEvent) => boolean) | null>(null);

  activeDataListItem = this._activeDataListItem.asReadonly();

  /** Tracks how the active item was last changed: 'mouse', 'keyboard', or null. */
  readonly lastActivationSource = signal<'mouse' | 'keyboard' | null>(null);

  constructor() {
    effect(() => {
      const options = this.options();
      const activeItem = this._activeDataListItem();

      if (activeItem && options.includes(activeItem) && !activeItem.disabled()) {
        return;
      }

      this.setActiveDataListItem(
        this.autoActivateFirst() ? (options.find(option => !option.disabled()) ?? null) : null,
        null,
      );
    });

    effect((onCleanup) => {
      const el = this.keyboardSourceElement();
      if (!el) return;

      const handler = (e: KeyboardEvent) => this.onKeydown(e);
      el.addEventListener('keydown', handler);
      onCleanup(() => el.removeEventListener('keydown', handler));
    });
  }

  registerDataListItem(option: DataListItem) {
    const currentDataListItems = this.options();
    if (!currentDataListItems.includes(option)) {
      this.options.set([...currentDataListItems, option]);
    }
  }

  unregisterDataListItem(option: DataListItem) {
    const currentDataListItems = this.options();
    this.options.set(currentDataListItems.filter(opt => opt !== option));
  }

  setActiveDataListItem(
    option: DataListItem | null,
    activationSource: 'mouse' | 'keyboard' | null = null,
  ) {
    this._activeDataListItem.set(option);
    this.lastActivationSource.set(activationSource);
  }

  findNextDataListItem(currentDataListItem: DataListItem | null): DataListItem | null {
    const optionsArray = this.options();
    if (optionsArray.length === 0) {
      return null;
    }

    return this.findRelativeDataListItem(currentDataListItem, 1);
  }

  findPreviousDataListItem(currentDataListItem: DataListItem | null): DataListItem | null {
    const optionsArray = this.options();
    if (optionsArray.length === 0) {
      return null;
    }

    return this.findRelativeDataListItem(currentDataListItem, -1);
  }

  navigateNext(event: Event) {
    this.setActiveDataListItem(this.findNextDataListItem(this._activeDataListItem()), 'keyboard');
    this.navigationStrategy().applyKeyboardNavigation(this, event);
  }

  navigatePrev(event: Event) {
    this.setActiveDataListItem(this.findPreviousDataListItem(this._activeDataListItem()), 'keyboard');
    this.navigationStrategy().applyKeyboardNavigation(this, event);
  }

  navigateFirst(event: Event) {
    this.setActiveDataListItem(this.findBoundaryDataListItem(1), 'keyboard');
    this.navigationStrategy().applyKeyboardNavigation(this, event);
  }

  navigateLast(event: Event) {
    this.setActiveDataListItem(this.findBoundaryDataListItem(-1), 'keyboard');
    this.navigationStrategy().applyKeyboardNavigation(this, event);
  }

  activateCurrentItem(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this._activeDataListItem()?.triggerSelection(event);
  }

  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        this.navigateNext(event);
        break;
      case 'ArrowUp':
        this.navigatePrev(event);
        break;
      case 'Enter':
        this.activateCurrentItem(event);
        break;
      case 'Home':
        this.navigateFirst(event);
        break;
      case 'End':
        this.navigateLast(event);
        break;
      default:
        break;
    }
  }

  resetActiveDataListItem() {
    this.setActiveDataListItem(null, null);
  }

  onMouseleave(event: MouseEvent) {
    const guard = this.mouseleaveResetGuard();
    if (guard ? guard(event) : true) {
      this.setActiveDataListItem(null, null);
    }
  }

  private findRelativeDataListItem(
    currentDataListItem: DataListItem | null,
    step: 1 | -1,
  ): DataListItem | null {
    const optionsArray = this.options();

    if (!optionsArray.length) {
      return null;
    }

    const currentIndex =
      currentDataListItem ? optionsArray.indexOf(currentDataListItem) : -1;

    let nextIndex = currentIndex;

    for (let i = 0; i < optionsArray.length; i++) {
      nextIndex =
        currentIndex === -1 && i === 0 ?
          (step > 0 ? 0 : optionsArray.length - 1) :
          (nextIndex + step + optionsArray.length) % optionsArray.length;

      const option = optionsArray[nextIndex];
      if (!option.disabled()) {
        return option;
      }
    }

    return null;
  }

  private findBoundaryDataListItem(step: 1 | -1): DataListItem | null {
    const options =
      step > 0 ? this.options() : [...this.options()].reverse();

    return options.find(option => !option.disabled()) ?? null;
  }
}
