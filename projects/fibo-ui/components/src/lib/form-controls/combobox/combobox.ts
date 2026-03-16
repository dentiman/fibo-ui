import { Component, computed, input, linkedSignal, model, signal } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import {
  DataList,
  DataListItem,
  isFocusInsideHostOrOverlay,
  KeyboardSource,
  Popover,
  PopoverTrigger,
  SelectOne,
} from '@fibo-ui/cdk';
import { formErrorMessage } from '../form/form-error';
import { FormFieldControl } from '../form/form-field-control';

@Component({
  selector: 'fibo-combobox',
  imports: [FormFieldControl, PopoverTrigger, Popover, DataList, DataListItem, KeyboardSource, SelectOne],
  host: {
    class: 'block',
  },
  template: `
    <fibo-form-field-control
      fiboCombobox
      fiboKeyboardSource
      fiboPopoverTrigger
      [(open)]="showSuggestions"
      #trigger="PopoverTrigger"
      #keyboardSource="KeyboardSource"
      [id]="id()"
      [delegatesFocus]="true"
      [content]="comboboxTpl"
      [label]="label()"
      [iconStart]="iconStart()"
      iconEnd="chevron-down"
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
        [attr.aria-expanded]="showSuggestions()"
        [attr.aria-activedescendant]="null"
        [value]="inputValue()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.data-error]="(invalid() && touched()) || null"
        autocomplete="off"
        class="text-field-input"
        (input)="onInput($event)"
        (keydown)="onInputKeydown($event, trigger)"
        (blur)="onBlur($event, trigger)"

      />
    </fibo-form-field-control>

    @if (errorMessage(); as error) {
      <div class="form-field-error">{{ error }}</div>
    }

    <ng-template #comboboxTpl>
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
          @for (item of visibleItems(); track item) {
            <button
              type="button"
              fiboDataListItem
              [value]="item"
              role="option"
              class="datalist-item w-full text-left"
            >
              {{ item }}
            </button>
          }
        </div>
    </ng-template>
  `,
})
export class Combobox implements FormValueControl<string | number | null> {
  static nextId = 0;

  id = signal(`fibo-combobox-${Combobox.nextId++}`);
  listboxId = computed(() => `${this.id()}-listbox`);

  value = model<string | number | null>(null);

  showSuggestions = linkedSignal({
    source: this.value,
    computation: () => false,
  });

  required = input(false);
  disabled = input(false);
  touched = model(false);
  invalid = input(false);
  dirty = input(false);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);

  items = input<(string | number)[]>([]);
  label = input('');
  placeholder = input('Search and select');
  iconStart = input('');
  clearValue = input<string | number | null | undefined>(null);
  errorMessage = formErrorMessage(this.errors, this.invalid, this.touched);

  inputValue = linkedSignal({
    source: this.value,
    computation: (value) => (value !== null ? String(value) : ''),
  });

  visibleItems = computed(() => {
    const query = this.inputValue().trim().toLocaleLowerCase();
    return query
      ? this.items().filter((item) => String(item).toLocaleLowerCase().includes(query))
      : this.items();
  });

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputValue.set(value);
    this.showSuggestions.set(!!value.trim() && this.visibleItems().length > 0);
  }

  onInputKeydown(event: KeyboardEvent, trigger: PopoverTrigger) {
    if (event.key === 'Escape') {
      trigger.close();
      this.resetInputValue();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onBlur(event: FocusEvent, trigger: PopoverTrigger) {
    this.touched.set(true);
    if (isFocusInsideHostOrOverlay(event.relatedTarget, trigger.element, trigger.overlayRef()?.id)) {
      return;
    }

    this.resetInputValue();
  }

  private resetInputValue() {
    const value = this.value();
    this.inputValue.set(value !== null ? String(value) : '');
  }
}
