import {Component, inject, input, TemplateRef, viewChild,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {IsEmptyPipe, MultipleSelectionModel, Popover,PopoverTriggerClick, PortalTemplateDirective} from '@fibo-ui/cdk';
import {FormFieldPopoverTrigger} from '@fibo-ui/cdk';
import {Listbox} from '../data-list/listbox/listbox';
import {FormField} from '../form/form-field/form-field';
import {FormFieldControl} from '@fibo-ui/cdk';
import {safeProp} from '@fibo-ui/cdk';
import {LucideAngularModule} from 'lucide-angular';
import {FormFieldErrors} from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-multiple-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IsEmptyPipe,
    Listbox,
    FormField,
    PopoverTriggerClick,
    LucideAngularModule,
    FormFieldErrors,
    Popover,
    MultipleSelectionModel,
    PortalTemplateDirective,
  ],
  templateUrl: './multiple-select.html',
  hostDirectives: [
    {
      directive: FormFieldControl,
      inputs: ['label', 'placeholder','fixedLabel', 'appearance', 'controlClass', 'resetCallback'],
    }
  ],
})
export class MultipleSelect<T> {
  formFieldControl = inject<FormFieldControl>(FormFieldControl)
  value = this.formFieldControl.cva.value;
  disabled = this.formFieldControl.cva.disabled;
  items = input<T[]>([]);
  itemTemplate = input<TemplateRef<any> | undefined>(undefined);
  selectedItemTemplate = input<TemplateRef<any> | undefined>(undefined);

  popoverFullWidth = input<boolean>(true);
  popoverClass = input<string>('');

  valueProp = input<keyof T>('value' as keyof T);
  labelProp = input<keyof T>('label' as keyof T);

  removeValue(value: unknown) {
    const currentValue = this.value();
    if(! currentValue) return;
    this.value.set( currentValue.filter((v: unknown) => v !== value));
  }
  trigger = viewChild<FormFieldPopoverTrigger>('trigger')

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
