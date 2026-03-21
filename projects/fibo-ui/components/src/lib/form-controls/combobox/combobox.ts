import {
  Component,
  ElementRef,
  TemplateRef,
  type WritableSignal,
  computed,
  inject,
  input,
  linkedSignal,
  model,
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
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { type ComboboxControl, provideComboboxControl } from './combobox-control-token';
import { ComboboxInternal } from './combobox-internal-token';
import { ComboboxInput } from './combobox-input';
import { ComboboxList } from './combobox-list';
import { formErrorMessage } from '../form/form-error';
import { FormFieldControl } from '../form/form-field-control';

@Component({
  selector: 'fibo-combobox',
  imports: [
    FormFieldControl,
    Popover,
    DataList,
    DataListItem,
    KeyboardSource,
    SelectOne,
    ComboboxInput,
    ComboboxList,
  ],
  host: {
    class: 'block',
  },
  providers: [
    provideFormValueControl(() => Combobox),
    provideComboboxControl(() => Combobox),
    ComboboxInternal,
  ],
  template: `
    <fibo-form-field-control
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
        [placeholder]="placeholder()"
        class="text-field-input"
        fiboComboboxInput
      />
    </fibo-form-field-control>

    @if (errorMessage(); as error) {
      <div class="form-field-error">{{ error }}</div>
    }

    <ng-template #comboboxTpl>
      <div
        fiboPopover
        fiboComboboxList
        [keyboardSource]="keyboardSource"
        [referenceElement]="hostElement"
        [matchWidth]="true"
        fiboDataList
        (itemTriggered)="expanded.set(false)"
        fiboSelectOne
        [(value)]="value"
        class="popover-container"
      >
        @for (item of options(); track item) {
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
export class Combobox
  implements ComboboxControl<string | number | null, string | number>
{
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly comboboxTemplateRef = viewChild.required<TemplateRef<any>>('comboboxTpl');

  value = model<string | number | null>(null);

  required = input(false);
  disabled = input(false);
  touched = model(false);
  invalid = input(false);
  dirty = input(false);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  label = input('');
  placeholder = input('Search and select');
  iconStart = input('');
  clearValue = input<string | number | null | undefined>(null);
  errorMessage = formErrorMessage(this.errors, this.invalid, this.touched);

  items = input<(string | number)[]>([]);


  expanded: WritableSignal<boolean> = linkedSignal({
    source: () => ({
      disabled: this.disabled(),
      optionsCount: this.options().length,
    }),
    computation: ({ disabled, optionsCount }, previous) =>
      (previous?.value ?? false) && !disabled && optionsCount > 0,
  });


  query = linkedSignal({
    source: this.value,
    computation: value => (value !== null ? String(value) : ''),
  });

  options = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    return query
      ? this.items().filter(item => String(item).toLocaleLowerCase().includes(query))
      : this.items();
  });

  overlayConfig = computed(() => ({
    templateRef: this.comboboxTemplateRef(),
    referenceElement: this.hostElement,
    category: 'popover' as const,
  }));

  overlayHandle = createOverlay(this.expanded, this.overlayConfig, overlay => {
    closeOnFocusLeave(overlay);
    closeOnOutsideClick(overlay);
  });

}
