import { Component, ElementRef, computed, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  OverlayPanel,
  SelectDate,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { Calendar } from '../calendar/calendar';
import { FieldShell } from '../form/field-shell';
import { FieldTarget } from '../form/field-target';
import { FieldOverlay } from '../form/field-overlay';
import { FieldContext, FIELD_CONTEXT_INPUTS } from '../form/field-context';
import { FIELD_UI_STATE_INPUTS, FieldUiState } from '../form/field-ui-state';

@Component({
  selector: 'fibo-datepicker, fibo-datepicker-field',
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
  imports: [FieldShell, FieldTarget, FieldOverlay, Calendar, SelectDate, OverlayPanel],
  host: {
    class: 'block',
  },
  providers: [provideFormValueControl(() => DatePickerField)],
  template: `
    <fibo-field-shell
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
        [fiboFieldOverlay]="calendarTpl"
        #inputElement
        aria-haspopup="dialog"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="uiState.disabled()"
        [readOnly]="uiState.readonly()"
        [required]="uiState.required()"
        [attr.name]="uiState.name() || null"
        [attr.aria-required]="uiState.required() || null"
        [attr.data-invalid]="(uiState.invalid() && uiState.touched()) || null"
        (input)="onInput($event)"
        (keydown.enter)="openCalendar()"
        (keydown.arrowdown)="openCalendar($event)"
        (blur)="onBlur()"
        class="form-field-input"
      />
    </fibo-field-shell>

    <ng-template #calendarTpl let-overlay>
      <fibo-calendar
        [attr.id]="overlay.id"
        fiboSelectDate
        fiboOverlayPanel
        [modal]="false"
        [(value)]="value"
        (itemTriggered)="overlay.close()"
      />
    </ng-template>
  `,
})
export class DatePickerField implements FormValueControl<string> {
  readonly uiState = inject(FieldUiState);
  readonly fieldOverlay = viewChild.required(FieldOverlay);
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  readonly value = model<string>('');
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly placeholder = input<string>('');
  readonly iconStart = input<string>('');

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
    this.fieldOverlay().open();
  }

  clear() {
    if (this.uiState.disabled()) {
      return;
    }

    this.value.set('');
    this.uiState.touched.set(true);
    this.fieldOverlay().close();
  }
}
