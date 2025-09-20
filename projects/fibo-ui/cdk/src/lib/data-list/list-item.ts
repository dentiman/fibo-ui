import {computed, Directive, ElementRef, inject, input, OnDestroy, OnInit, output, Signal,} from '@angular/core';
import {DataList} from './data-list';
import {MultipleSelectionModel, SELECTION_MODEL, SelectionModel} from './selection-models';


@Directive({
  selector: '[fiboListItemValue], [fiboListItem]',
  exportAs: 'ListItem',
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
export class ListItem<T = any> implements OnInit, OnDestroy {
  readonly dataList = inject(DataList);

  readonly element: HTMLElement = inject(ElementRef).nativeElement;

  disabled = input(false);

  itemTrigger = output<Event>();

  // Optional selection model injection
  selectionModel = inject(SELECTION_MODEL, { optional: true }) as SelectionModel<T> | null;

  // Option value input
  value = input<T|undefined>(undefined, { alias: 'fiboListItemValue' });

  isActive: Signal<boolean> = computed(() => {
    return this === this.dataList.activeOption();
  });

  get isMultiple() {
    return this.selectionModel instanceof MultipleSelectionModel;
  }

  isSelected: Signal<boolean> = computed(() => {
    if (!this.selectionModel) {
      return false;
    }
    this.selectionModel.value();
    const optionValue = this.value();
    if (optionValue === undefined) {
      return false;
    }
    return this.selectionModel.isSelected(optionValue);
  });

  triggerSelection($event: Event) {
    if (this.disabled()) return;

    // Handle selection if selection model is available
    if (this.selectionModel) {
      const optionValue = this.value();
      if (optionValue !== undefined) {
        this.selectionModel.select(optionValue);
      }
    }

    this.dataList.optionTriggered.emit($event);
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
