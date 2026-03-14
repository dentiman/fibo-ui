import {
  ChangeDetectionStrategy,
  Component,
  computed,
  linkedSignal,
  model,
  signal,
} from '@angular/core';
import { FormFieldControl } from '@fibo-ui/components';
import {
  DataList,
  DataListKeyboardBridge,
  DataListItem,
  KeyboardTarget,
  Popover,
  PopoverTrigger,
  SelectOne,
} from '@fibo-ui/cdk';

interface ComboboxOption {
  label: string;
  value: string;
}

@Component({
  selector: 'combobox-basic-template-example',
  imports: [FormFieldControl, PopoverTrigger, Popover, DataList, DataListKeyboardBridge, DataListItem, KeyboardTarget, SelectOne],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-form-field-control
        fiboKeyboardTarget
        fiboPopoverTrigger
        #trigger="PopoverTrigger"
        #keyboardTarget="KeyboardTarget"
        [delegatesFocus]="true"
        [content]="comboboxTpl"
        label="Assignee"
        iconEnd="chevron-down"
        [clearValue]="null"
        [(value)]="value"
      >
        <input
          type="text"
          role="combobox"
          aria-autocomplete="list"
          [attr.aria-controls]="listboxId()"
          [attr.aria-expanded]="trigger.isOpen()"
          [value]="inputValue()"
          placeholder="Search assignee"
          autocomplete="off"
          class="text-field-input"
          (focus)="onFocus(trigger)"
          (input)="onInput($event, trigger)"
          (keydown)="onInputKeydown($event, trigger)"
          (blur)="onBlur()"
        />
      </fibo-form-field-control>

      <ng-template #comboboxTpl let-trigger>
        @if (visibleItems().length > 0) {
          <div
            fiboPopover
            [matchWidth]="true"
            #popover="Popover"
            [id]="listboxId()"
            role="listbox"
            fiboDataList
            [fiboDataListKeyboardBridge]="keyboardTarget"
            fiboSelectOne
            [(value)]="value"
            (itemTriggered)="popover.close()"
            class="popover-container"
          >
            @for (item of visibleItems(); track item.value) {
              <button
                type="button"
                fiboDataListItem
                [value]="item.value"
                role="option"
                class="datalist-item w-full text-left"
              >
                {{ item.label }}
              </button>
            }
          </div>
        }
      </ng-template>
    </div>
  `,
})
export class ComboboxBasicTemplateExample {
  readonly value = model<string | null>(null);
  readonly options = signal<ComboboxOption[]>([
    { label: 'Ada Lovelace', value: 'ada' },
    { label: 'Alan Turing', value: 'alan' },
    { label: 'Barbara Liskov', value: 'barbara' },
    { label: 'Grace Hopper', value: 'grace' },
    { label: 'Linus Torvalds', value: 'linus' },
    { label: 'Margaret Hamilton', value: 'margaret' },
  ]);

  readonly listboxId = signal('combobox-basic-template-listbox');

  readonly selectedItem = computed(() => {
    const value = this.value();
    if (value === null) return null;

    return this.options().find((item) => item.value === value) ?? null;
  });

  readonly inputValue = linkedSignal({
    source: this.selectedItem,
    computation: (selectedItem) => selectedItem?.label ?? '',
  });

  readonly visibleItems = computed(() => {
    const query = this.normalize(this.inputValue());
    const options = this.options();
    if (!query) return options;

    return options.filter((item) => this.normalize(item.label).includes(query));
  });

  onFocus(trigger: PopoverTrigger) {
    if (!this.normalize(this.inputValue()) || this.visibleItems().length === 0) return;
    trigger.open();
  }

  onInput(event: Event, trigger: PopoverTrigger) {
    const target = event.target as HTMLInputElement;
    this.inputValue.set(target.value);

    if (!this.normalize(target.value) || this.visibleItems().length === 0) {
      trigger.close();
      return;
    }

    trigger.open();
  }

  onInputKeydown(event: KeyboardEvent, trigger: PopoverTrigger) {
    if (event.key === 'ArrowDown' && !trigger.isOpen() && this.visibleItems().length > 0) {
      trigger.open();
      event.preventDefault();
      return;
    }

    if (event.key === 'Escape' && !trigger.isOpen()) {
      this.resetInputValue();
    }
  }

  onBlur() {
    this.resetInputValue();
  }

  private resetInputValue() {
    this.inputValue.set(this.selectedItem()?.label ?? '');
  }

  private normalize(value: string): string {
    return value.trim().toLocaleLowerCase();
  }
}
