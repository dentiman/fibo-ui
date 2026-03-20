import {
  Component,
  ElementRef,
  TemplateRef,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import {
  DataList,
  DataListItem,
  KeyboardSource,
  Popover,
  SelectOne,
  closeOnFocusLeave,
  closeOnOutsideClick,
  createOverlay,
} from '@fibo-ui/cdk';
import { formErrorMessage } from '../form/form-error';
import { FormFieldControl } from '../form/form-field-control';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'fibo-combobox',
  imports: [FormFieldControl, Popover, DataList, DataListItem, KeyboardSource, SelectOne, FormsModule],
  host: {
    class: 'block',
  },
  template: `
    <fibo-form-field-control
      [id]="id()"
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
        fiboKeyboardSource
        #keyboardSource="KeyboardSource"
        [(ngModel)]="inputValue"
        [id]="id()"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-controls]="listboxId()"
        [attr.aria-expanded]="showSuggestions()"
        [attr.aria-activedescendant]="null"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.data-error]="(invalid() && touched()) || null"
        autocomplete="off"
        class="text-field-input"
        (blur)="onBlur()"
      />
    </fibo-form-field-control>

    @if (errorMessage(); as error) {
      <div class="form-field-error">{{ error }}</div>
    }

    <ng-template #comboboxTpl>
      <div
        fiboPopover
        [keyboardSource]="keyboardSource"
        [referenceElement]="hostElement"
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

  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly comboboxTemplateRef = viewChild.required<TemplateRef<any>>('comboboxTpl');

  id = signal(`fibo-combobox-${Combobox.nextId++}`);
  listboxId = computed(() => `${this.id()}-listbox`);

  value = model<string | number | null>(null);

  showSuggestions = linkedSignal({
    source: () => ({
      value: this.value(),
      visibleItems: this.visibleItems(),
      inputValue: this.inputValue(),
    }),
    computation: ({ value, visibleItems, inputValue }) => {
      const selectedText = value !== null ? String(value) : '';
      return inputValue !== selectedText && inputValue.trim().length > 0 && visibleItems.length > 0;
    },
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
    computation: value => (value !== null ? String(value) : ''),
  });

  visibleItems = computed(() => {
    const query = this.inputValue().trim().toLocaleLowerCase();
    return query
      ? this.items().filter(item => String(item).toLocaleLowerCase().includes(query))
      : this.items();
  });

  overlayConfig = computed(() => ({
    templateRef: this.comboboxTemplateRef(),
    referenceElement: this.hostElement,
    category: 'popover' as const,
  }));

  overlayHandle = createOverlay(this.showSuggestions, this.overlayConfig, overlay => {
    closeOnFocusLeave(overlay);
    closeOnOutsideClick(overlay);
    overlay.afterClose(() => this.resetInputValue());
  });

  onBlur() {
    this.touched.set(true);
  }

  private resetInputValue() {
    const value = this.value();
    this.inputValue.set(value !== null ? String(value) : '');
  }
}
