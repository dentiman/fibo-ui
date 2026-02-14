import { Component, computed, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import {
  DataList, Option,
  Popover,
  PopoverTrigger, PopoverTriggerToggle,
  PortalContent,
  SelectOne
} from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';
import { FormFieldControl } from '../form/form-field-control';

export interface SelectItem {
  label: string;
  value: string | number | null;
}

@Component({
  selector: 'fibo-select',
  imports: [
    PortalContent,
    Popover,
    DataList,
    SelectOne,
    LucideAngularModule,
    Option,
    FormFieldControl,
    PopoverTriggerToggle
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
      [clearValue]="clearValue()"
      [(value)]="value"
      iconEnd="chevron-down"
    >
      <div class="text-sm" [class.from-field-placeholder]="!selectedLabel()">
        {{ selectedLabel() || placeholder() }}
      </div>

      <div *fiboPortalContent="let trigger"
           fiboPopover [trigger]="trigger" [matchWidth]="true"
           fiboDataList (optionTriggered)="trigger.close()"
           fiboSelectOne [(value)]="value"
           class="popover-container">
          @for (item of items(); track item.value) {
            <a fiboOption [value]="item.value"
               class="datalist-item">
              {{ item.label }}
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
export class Select implements FormValueControl<string | number | null> {

  value = model<string | number | null>(null)
  required = input(false)
  disabled = input(false)
  touched = input(false)
  invalid = input(false)
  dirty = input(false)
  errors = input<readonly WithOptionalField<ValidationError>[]>([])

  items = input<SelectItem[]>([])
  label = input<string>('')
  placeholder = input<string>('Select')
  clearValue = input<string | number | null | undefined>(undefined)

  selectedLabel = computed(() => {
    const currentValue = this.value();
    if (currentValue === null) return null;
    const item = this.items().find(item => item.value === currentValue);
    return item?.label || null;
  })
}
