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
      [(open)]="showSuggestions"
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

        (blur)="onBlur($event)"
      />
    </fibo-form-field-control>

    @if (errorMessage(); as error) {
      <div class="form-field-error">{{ error }}</div>
    }

    <ng-template #comboboxTpl>
        <div
          fiboPopover
          [keyboardSource]="keyboardSource"
          [matchWidth]="true"
          [id]="listboxId()"
          role="listbox"
          fiboDataList
          fiboSelectOne
          [(value)]="value"
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

  onKeydown(event: KeyboardEvent) {
    if (this.disabled()) return;

    if (event.key === 'ArrowDown' && !this.showSuggestions() && this.visibleItems().length) {
      this.showSuggestions.set(true);
      event.preventDefault();
    } else if (event.key === 'Escape' && this.showSuggestions()) {
      this.showSuggestions.set(false);
    }
  }

  onBlur(event: FocusEvent) {
    this.touched.set(true);
    // Don't reset input while user is clicking a popover item —
    // the linkedSignal will handle it when value changes.
    const related = event.relatedTarget as Element | null;
    if (!related?.closest('[role="listbox"]')) {
      this.inputValue.set(this.value() !== null ? String(this.value()) : '');
    }
  }
}
