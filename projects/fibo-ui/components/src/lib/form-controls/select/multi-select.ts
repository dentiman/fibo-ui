import { Component, ElementRef, computed, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  DataList,
  DataListItem,
  FieldAuxiliary,
  FieldInteractive,
  FieldOverlay,
  FIELD_UI_STATE_INPUTS,
  FieldUiState,
  SelectMulti,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';
import { FieldShell } from '../form/field-shell';
import { Size } from '../../primitives/size';
import { Checkbox } from '../checkbox/checkbox';
import { SelectItem } from './select';

@Component({
  selector: 'fibo-multi-select',
  hostDirectives: [
    {
      directive: FieldUiState,
      inputs: [...FIELD_UI_STATE_INPUTS],
    },
    { directive: Size, inputs: ['fiboSize'] },
  ],
  imports: [
    DataList,
    SelectMulti,
    LucideAngularModule,
    DataListItem,
    FieldShell,
    FieldInteractive,
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
        fiboFieldInteractive
        [fiboFieldOverlay]="multiSelectTpl"
        [matchWidth]="true"
        #triggerSurface
        role="combobox"
        aria-haspopup="listbox"
        [attr.aria-disabled]="uiState.disabled() || null"
        class="fibo-field-button flex flex-wrap gap-x-1 gap-y-1 -mx-1"
        (focus)="onFocus()"
        (blur)="onBlur()"
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
          <div class="fibo-field-placeholder text-sm ml-1">{{ placeholder() }}</div>
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
