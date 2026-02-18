import { Component, computed, input, model } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import {
  DataList, DataListItem,
  Popover,
  PopoverTrigger, PopoverTriggerToggle,
  PortalContent,
  SelectMulti
} from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';
import { FormFieldControl } from '../form/form-field-control';
import { Checkbox } from '../checkbox/checkbox';
import { SelectItem } from './select';

@Component({
  selector: 'fibo-multi-select',
  imports: [
    PortalContent,
    Popover,
    DataList,
    SelectMulti,
    LucideAngularModule,
    DataListItem,
    FormFieldControl,
    PopoverTriggerToggle,
    Checkbox
  ],
  hostDirectives: [PopoverTrigger],
  host: {
    'class': 'block',
  },
  template: `
    <fibo-form-field-control
      fiboPopoverTriggerToggle
      [label]="label()"
      [required]="required()"
      [disabled]="disabled()"
      [invalid]="invalid()"
      [touched]="touched()"
      [errors]="errors()"
      [(value)]="value"
    >
      <div class="w-full flex flex-wrap gap-x-1 gap-y-1  -mx-1">
        @for (item of selectedItems(); track item.value) {
          <div class="flex items-center gap-1 btn btn-sm h-6 px-1.5 min-w-0 ">
            <span class="truncate flex-1 text-xs font-medium">{{ item.label }}</span>
            <button type="button"
                    class="rounded-full cursor-pointer flex-shrink-0 btn-text p-0.5 hover:bg-black/5 dark:hover:bg-white/5"
                    (click)="removeItem(item.value); $event.stopPropagation()"
                    (keydown)="$event.stopPropagation()">
              <lucide-icon name="x" size="12"></lucide-icon>
            </button>
          </div>
        }
        @if (selectedItems().length === 0) {
          <div class="from-field-placeholder text-sm ml-1">{{ placeholder() }}</div>
        }
      </div>

      <div *fiboPortalContent="let trigger"
           fiboPopover [trigger]="trigger" [matchWidth]="true"
           fiboDataList
           fiboSelectMulti [(value)]="value"
           class="popover-container">
          @for (item of items(); track item.value) {
            <a fiboDataListItem [value]="item.value" #option="DataListItem"
               class="datalist-item items-center">
              <fibo-checkbox [readonly]="true" [checked]="option.isSelected()">
                {{ item.label }}
              </fibo-checkbox>
            </a>
          }
      </div>
    </fibo-form-field-control>

    @if (invalid() && touched() && errors().length > 0) {
      <div class="form-field-error">
        {{ errors()[0].message }}
      </div>
    }
  `
})
export class MultiSelect implements FormValueControl<(string | number)[] | null> {

  value = model<(string | number)[] | null>(null)
  required = input(false)
  disabled = input(false)
  touched = input(false)
  invalid = input(false)
  dirty = input(false)
  errors = input<readonly WithOptionalField<ValidationError>[]>([])

  items = input<SelectItem[]>([])
  label = input<string>('')
  placeholder = input<string>('Select')

  selectedItems = computed(() => {
    const currentValue = this.value();
    if (!currentValue || !Array.isArray(currentValue)) return [];
    return this.items().filter(item => item.value !== null && currentValue.includes(item.value));
  })

  removeItem(val: string | number | null) {
    if (val === null) return;
    const currentValue = this.value();
    if (!currentValue) return;
    this.value.set(currentValue.filter(v => v !== val));
  }
}
