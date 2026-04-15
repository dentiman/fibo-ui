import { Component, ElementRef, computed, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  DataList,
  DataListItem,
  SelectMulti,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';
import { FieldAuxiliary } from '../form/field-auxiliary';
import { FieldShell } from '../form/field-shell';
import { FieldTarget } from '../form/field-target';
import { FieldOverlay } from '../form/field-overlay';
import { FieldContext, FIELD_CONTEXT_INPUTS } from '../form/field-context';
import { FIELD_UI_STATE_INPUTS, FieldUiState } from '../form/field-ui-state';
import { Checkbox } from '../checkbox/checkbox';
import { SelectItem } from './select';

@Component({
  selector: 'fibo-multi-select',
  hostDirectives: [
    {
      directive: FieldUiState,
      inputs: [...FIELD_UI_STATE_INPUTS],
    },
    {
      directive: FieldContext,
      inputs: [...FIELD_CONTEXT_INPUTS],
    },
  ],
  imports: [
    DataList,
    SelectMulti,
    LucideAngularModule,
    DataListItem,
    FieldShell,
    FieldTarget,
    FieldOverlay,
    FieldAuxiliary,
    Checkbox,
  ],
  host: {
    class: 'block',
  },
  providers: [provideFormValueControl(() => MultiSelect)],
  template: `
    <fibo-field-shell
      [label]="label()"
      [hint]="hint()"
      iconEnd="chevron-down"
    >
      <div
        fiboFieldTarget
        fieldTargetMode="click"
        [fiboFieldOverlay]="multiSelectTpl"
        [matchWidth]="true"
        #triggerSurface
        role="combobox"
        aria-haspopup="listbox"
        [attr.tabindex]="uiState.disabled() ? -1 : 0"
        [attr.aria-disabled]="uiState.disabled() || null"
        class="w-full flex flex-wrap gap-x-1 gap-y-1 -mx-1 outline-none"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown.enter)="openFromKeyboard($event)"
        (keydown.space)="openFromKeyboard($event)"
        (keydown.arrowdown)="openFromKeyboard($event)"
      >
        @for (item of selectedItems(); track item.value) {
          <div class="flex items-center gap-1 btn btn-sm h-6 px-1.5 min-w-0 ">
            <span class="truncate flex-1 text-xs font-medium">{{ item.label }}</span>
            <button
              type="button"
              fiboFieldAuxiliary
              class="rounded-full cursor-pointer flex-shrink-0 btn-text p-0.5 hover:bg-black/5 dark:hover:bg-white/5"
              (click)="removeItem(item.value); $event.stopPropagation()"
              (keydown)="$event.stopPropagation()"
            >
              <lucide-icon name="x" size="12"></lucide-icon>
            </button>
          </div>
        }
        @if (selectedItems().length === 0) {
          <div class="form-field-placeholder text-sm ml-1">{{ placeholder() }}</div>
        }
      </div>
    </fibo-field-shell>

    <ng-template #multiSelectTpl let-overlay>
      <div
        role="listbox"
        [attr.id]="overlay.id"
        aria-multiselectable="true"
        [keyboardSourceElement]="triggerSurface"
        fiboDataList
        fiboSelectMulti
        [(value)]="value"
      >
        @for (item of items(); track item.value) {
          <button
            type="button"
            fiboDataListItem
            role="option"
            [value]="item.value"
            #option="DataListItem"
            class="datalist-item w-full items-center"
          >
            <fibo-checkbox [readonly]="true" [checked]="option.isSelected()">
              {{ item.label }}
            </fibo-checkbox>
          </button>
        }
      </div>
    </ng-template>
  `,
})
export class MultiSelect implements FormValueControl<(string | number)[] | null> {
  readonly uiState = inject(FieldUiState);
  readonly fieldOverlay = viewChild.required(FieldOverlay);
  private readonly triggerSurface = viewChild.required<ElementRef<HTMLElement>>('triggerSurface');

  readonly value = model<(string | number)[] | null>(null);
  readonly items = input<SelectItem[]>([]);
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly placeholder = input<string>('Select');

  readonly selectedItems = computed(() => {
    const currentValue = this.value();
    if (!currentValue || !Array.isArray(currentValue)) return [];
    return this.items().filter((item) => item.value !== null && currentValue.includes(item.value));
  });

  focus(options?: FocusOptions) {
    this.triggerSurface().nativeElement.focus(options);
  }

  openFromKeyboard(event: Event) {
    event.preventDefault();
    this.fieldOverlay().open();
  }

  onFocus() {
    this.uiState.touched.set(true);
  }

  onBlur() {
    this.uiState.touched.set(true);
  }

  removeItem(val: string | number | null) {
    if (val === null || this.uiState.disabled()) return;

    const currentValue = this.value();
    if (!currentValue) return;

    this.value.set(currentValue.filter((v) => v !== val));
    this.uiState.touched.set(true);
  }
}
