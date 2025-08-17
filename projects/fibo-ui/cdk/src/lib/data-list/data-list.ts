import {Directive, effect, ElementRef, inject, InjectionToken, input, model, output, signal,} from '@angular/core';
import {OverlayTrigger} from '../overlay/overlay-trigger';
import {DataListItem} from './data-list-item';

export const DATA_LIST = new InjectionToken<DataList>('DataList');

let nextDataListId = 0;

@Directive({
  selector: '[fiboDataList]',
  exportAs: 'DataList',
  standalone: true,
  host: {
    '(mouseleave)': 'resetActiveOption()',
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
  disabled = input(false);
  elementRef = inject(ElementRef<HTMLElement>)

  overlayTrigger = input<OverlayTrigger>()

  optionTriggered = output<Event>();

  options = model<DataListItem[]>([]);

  id = `data-list-${nextDataListId++}`;

  protected _activeOption = signal<DataListItem | null>(null);

  activeOption = this._activeOption.asReadonly();

  constructor() {
    effect(() => {
      this.options();
      this._activeOption.set(null);
    });
  }

  registerOption(option: DataListItem) {
    const currentOptions = this.options();
    if (!currentOptions.includes(option)) {
      this.options.set([...currentOptions, option]);
    }
  }

  unregisterOption(option: DataListItem) {
    const currentOptions = this.options();
    this.options.set(currentOptions.filter(opt => opt !== option));
  }


  setActiveOption(option: DataListItem | null) {
    this._activeOption.set(option);
  }

  findNextOption(
    currentOption: DataListItem | null
  ): DataListItem | null {
    const optionsArray = this.options();
    // @ts-ignore
    const currentIndex = optionsArray.indexOf(currentOption);

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

  findPreviousOption(
    currentOption: DataListItem | null
  ): DataListItem | null {
    const optionsArray = this.options();
    // @ts-ignore
    const currentIndex = optionsArray.indexOf(currentOption);

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
    this.setActiveOption(this.findNextOption(this._activeOption()));
    event.preventDefault();
    if (!targetIsInput) this._activeOption()?.element.focus();
    this._activeOption()?.element.scrollIntoView({block: 'nearest', behavior: 'smooth'})
  }

  navigatePrev(event:Event) {
    const targetIsInput = event.target instanceof HTMLInputElement;
    this.setActiveOption(this.findPreviousOption(this._activeOption()));
    event.preventDefault();
    if (!targetIsInput) this._activeOption()?.element.focus();
    this._activeOption()?.element.scrollIntoView({block: 'nearest', behavior: 'smooth'})
  }


  onKeydown(event: KeyboardEvent) {
    const targetIsInput = event.target instanceof HTMLInputElement;
    switch (event.key) {
      case 'ArrowDown':
        this.setActiveOption(this.findNextOption(this._activeOption()));
        event.preventDefault();
        if (!targetIsInput) this._activeOption()?.element.focus();
        this._activeOption()?.element.scrollIntoView({block: 'nearest', behavior: 'smooth'})

        event.stopPropagation();
        break;
      case 'ArrowUp':
        this.setActiveOption(this.findPreviousOption(this._activeOption()));
        event.preventDefault();
        if (!targetIsInput) this._activeOption()?.element.focus();
        this._activeOption()?.element.scrollIntoView({block: 'nearest', behavior: 'smooth'})
        event.stopPropagation();
        break;
      case 'Enter':
        this._activeOption()?.triggerSelection(event);
        event.stopPropagation();
        break;
      case 'Escape':
        this.overlayTrigger()?.element.focus();
        this.overlayTrigger()?.close();
        event.stopPropagation();
        break;
      default:
        break;
    }

  }

  resetActiveOption() {
    this._activeOption.set(null);
  }


}
