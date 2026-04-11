import { Component, ElementRef, computed, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  OverlayPanel,
  SelectDate,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { Calendar } from '../calendar/calendar';
import { FieldShell } from '../form/field-shell';
import { FieldInteractiveDirective } from '../form/field-interactive';
import { FieldOverlayDirective } from '../form/field-overlay';
import { FORM_UI_STATE_INPUTS, FormUiState } from '../form/form-ui-state';

@Component({
  selector: 'fibo-datepicker, fibo-datepicker-field',
  hostDirectives: [
    {
      directive: FormUiState,
      inputs: [...FORM_UI_STATE_INPUTS],
    },
  ],
  imports: [FieldShell, FieldInteractiveDirective, FieldOverlayDirective, Calendar, SelectDate, OverlayPanel],
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
        fiboFieldInteractive
        fieldInteractiveMode="click"
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
        [attr.data-error]="(uiState.invalid() && uiState.touched()) || null"
        (input)="onInput($event)"
        (keydown.enter)="openCalendar()"
        (keydown.arrowdown)="openCalendar($event)"
        (blur)="onBlur()"
        class="text-field-input"
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
  readonly uiState = inject(FormUiState);
  readonly fieldOverlay = viewChild.required(FieldOverlayDirective);
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
