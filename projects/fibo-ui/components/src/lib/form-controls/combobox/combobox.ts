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
  ACTIVE_DESCENDANT_DATA_LIST_NAVIGATION_STRATEGY,
  DataList,
  DataListItem,
  SelectOne,
  createOverlay,
  connectedPosition,
  provideDataListNavigationStrategy,
  restoreTriggerFocusOnClose,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { connectedBehavior } from '../../overlay/overlay-presets';
import { type ComboboxControl, provideComboboxControl } from './combobox-control-token';
import { ComboboxInput } from './combobox-input';
import { ComboboxList } from './combobox-list';
import { FieldShell } from '../form/field-shell';
import { FieldTargetDirective } from '../form/field-target';
import { FORM_UI_STATE_INPUTS, FormUiState } from '../form/form-ui-state';

@Component({
  selector: 'fibo-combobox',
  hostDirectives: [
    {
      directive: FormUiState,
      inputs: [...FORM_UI_STATE_INPUTS],
    },
  ],
  imports: [
    FieldShell,
    FieldTargetDirective,
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
  viewProviders: [
    // Keep focus in the input and drive the list through aria-activedescendant.
    // viewProviders scopes the override to the internal fiboDataList instances
    // rendered by this component template.
    provideDataListNavigationStrategy(ACTIVE_DESCENDANT_DATA_LIST_NAVIGATION_STRATEGY),
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
        fiboFieldTarget
        #inputElement
        [placeholder]="placeholder()"
        (blur)="uiState.touched.set(true)"
        class="text-field-input"
        fiboComboboxInput
      />
    </fibo-field-shell>

    <ng-template #comboboxTpl>
      <div
        fiboComboboxList
        [keyboardSourceElement]="inputElement"
        fiboDataList
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
  readonly uiState = inject(FormUiState);
  readonly fieldShell = viewChild.required(FieldShell);
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

  readonly overlay = createOverlay(
    this.expanded,
    connectedBehavior(),
    connectedPosition(() => ({ referenceElement: this.fieldShell().overlayReferenceElement(), matchWidth: true })),
    this.comboboxTemplateRef,
    overlay => {
      restoreTriggerFocusOnClose(overlay, () => this.fieldShell().overlayFocusReturnTarget());
      overlay.beforeClose((_, __, reason) => {
        if (reason !== 'state') this.resetQueryToValue();
      });
    },
  );

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
