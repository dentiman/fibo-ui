import { Component, computed, inject, input, model } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import {
  DataList, DataListItem,
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
    DataListItem,
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
      [label]="label()" iconEnd="chevron-down"
      [(value)]="value" [clearValue]="clearValue()"
      [required]="required()" [disabled]="disabled()"
      [invalid]="invalid()" [touched]="touched()"
      [errors]="errors()">

      <div class="text-sm" [class.from-field-placeholder]="!selectedValue()">
        {{ selectedValue() || placeholder() }}
      </div>

      <ng-template fiboPortalContent [(isOpen)]="trigger.isOpen">
        <div fiboPopover [trigger]="trigger" [matchWidth]="true"
             fiboDataList (itemTriggered)="trigger.close()"
             fiboSelectOne [(value)]="value"
             class="popover-container">
          @for (item of items(); track item.value) {
            <a fiboDataListItem [value]="item.value" class="datalist-item">
              {{ item.label }}
            </a>
          }
        </div>
      </ng-template>
    </fibo-form-field-control>
`
})
export class Select implements FormValueControl<string | number | null> {
  trigger = inject(PopoverTrigger);

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

  selectedValue = computed(() => {
    const currentValue = this.value();
    if (currentValue === null) return null;
    const item = this.items().find(item => item.value === currentValue);
    return item?.label || null;
  })
}
