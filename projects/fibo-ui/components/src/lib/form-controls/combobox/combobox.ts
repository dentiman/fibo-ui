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
  OverlayStack,
  Popover,
  SelectOne,
  closeOnFocusLeave,
  closeOnOutsideClick,
  createOverlay,
  restoreTriggerFocusOnClose,
} from '@fibo-ui/cdk';
import { formErrorMessage } from '../form/form-error';
import { FormFieldControl } from '../form/form-field-control';

@Component({
  selector: 'fibo-combobox',
  imports: [FormFieldControl, Popover, DataList, DataListItem, KeyboardSource, SelectOne],
  host: {
    class: 'block',
  },
  template: `
    <fibo-form-field-control
      fiboKeyboardSource
      #keyboardSource="KeyboardSource"
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
        (keydown)="onInputKeydown($event)"
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
        [referenceElement]="hostElement"
        [matchWidth]="true"
        [id]="listboxId()"
        role="listbox"
        fiboDataList
        fiboSelectOne
        [(value)]="value"
        (itemTriggered)="closeSuggestions()"
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

  private readonly overlayStack = inject(OverlayStack);
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly comboboxTemplateRef = viewChild.required<TemplateRef<any>>('comboboxTpl');

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
    restoreTriggerFocusOnClose(overlay);
  });

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputValue.set(value);
    this.showSuggestions.set(!!value.trim() && this.visibleItems().length > 0);
  }

  onInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeSuggestions();
      this.resetInputValue();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onBlur(event: FocusEvent) {
    this.touched.set(true);

    const nextTarget = event.relatedTarget;
    const overlayId = this.overlayHandle()?.id;

    if (
      (nextTarget instanceof Node && this.hostElement.contains(nextTarget)) ||
      this.overlayStack.isOverlayInBranch(
        overlayId,
        this.overlayStack.findOverlayContainerId(nextTarget),
      )
    ) {
      return;
    }

    this.resetInputValue();
  }

  closeSuggestions() {
    this.showSuggestions.set(false);
  }

  private resetInputValue() {
    const value = this.value();
    this.inputValue.set(value !== null ? String(value) : '');
  }
}
