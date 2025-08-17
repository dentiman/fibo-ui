import {
  computed,
  Directive,
  ElementRef,
  inject,
  input, OnDestroy, OnInit,
  Signal,
} from '@angular/core';
import {MultipleSelectionModel, SELECTION_MODEL, SelectionModel} from './selection-models';
import {DataList} from './data-list';
import {DataListItem} from './data-list-item';


@Directive({
  selector: '[Option]',
  exportAs: 'Option',
  standalone: true,
  hostDirectives: [
    {
      directive: DataListItem,
      inputs: ['disabled' ],
      outputs: ['itemTrigger']
    }
  ],
  host: {
    '[attr.aria-selected]': 'isSelected()',
    '[attr.data-multiple]': 'isMultiple',
    '(itemTrigger)':  'triggerSelection($event)',
    'tabindex': '-1',
  },
})
export class Option<T> {

  readonly element: HTMLElement = inject(ElementRef).nativeElement;

  selectionModel = inject(SELECTION_MODEL) as SelectionModel<T>;

  get isMultiple() {
    return this.selectionModel instanceof MultipleSelectionModel;
  }

  value = input.required<T>({ alias: 'Option' });

  disabled = input(false);

  isSelected: Signal<boolean> = computed(() => {
    this.selectionModel.value();
    return this.selectionModel.isSelected(this.value());
  });


  triggerSelection($event: Event) {
    //TODO:: check double selection conflict on click
    this.selectionModel.select(this.value());
  }

  getLabel() {
    return this.element.textContent?.trim() || '';
  }
}
