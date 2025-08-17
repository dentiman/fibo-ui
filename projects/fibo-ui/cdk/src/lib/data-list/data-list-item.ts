import {computed, Directive, ElementRef, inject, input, OnDestroy, OnInit, output, Signal,} from '@angular/core';
import {DataList} from './data-list';


@Directive({
  selector: '[fiboDataListItem]',
  exportAs: 'DataListItem',
  standalone: true,
  host: {
    '[attr.aria-disabled]': '(disabled() === true || this.dataList.disabled() === true) || null',
    '[attr.data-active]': 'isActive() || null',
    '(mouseenter)': 'setActive()',
    '(click)': 'triggerSelection($event)',
    'tabindex': '-1',
  },
})
export class DataListItem implements OnInit, OnDestroy {
  readonly dataList = inject(DataList);

  // readonly parentDataList = inject(DATA_LIST);

  readonly element: HTMLElement = inject(ElementRef).nativeElement;

  disabled = input(false);

  itemTrigger = output<Event>();

  isActive: Signal<boolean> = computed(() => {
    return this === this.dataList.activeOption();
  });

  triggerSelection($event: Event) {
    if (this.disabled()) return;
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
