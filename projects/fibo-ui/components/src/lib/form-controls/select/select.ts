import { Component, ElementRef, computed, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  DataList,
  DataListItem,
  SelectOne,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { FieldShell } from '../form/field-shell';
import { FieldInteractiveDirective } from '../form/field-interactive';
import { FieldOverlayDirective } from '../form/field-overlay';
import { FORM_UI_STATE_INPUTS, FormUiState } from '../form/form-ui-state';

export interface SelectItem {
  label: string;
  value: string | number | null;
  disabled?: boolean;
}

@Component({
  selector: 'fibo-select',
  hostDirectives: [
    {
      directive: FormUiState,
      inputs: [...FORM_UI_STATE_INPUTS],
    },
  ],
  imports: [
    FieldShell,
    FieldInteractiveDirective,
    FieldOverlayDirective,
    DataList,
    SelectOne,
    DataListItem,
  ],
  host: {
    class: 'block',
  },
  providers: [provideFormValueControl(() => Select)],
  template: `
    <fibo-field-shell
      #fieldShell
      [label]="label()"
      [hint]="hint()"
      [iconStart]="iconStart()"
      iconEnd="chevron-down"
      [canClear]="canClear()"
      (clearRequested)="clear()"
    >
      <button
        fiboFieldInteractive
        fieldInteractiveMode="click"
        [fiboFieldOverlay]="selectTpl"
        [matchWidth]="true"
        #triggerButton
        #overlayRef="fiboFieldOverlay"
        type="button"
        class="w-full text-left"
        role="combobox"
        [disabled]="uiState.disabled()"
        aria-haspopup="listbox"
        [attr.aria-controls]="overlayRef.isOpen() ? fieldShell.idFor('listbox') : null"
        [attr.aria-invalid]="uiState.invalid() || null"
        [attr.aria-readonly]="uiState.readonly() || null"
        (blur)="uiState.touched.set(true)"
      >
        <div class="text-sm" [class.from-field-placeholder]="!selectedLabel()">
          {{ selectedLabel() || placeholder() }}
        </div>
      </button>
    </fibo-field-shell>

    <ng-template #selectTpl>
      <div
        role="listbox"
        [attr.id]="fieldShell.idFor('listbox')"
        [keyboardSourceElement]="triggerButton"
        fiboDataList
        (itemTriggered)="fieldOverlay().close()"
        fiboSelectOne
        [(value)]="value"
      >
        @for (item of items(); track item.value) {
          <button
            type="button"
            fiboDataListItem
            role="option"
            [value]="item.value"
            [attr.aria-selected]="value() === item.value"
            class="datalist-item w-full text-left"
          >
            {{ item.label }}
          </button>
        }
      </div>
    </ng-template>
  `,
})
export class Select implements FormValueControl<string | number | null> {
  readonly uiState = inject(FormUiState);
  readonly fieldShell = viewChild.required(FieldShell);
  readonly fieldOverlay = viewChild.required(FieldOverlayDirective);
  private readonly triggerButton = viewChild.required<ElementRef<HTMLButtonElement>>('triggerButton');

  readonly value = model<string | number | null>(null);

  readonly items = input<SelectItem[]>([]);
  readonly label = input('');
  readonly hint = input('');
  readonly placeholder = input('Select');
  readonly iconStart = input('');
  readonly clearValue = input<string | number | null | undefined>(undefined);

  readonly selectedItem = computed(() => {
    const currentValue = this.value();
    return this.items().find(item => item.value === currentValue) ?? null;
  });

  readonly selectedLabel = computed(() => this.selectedItem()?.label ?? null);
  readonly canClear = computed(() => this.clearValue() !== undefined && this.value() !== this.clearValue());

  focus(options?: FocusOptions) {
    this.triggerButton().nativeElement.focus(options);
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
