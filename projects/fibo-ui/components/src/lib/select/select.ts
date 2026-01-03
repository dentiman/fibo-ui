import {Component, computed, inject, input, model} from '@angular/core';
import {FormValueControl, ValidationError, WithOptionalField} from '@angular/forms/signals';
import {
  DataList,
  FormFieldTrigger, ListItem,
  Popover,
  PopoverTrigger,
  PortalTemplateDirective,
  SingleSelectionModel
} from '@fibo-ui/cdk';
import {LucideAngularModule} from 'lucide-angular';

export interface SelectItem {
  label: string;
  value: string | number | null;
}

@Component({
  selector: 'fibo-select',
  imports: [
    PortalTemplateDirective,
    Popover,
    DataList,
    SingleSelectionModel,
    LucideAngularModule,
    FormFieldTrigger,
    ListItem
  ],
  templateUrl: './select.html',
  styleUrl: './select.css',
})
export class Select implements FormValueControl<string|number|null> {
  value = model<string|number|null>(null)
  required = input(false)
  disabled = input(false)
  touched = input(false)
  invalid = input(false)
  dirty = input(false)
  errors = input<readonly WithOptionalField<ValidationError>[]>([])

  items = input<SelectItem[]>([])
  label = input<string>('')
  placeholder = input<string>('Select')

  selectedLabel = computed(() => {
    const currentValue = this.value();
    if (currentValue === null) return null;
    const item = this.items().find(item => item.value === currentValue);
    return item?.label || null;
  })
}
