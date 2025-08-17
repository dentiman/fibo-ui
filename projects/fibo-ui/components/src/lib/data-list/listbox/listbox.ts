import {Component, inject, input, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataList, MultipleSelectionModel, Option, SELECTION_MODEL, SelectionModel, safeProp} from '@fibo-ui/cdk';
import {Checkbox} from '../../checkbox/checkbox';

@Component({
  selector: 'fibo-listbox',
  imports: [
    CommonModule,
    Checkbox,
    Option
  ],
  hostDirectives: [{
    directive: DataList,
    inputs: ['disabled','overlayTrigger'],
    outputs: ['optionTriggered'],
  }],
  templateUrl: './listbox.html',
  host: {
    'class': 'max-h-70 overflow-y-auto py-1 px-1',
    'role': 'listbox',
    'tabindex': '-1'
  },
})
export class Listbox<T = any> {
  selectionModel = inject(SELECTION_MODEL) as SelectionModel<T>;
  disabled = input(false);
  items = input<T[]>([]);
  itemTemplate = input<TemplateRef<any> | undefined>(undefined);

  valueProp = input<keyof T>('value' as keyof T);
  labelProp = input<keyof T>('label' as keyof T);

  get isMultiple() {
    return this.selectionModel instanceof MultipleSelectionModel;
  }

  getValue(item: T): string | number {
    return safeProp(item, this.valueProp());
  }

  getLabel(item: T): string {
    return String(safeProp(item, this.labelProp()));
  }

  isSelected(item: T): boolean {
    return this.selectionModel.isSelected(item as any);
  }
}
