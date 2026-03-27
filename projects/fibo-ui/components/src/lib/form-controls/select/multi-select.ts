import { Component, ElementRef, TemplateRef, computed, inject, input, model, signal, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  closeOnFocusLeave,
  closeOnOutsideClick,
  createOverlay,
  DataList,
  DataListItem,
  KeyboardSource,
  connectedOverlay,
  SelectMulti,
  provideFormValueControl,
  restoreTriggerFocusOnClose,
} from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';
import { FieldActionDirective } from '../form/field-action';
import { FieldShell } from '../form/field-shell';
import { FieldTargetDirective } from '../form/field-target';
import { FORM_UI_STATE_INPUTS, FormUiState } from '../form/form-ui-state';
import { Checkbox } from '../checkbox/checkbox';
import { SelectItem } from './select';

@Component({
  selector: 'fibo-multi-select',
  hostDirectives: [
    {
      directive: FormUiState,
      inputs: [...FORM_UI_STATE_INPUTS],
    },
  ],
  imports: [
    DataList,
    KeyboardSource,
    SelectMulti,
    LucideAngularModule,
    DataListItem,
    FieldShell,
    FieldTargetDirective,
    FieldActionDirective,
    Checkbox,
  ],
  host: {
    class: 'block',
  },
  providers: [provideFormValueControl(() => MultiSelect)],
  template: `
    <fibo-field-shell
      #fieldShell
      [label]="label()"
      [hint]="hint()"
      iconEnd="chevron-down"
    >
      <div
        fiboFieldTarget
        fieldTargetMode="click"
        fiboKeyboardSource
        #keyboardSource="KeyboardSource"
        #triggerSurface
        data-field-interactive
        role="combobox"
        aria-haspopup="listbox"
        [attr.tabindex]="uiState.disabled() ? -1 : 0"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="isOpen() ? listboxId() : null"
        [attr.aria-invalid]="uiState.invalid() || null"
        [attr.aria-disabled]="uiState.disabled() || null"
        class="w-full flex flex-wrap gap-x-1 gap-y-1 -mx-1 outline-none"
        (click)="toggle()"
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
              fiboFieldAction
              class="rounded-full cursor-pointer flex-shrink-0 btn-text p-0.5 hover:bg-black/5 dark:hover:bg-white/5"
              (click)="removeItem(item.value); $event.stopPropagation()"
              (keydown)="$event.stopPropagation()"
            >
              <lucide-icon name="x" size="12"></lucide-icon>
            </button>
          </div>
        }
        @if (selectedItems().length === 0) {
          <div class="from-field-placeholder text-sm ml-1">{{ placeholder() }}</div>
        }
      </div>
    </fibo-field-shell>

    <ng-template #multiSelectTpl>
      <div
        role="listbox"
        [attr.id]="listboxId()"
        aria-multiselectable="true"
        [keyboardSource]="keyboardSource"
        fiboDataList
        fiboSelectMulti
        [(value)]="value"
      >
        @for (item of items(); track item.value) {
          <a
            fiboDataListItem
            role="option"
            [value]="item.value"
            #option="DataListItem"
            class="datalist-item items-center"
          >
            <fibo-checkbox [readonly]="true" [checked]="option.isSelected()">
              {{ item.label }}
            </fibo-checkbox>
          </a>
        }
      </div>
    </ng-template>
  `,
})
export class MultiSelect implements FormValueControl<(string | number)[] | null> {
  readonly uiState = inject(FormUiState);
  readonly fieldShell = viewChild.required(FieldShell);
  private readonly multiSelectTemplate = viewChild.required<TemplateRef<unknown>>('multiSelectTpl');
  private readonly triggerSurface = viewChild.required<ElementRef<HTMLElement>>('triggerSurface');

  readonly value = model<(string | number)[] | null>(null);
  readonly items = input<SelectItem[]>([]);
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly placeholder = input<string>('Select');
  readonly isOpen = signal(false);
  readonly listboxId = computed(() => this.fieldShell().idFor('listbox'));

  readonly selectedItems = computed(() => {
    const currentValue = this.value();
    if (!currentValue || !Array.isArray(currentValue)) return [];
    return this.items().filter((item) => item.value !== null && currentValue.includes(item.value));
  });
  readonly strategy = computed(() => {
    const templateRef = this.multiSelectTemplate();
    if (!templateRef) {
      return null;
    }

    return connectedOverlay({
      templateRef,
      referenceElement: this.fieldShell().overlayReferenceElement(),
      interactionRoot: this.fieldShell().overlayInteractionRoot(),
      focusReturnTarget: this.fieldShell().overlayFocusReturnTarget(),
      matchWidth: true,
    });
  });
  readonly overlayHandle = createOverlay(this.isOpen, this.strategy as any, overlay => {
    closeOnFocusLeave(overlay);
    closeOnOutsideClick(overlay);
    restoreTriggerFocusOnClose(overlay);
  });

  focus(options?: FocusOptions) {
    this.triggerSurface().nativeElement.focus(options);
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

  openFromKeyboard(event: Event) {
    event.preventDefault();
    this.open();
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
