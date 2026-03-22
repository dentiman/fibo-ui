import { Component, ElementRef, TemplateRef, computed, inject, input, model, signal, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  closeOnFocusLeave,
  closeOnOutsideClick,
  createOverlay,
  DataList,
  DataListItem,
  KeyboardSource,
  Popover,
  SelectOne,
  provideFormValueControl,
  restoreTriggerFocusOnClose,
} from '@fibo-ui/cdk';
import { FieldShell } from '../form/field-shell';
import { FORM_UI_STATE_INPUTS, FormUiState } from '../form/form-ui-state';

let nextSelectId = 0;

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
    Popover,
    DataList,
    KeyboardSource,
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
      [id]="triggerId"
      [label]="label()"
      [iconStart]="iconStart()"
      iconEnd="chevron-down"
      [clearable]="canClear()"
      [hasValue]="value() !== clearValue()"
      (clearRequested)="clear()"
      (focusRequested)="openFromShell()"
    >
      <button
        fiboKeyboardSource
        #keyboardSource="KeyboardSource"
        #triggerButton
        type="button"
        class="w-full text-left"
        role="combobox"
        [id]="triggerId"
        [disabled]="uiState.disabled()"
        aria-haspopup="listbox"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="isOpen() ? listboxId : null"
        [attr.aria-invalid]="uiState.invalid() || null"
        (click)="toggle()"
        (blur)="uiState.touched.set(true)"
      >
        <div class="text-sm" [class.from-field-placeholder]="!selectedLabel()">
          {{ selectedLabel() || placeholder() }}
        </div>
      </button>
    </fibo-field-shell>

    @if (uiState.errorMessage(); as error) {
      <div class="form-field-error">{{ error }}</div>
    }

    <ng-template #selectTpl>
      <div
        fiboPopover
        role="listbox"
        [attr.id]="listboxId"
        [keyboardSource]="keyboardSource"
        [matchWidth]="true"
        fiboDataList
        (itemTriggered)="close()"
        fiboSelectOne
        [(value)]="value"
        class="popover-container"
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
  private readonly selectTemplate = viewChild.required<TemplateRef<unknown>>('selectTpl');
  readonly fieldShell = viewChild.required(FieldShell);
  private readonly triggerButton = viewChild.required<ElementRef<HTMLButtonElement>>('triggerButton');

  readonly value = model<string | number | null>(null);

  readonly items = input<SelectItem[]>([]);
  readonly label = input('');
  readonly placeholder = input('Select');
  readonly iconStart = input('');
  readonly clearValue = input<string | number | null | undefined>(undefined);

  readonly triggerId = `fibo-select-${nextSelectId++}`;
  readonly listboxId = `fibo-select-listbox-${nextSelectId++}`;
  readonly isOpen = signal(false);

  readonly selectedItem = computed(() => {
    const currentValue = this.value();
    return this.items().find(item => item.value === currentValue) ?? null;
  });

  readonly selectedLabel = computed(() => this.selectedItem()?.label ?? null);
  readonly canClear = computed(() => this.clearValue() !== undefined && this.value() !== this.clearValue());

  readonly overlayConfig = computed(() => ({
    templateRef: this.selectTemplate(),
    referenceElement: this.fieldShell().elementRef.nativeElement,
    interactionRoot: this.fieldShell().elementRef.nativeElement,
    focusReturnTarget: this.triggerButton().nativeElement,
    category: 'popover' as const,
  }));
  readonly overlayHandle = createOverlay(this.isOpen, this.overlayConfig, overlay => {
    closeOnFocusLeave(overlay);
    closeOnOutsideClick(overlay);
    restoreTriggerFocusOnClose(overlay);
  });

  focus(options?: FocusOptions) {
    this.triggerButton().nativeElement.focus(options);
  }

  open() {
    if (!this.uiState.disabled()) {
      this.isOpen.set(true);
    }
  }

  toggle() {
    if (!this.uiState.disabled()) {
      this.isOpen.update(isOpen => !isOpen);
    }
  }

  close() {
    this.isOpen.set(false);
  }

  openFromShell() {
    this.focus();
    this.open();
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
