import {Component, computed, inject, input, model} from '@angular/core';
import {FormValueControl, ValidationError, WithOptionalField} from '@angular/forms/signals';
import {
  DataList, Option,
  Popover,
  PopoverTrigger,
  PortalContent,
  SelectOne
} from '@fibo-ui/cdk';
import {LucideAngularModule} from 'lucide-angular';

export interface SelectItem {
  label: string;
  value: string | number | null;
}

@Component({
  selector: 'button[fiboSelect]',
  imports: [
    PortalContent,
    Popover,
    DataList,
    SelectOne,
    LucideAngularModule,
    Option
  ],
  hostDirectives: [PopoverTrigger],

  host: {
    'type': 'button',
    'class': 'w-full group fibo-form-field px-3 py-1 relative flex flex-col justify-center text-left',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-required]': 'required() || null',
    '[attr.data-error]': 'invalid() && touched() || null',
    '[disabled]': 'disabled()',
    '(keydown.enter)': 'trigger.open()',
    '(keydown.escape)': 'trigger.close()',
    '(click)': 'trigger.open()',
    '[style.pointer-events]': "disabled() ? 'none' : 'auto'",
  },
  template: `
    @if (label()) {
      <span class="block text-xs fibo-form-field-label">{{ label() }}</span>
    }
    <div class="text-sm" [class.from-field-placeholder]="!selectedLabel()">
      {{ selectedLabel() || placeholder() }}
    </div>
    <div class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 text-foreground-tertiary">
      <lucide-icon name="chevron-down" size="16"></lucide-icon>
    </div>

    <ng-template fiboPortalContent [(isOpen)]="trigger.isOpen">
      <div fiboPopover    [trigger]="trigger" [matchWidth]="true"
           fiboDataList   (optionTriggered)="trigger.close()"
           fiboSelectOne  [(value)]="value"
           class="fibo-popover py-1 px-1 rounded-md"
      >
        <div class="max-h-70 overflow-y-auto">
          @for (item of items(); track item.value) {
            <a fiboOption [value]="item.value"
               class="datalist-item py-1 px-2 rounded-md relative group text-sm">
              <span class="block truncate font-normal">{{ item.label }}</span>
            </a>
          }
        </div>
      </div>
    </ng-template>
  `
})
export class Select implements FormValueControl<string|number|null> {
  trigger = inject(PopoverTrigger)

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
