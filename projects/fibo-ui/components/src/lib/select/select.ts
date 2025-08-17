import {Component, computed, inject, input, TemplateRef, viewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {DataList, Option, OverlayTriggerClick, Popover, SingleSelectionModel,} from '@fibo-ui/components';

import {FormField} from '../form/form-field/form-field';
import {FormFieldDirective} from '../form/form-field/form-field-directive';
import {FormFieldErrors} from '../form/form-error/form-field-errors';
import {safeProp} from '../utils/property.utils';
import {LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'sui-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Popover,
    SingleSelectionModel,
    FormField,
    OverlayTriggerClick,
    DataList,
    Option,
    FormFieldErrors,
    LucideAngularModule,
  ],
  templateUrl: './select.html',
  hostDirectives: [
    {
      directive: FormFieldDirective,
      inputs: ['label', 'placeholder','fixedLabel'],
    }
  ],
})
export class Select<T = any>  {
  formFieldControl = inject<FormFieldDirective<string|number|null>>(FormFieldDirective)
  value =  this.formFieldControl.cva.value;
  disabled =  this.formFieldControl.cva.disabled
  items = input<T[]>([]);
  itemTemplate = input<TemplateRef<any> | undefined>(undefined);
  options = viewChild(Option);

  valueProp = input<keyof T>('value' as keyof T);
  labelProp = input<keyof T>('label' as keyof T);

  currentSelectedItem = computed(() => {
    const currentValue = this.value();
    return this.items().find(item => this.getValue(item) === currentValue);
  });

  getValue(item: T): string | number {
    return safeProp(item, this.valueProp());
  }

  getLabel(item: T): string {
    return String(safeProp(item, this.labelProp()));
  }
}
