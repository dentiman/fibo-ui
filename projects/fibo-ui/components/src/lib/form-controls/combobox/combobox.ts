import {
  Component,
  ElementRef,
  TemplateRef,
  computed,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  DataList,
  DataListItem,
  SelectOne,
  createOverlay,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { type ComboboxControl, provideComboboxControl } from './combobox-control-token';
import { ComboboxInput } from './combobox-input';
import { ComboboxList } from './combobox-list';
import { FieldShell } from '../form/field-shell';
import { FieldShellHost } from '../form/field-shell-host';
import { FieldInput } from '../form/field-input';
import { FIELD_UI_STATE_INPUTS, FieldUiState } from '../form/field-ui-state';
import { Size } from '../../primitives/size';

@Component({
  selector: 'fibo-combobox',
  hostDirectives: [
    {
      directive: FieldUiState,
      inputs: [...FIELD_UI_STATE_INPUTS],
    },
    { directive: Size, inputs: ['fiboSize'] },
  ],
  imports: [
    FieldShell,
    FieldInput,
    DataList,
    DataListItem,
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
  ],
  template: `
    <fibo-field-shell
      #fieldShell
      [label]="label()"
      [hint]="hint()"
      [iconStart]="iconStart()"
      iconEnd="chevron-down"
      [canClear]="clearValue() !== undefined && value() !== clearValue()"
      (clearRequested)="clear()"
    >
      <input
        fiboFieldInput
        class="fibo-field-input"
        #inputElement
        [placeholder]="placeholder()"
        (blur)="uiState.touched.set(true)"
        fiboComboboxInput
      />
    </fibo-field-shell>

    <ng-template #comboboxTpl>
      <div
        fiboComboboxList
        [keyboardSourceElement]="inputElement"
        fiboDataList
        [useActiveDescendant]="true"
        [autoActivateFirst]="true"
        (itemTriggered)="expanded.set(false)"
        fiboSelectOne
        [(value)]="value"
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
  implements
    ComboboxControl<string | number | null, string | number>,
    FormValueControl<string | number | null>
{
  readonly uiState = inject(FieldUiState);
  private readonly fieldShellHost = viewChild.required(FieldShellHost);
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');
  private readonly comboboxTemplateRef = viewChild.required<TemplateRef<any>>('comboboxTpl');

  readonly value = model<string | number | null>(null);
  readonly label = input('');
  readonly hint = input('');
  readonly placeholder = input('Search and select');
  readonly iconStart = input('');
  readonly clearValue = input<string | number | null | undefined>(null);

  readonly items = input<(string | number)[]>([]);
  readonly expanded = model(false);
  readonly query = model('');

  readonly options = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    return query
      ? this.items().filter(item => String(item).toLocaleLowerCase().includes(query))
      : [];
  });

  readonly overlay = createOverlay(() => ({
    state: this.expanded,
    content: this.comboboxTemplateRef(),
    position: {
      connectedTo: this.fieldShellHost().referenceElement(),
      matchWidth: true,
    },
    focus: {
      restoreTo: () => this.fieldShellHost().focusReturnTarget(),
    },
    lifecycle: {
      beforeClose: [
        (_, __, reason) => {
          if (reason !== 'state') this.resetQueryToValue();
        },
      ],
    },
  }));

  private resetQueryToValue() {
    const value = this.value();
    const valueText = value !== null ? String(value) : '';

    if (this.query() !== valueText) {
      this.query.set(valueText);
    }
  }

  focus(options?: FocusOptions) {
    this.inputElement().nativeElement.focus(options);
  }

  clear() {
    const clearValue = this.clearValue();

    if (this.uiState.disabled() || clearValue === undefined) {
      return;
    }

    this.value.set(clearValue);
    this.uiState.touched.set(true);
  }
}
