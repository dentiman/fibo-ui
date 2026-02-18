import {computed, Directive, ElementRef, inject, input, OnDestroy, OnInit, output, Signal,} from '@angular/core';
import {DataList} from './data-list';
import {SelectMulti, SELECTION_MODEL, SelectionModel} from './selection-models';


@Directive({
  selector: '[fiboDataListItem]',
  exportAs: 'DataListItem',
  standalone: true,
  host: {
    '[attr.aria-disabled]': '(disabled() === true || this.dataList.disabled() === true) || null',
    '[attr.data-active]': 'isActive() || null',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.data-multiple]': 'isMultiple',
    '(mouseenter)': 'setActive()',
    '(click)': 'triggerSelection($event)',
    'tabindex': '-1',
  },
})
export class DataListItem<T = any> implements OnInit, OnDestroy {
  readonly dataList = inject(DataList);

  readonly element: HTMLElement = inject(ElementRef).nativeElement;

  disabled = input(false);

  itemTrigger = output<Event>();

  // Optional selection model injection
  selectionModel = inject(SELECTION_MODEL, { optional: true }) as SelectionModel<T> | null;

  // DataListItem value input
  value = input<T|undefined>(undefined);

  isActive: Signal<boolean> = computed(() => {
    return this === this.dataList.activeOption();
  });

  get isMultiple() {
    return this.selectionModel instanceof SelectMulti;
  }

  isSelected: Signal<boolean> = computed(() => {
    if (!this.selectionModel) {
      return false;
    }
    this.selectionModel.value();
    const itemValue = this.value();
    if (itemValue === undefined) {
      return false;
    }
    return this.selectionModel.isSelected(itemValue);
  });


  triggerSelection($event: Event) {
    if (this.disabled()) return;

    // Handle selection if selection model is available
    if (this.selectionModel) {
      const itemValue = this.value();
      if (itemValue !== undefined) {
        this.selectionModel.select(itemValue);
      }
    }

    this.dataList.itemTriggered.emit($event);
    this.itemTrigger.emit($event);
  }

  setActive() {
    this.dataList.setActiveOption(this);
  }

  ngOnInit() {
    this.dataList.registerOption(this);
  }

  ngOnDestroy() {
    this.dataList.unregisterOption(this);
  }
}
