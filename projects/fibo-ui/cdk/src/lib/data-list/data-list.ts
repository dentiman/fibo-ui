import { Directive, effect, InjectionToken, input, model, output, signal } from '@angular/core';
import { DataListItem } from './data-list-item.directive';
import { KeyboardSource, KeydownDelegate } from './keyboard-source';

export const DATA_LIST = new InjectionToken<DataList>('DataList');

let nextDataListId = 0;

@Directive({
  selector: '[fiboDataList]',
  exportAs: 'DataList',
  standalone: true,
  host: {
    '(mouseleave)': 'resetActiveDataListItem()',
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
export class DataList implements KeydownDelegate {
  disabled = input(false);
  keyboardSource = input<KeyboardSource | null>(null);

  itemTriggered = output<Event>();

  options = model<DataListItem[]>([]);

  id = `data-list-${nextDataListId++}`;

  protected _activeDataListItem = signal<DataListItem | null>(null);

  activeDataListItem = this._activeDataListItem.asReadonly();

  constructor() {
    effect(() => {
      this.options();
      this._activeDataListItem.set(null);
    });

    effect((onCleanup) => {
      const keyboardSource = this.keyboardSource();
      if (!keyboardSource) {
        return;
      }

      keyboardSource.delegate.set(this);

      onCleanup(() => {
        if (keyboardSource.delegate() === this) {
          keyboardSource.delegate.set(null);
        }
      });
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


  setActiveDataListItem(option: DataListItem | null) {
    this._activeDataListItem.set(option);
  }

  findNextDataListItem(
    currentDataListItem: DataListItem | null
  ): DataListItem | null {
    const optionsArray = this.options();
    if (optionsArray.length === 0) {
      return null;
    }
    // @ts-ignore
    const currentIndex = optionsArray.indexOf(currentDataListItem);

    // Start from the next option after current
    let nextIndex = currentIndex + 1;

    // If we're at the end, wrap around to the beginning
    if (nextIndex >= optionsArray.length) {
      nextIndex = 0;
    }

    // Find the next non-disabled option
    const startIndex = nextIndex;
    do {
      const option = optionsArray[nextIndex];
      if (!option.disabled()) {
        return option;
      }
      nextIndex = (nextIndex + 1) % optionsArray.length;
    } while (nextIndex !== startIndex);

    // If all options are disabled, return the first option (original behavior)
    return optionsArray[0] || null;
  }

  findPreviousDataListItem(
    currentDataListItem: DataListItem | null
  ): DataListItem | null {
    const optionsArray = this.options();
    if (optionsArray.length === 0) {
      return null;
    }
    // @ts-ignore
    const currentIndex = optionsArray.indexOf(currentDataListItem);

    // Start from the previous option before current
    let prevIndex = currentIndex - 1;

    // If we're at the beginning, wrap around to the end
    if (prevIndex < 0) {
      prevIndex = optionsArray.length - 1;
    }

    // Find the previous non-disabled option
    const startIndex = prevIndex;
    do {
      const option = optionsArray[prevIndex];
      if (!option.disabled()) {
        return option;
      }
      prevIndex = prevIndex - 1;
      if (prevIndex < 0) {
        prevIndex = optionsArray.length - 1;
      }
    } while (prevIndex !== startIndex);

    // If all options are disabled, return the last option (original behavior)
    return optionsArray[optionsArray.length - 1] || null;
  }

  navigateNext(event: any) {
    const targetIsInput = event.target instanceof HTMLInputElement;
    this.setActiveDataListItem(this.findNextDataListItem(this._activeDataListItem()));
    event.preventDefault();
    if (!targetIsInput) this._activeDataListItem()?.element.focus();
    this._activeDataListItem()?.element.scrollIntoView({block: 'nearest', behavior: 'smooth'})
  }

  navigatePrev(event:Event) {
    const targetIsInput = event.target instanceof HTMLInputElement;
    this.setActiveDataListItem(this.findPreviousDataListItem(this._activeDataListItem()));
    event.preventDefault();
    if (!targetIsInput) this._activeDataListItem()?.element.focus();
    this._activeDataListItem()?.element.scrollIntoView({block: 'nearest', behavior: 'smooth'})
  }


  onKeydown(event: KeyboardEvent) {
    const targetIsInput = event.target instanceof HTMLInputElement;
    switch (event.key) {
      case 'ArrowDown':
        this.setActiveDataListItem(this.findNextDataListItem(this._activeDataListItem()));
        event.preventDefault();
        if (!targetIsInput) this._activeDataListItem()?.element.focus();
        this._activeDataListItem()?.element.scrollIntoView({block: 'nearest', behavior: 'smooth'})

        event.stopPropagation();
        break;
      case 'ArrowUp':
        this.setActiveDataListItem(this.findPreviousDataListItem(this._activeDataListItem()));
        event.preventDefault();
        if (!targetIsInput) this._activeDataListItem()?.element.focus();
        this._activeDataListItem()?.element.scrollIntoView({block: 'nearest', behavior: 'smooth'})
        event.stopPropagation();
        break;
      case 'Enter':
        this._activeDataListItem()?.triggerSelection(event);
        event.stopPropagation();
        break;
      default:
        break;
    }

  }

  resetActiveDataListItem() {
    this._activeDataListItem.set(null);
  }


}
