import { Component, computed, input, linkedSignal, model, signal } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import {
  DataList,
  DataListItem,
  KeyboardSource,
  Popover,
  PopoverTrigger,
  SelectOne,
} from '@fibo-ui/cdk';
import { formErrorMessage } from '../form/form-error';
import { FormFieldControl } from '../form/form-field-control';

export interface ComboboxItem {
  label: string;
  value: string | number | null;
}

@Component({
  selector: 'fibo-combobox',
  imports: [FormFieldControl, PopoverTrigger, Popover, DataList, DataListItem, KeyboardSource, SelectOne],
  host: {
    class: 'block',
  },
  template: `
    <fibo-form-field-control
      fiboKeyboardSource
      fiboPopoverTrigger
      #trigger="PopoverTrigger"
      #keyboardSource="KeyboardSource"
      [id]="id()"
      [delegatesFocus]="true"
      [content]="comboboxTpl"
      [label]="label()"
      [iconStart]="iconStart()"
      [iconEnd]="'chevron-down'"
      [required]="required()"
      [disabled]="disabled()"
      [invalid]="invalid()"
      [touched]="touched()"
      [errors]="errors()"
      [clearValue]="clearValue()"
      [(value)]="value"
    >
      <input
        [id]="id()"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-controls]="listboxId()"
        [attr.aria-expanded]="trigger.isOpen()"
        [attr.aria-activedescendant]="null"
        [value]="inputValue()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.data-error]="(invalid() && touched()) || null"
        autocomplete="off"
        class="text-field-input"
        (focus)="onFocus(trigger)"
        (input)="onInput($event, trigger)"
        (keydown)="onInputKeydown($event, trigger)"
        (blur)="onBlur()"
      />
    </fibo-form-field-control>

    @if (errorMessage(); as error) {
      <div class="form-field-error">{{ error }}</div>
    }

    <ng-template #comboboxTpl>
      @if (shouldRenderPopup()) {
        <div
          fiboPopover
          #popover="Popover"
          [keyboardSource]="keyboardSource"
          [matchWidth]="true"
          [id]="listboxId()"
          role="listbox"
          fiboDataList
          fiboSelectOne
          [(value)]="value"
          (itemTriggered)="popover.close()"
          class="popover-container"
        >
          @for (item of visibleItems(); track item.value; let index = $index) {
            <button
              type="button"
              fiboDataListItem
              [id]="optionId(index)"
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
  `,
})
export class Combobox implements FormValueControl<string | number | null> {
  static nextId = 0;

  readonly id = signal(`fibo-combobox-${Combobox.nextId++}`);
  readonly listboxId = computed(() => `${this.id()}-listbox`);

  readonly value = model<string | number | null>(null);

  readonly required = input(false);
  readonly disabled = input(false);
  readonly touched = model(false);
  readonly invalid = input(false);
  readonly dirty = input(false);
  readonly errors = input<readonly WithOptionalField<ValidationError>[]>([]);

  readonly items = input<ComboboxItem[]>([]);
  readonly label = input('');
  readonly placeholder = input('Search and select');
  readonly iconStart = input('');
  readonly clearValue = input<string | number | null | undefined>(null);
  readonly errorMessage = formErrorMessage(this.errors, this.invalid, this.touched);

  readonly selectedItem = computed(() => {
    const currentValue = this.value();
    if (currentValue === null) return null;

    return this.items().find((item) => item.value === currentValue) ?? null;
  });

  readonly inputValue = linkedSignal({
    source: this.selectedItem,
    computation: (selectedItem) => selectedItem?.label ?? '',
  });

  readonly normalizedQuery = computed(() => this.normalize(this.inputValue()));

  readonly visibleItems = computed(() => {
    const query = this.normalizedQuery();
    const items = this.items();
    if (!query) return items;

    return items.filter((item) => this.normalize(item.label).includes(query));
  });

  readonly shouldRenderPopup = computed(() => this.visibleItems().length > 0);

  optionId(index: number): string {
    return `${this.id()}-option-${index}`;
  }

  onFocus(trigger: PopoverTrigger) {
    if (this.disabled()) return;
    if (!this.normalizedQuery()) return;
    if (this.visibleItems().length === 0) return;

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
    if (this.disabled()) return;

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
    this.touched.set(true);
    this.resetInputValue();
  }

  private resetInputValue() {
    this.inputValue.set(this.selectedItem()?.label ?? '');
  }

  private normalize(value: string): string {
    return value.trim().toLocaleLowerCase();
  }
}
