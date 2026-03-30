import { Component, ElementRef, TemplateRef, computed, inject, input, model, signal, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  createOverlay,
  OverlayPanel,
  SelectDate,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { connectedConfig } from '../../overlay/overlay-presets';
import { Calendar } from '../calendar/calendar';
import { FieldShell } from '../form/field-shell';
import { FieldTargetDirective } from '../form/field-target';
import { FORM_UI_STATE_INPUTS, FormUiState } from '../form/form-ui-state';

@Component({
  selector: 'fibo-datepicker, fibo-datepicker-field',
  hostDirectives: [
    {
      directive: FormUiState,
      inputs: [...FORM_UI_STATE_INPUTS],
    },
  ],
  imports: [FieldShell, FieldTargetDirective, Calendar, SelectDate, OverlayPanel],
  host: {
    class: 'block',
  },
  providers: [provideFormValueControl(() => DatePickerField)],
  template: `
    <fibo-field-shell
      #fieldShell
      [label]="label()"
      [hint]="hint()"
      [iconStart]="iconStart()"
      iconEnd="calendar-days"
      [canClear]="value() !== ''"
      (clearRequested)="clear()"
    >
      <input
        fiboFieldTarget
        fieldTargetMode="click"
        #inputElement
        aria-haspopup="dialog"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="uiState.disabled()"
        [readOnly]="uiState.readonly()"
        [required]="uiState.required()"
        [attr.name]="uiState.name() || null"
        [attr.aria-required]="uiState.required() || null"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="isOpen() ? dialogId() : null"
        [attr.aria-invalid]="uiState.invalid() || null"
        [attr.aria-readonly]="uiState.readonly() || null"
        [attr.data-error]="(uiState.invalid() && uiState.touched()) || null"
        (input)="onInput($event)"
        (click)="openCalendar()"
        (keydown.enter)="openCalendar()"
        (keydown.arrowdown)="openCalendar($event)"
        (blur)="onBlur()"
        class="text-field-input"
      />
    </fibo-field-shell>

    <ng-template #calendarTpl>
      <fibo-calendar
        [attr.id]="dialogId()"
        fiboSelectDate
        fiboOverlayPanel
        [modal]="false"
        [(value)]="value"
        (itemTriggered)="close()"
        class="popover-container"
      />
    </ng-template>
  `,
})
export class DatePickerField implements FormValueControl<string> {
  readonly uiState = inject(FormUiState);
  private readonly calendarTemplate = viewChild.required<TemplateRef<unknown>>('calendarTpl');
  readonly fieldShell = viewChild.required(FieldShell);
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  readonly isOpen = signal(false);

  readonly value = model<string>('');
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly placeholder = input<string>('');
  readonly iconStart = input<string>('');
  readonly dialogId = computed(() => this.fieldShell().idFor('dialog'));
  readonly strategy = computed(() =>
    connectedConfig({
      content: this.calendarTemplate() ?? '',
      referenceElement: this.fieldShell().overlayReferenceElement(),
      focusReturnTarget: this.fieldShell().overlayFocusReturnTarget(),
      trapFocus: true,
      restoreFocus: true,
    }),
  );
  readonly overlayHandle = createOverlay(this.isOpen, this.strategy);

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onBlur() {
    this.uiState.touched.set(true);
  }

  focus(options?: FocusOptions) {
    this.inputElement().nativeElement.focus(options);
  }

  openCalendar(event?: Event) {
    event?.preventDefault();
    this.focus();
    if (!this.uiState.disabled() && !this.uiState.readonly()) {
      this.isOpen.set(true);
    }
  }

  close() {
    this.isOpen.set(false);
  }

  clear() {
    if (this.uiState.disabled()) {
      return;
    }

    this.value.set('');
    this.uiState.touched.set(true);
    this.close();
  }
}
