import {Component, inject, input, TemplateRef, viewChild,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {IsEmptyPipe, MultipleSelectionModel, OverlayTriggerClick, Popover} from '@fibo-ui/components';
import {FormFieldOverlayTrigger} from '../form/form-field-overlay-trigger';
import {Listbox} from '../data-list/listbox/listbox';
import {FormField} from '../form/form-field/form-field';
import {FormFieldDirective} from '../form/form-field/form-field-directive';
import {safeProp} from '../utils/property.utils';
import {LucideAngularModule} from 'lucide-angular';
import {FormFieldErrors} from '../form/form-error/form-field-errors';

@Component({
  selector: 'sui-multiple-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Popover,
    MultipleSelectionModel,
    IsEmptyPipe,
    Listbox,
    FormField,
    OverlayTriggerClick,
    LucideAngularModule,
    FormFieldErrors,
  ],
  templateUrl: './multiple-select.html',
  hostDirectives: [
    {
      directive: FormFieldDirective,
      inputs: ['label', 'placeholder','fixedLabel'],
    }
  ],
})
export class MultipleSelect<T> {
  formFieldControl = inject<FormFieldDirective<(string|number)[]|null>>(FormFieldDirective)
  value = this.formFieldControl.cva.value;
  disabled = this.formFieldControl.cva.disabled;
  items = input<T[]>([]);
  itemTemplate = input<TemplateRef<any> | undefined>(undefined);
  selectedItemTemplate = input<TemplateRef<any> | undefined>(undefined);

  valueProp = input<keyof T>('value' as keyof T);
  labelProp = input<keyof T>('label' as keyof T);

  removeValue(value: unknown) {
    const currentValue = this.value();
    if(! currentValue) return;
    this.value.set( currentValue.filter((v: unknown) => v !== value));
  }
  trigger = viewChild<FormFieldOverlayTrigger>('trigger')

  selectedItem(value: string | number): T | undefined {
    return this.items().find(item => this.getValue(item) === value);
  }

  getValue(item: T): string | number {
    return safeProp(item, this.valueProp());
  }

  getLabel(item: T): string {
    return String(safeProp(item, this.labelProp()));
  }
}
