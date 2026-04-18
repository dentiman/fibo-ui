import { Component, ElementRef, computed, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  OverlayPanel,
  SelectDate,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { Calendar } from '../calendar/calendar';
import { FieldShell } from '../form/field-shell';
import { FieldInput } from '../form/field-input';
import { FieldOverlay } from '../form/field-overlay';
import { FieldContext, FIELD_CONTEXT_INPUTS } from '../form/field-context';
import { FIELD_UI_STATE_INPUTS, FieldUiState } from '../form/field-ui-state';
import { Size } from '../../primitives/size';

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
    { directive: Size, inputs: ['fiboSize'] },
  ],
  imports: [FieldShell, FieldInput, FieldOverlay, Calendar, SelectDate, OverlayPanel],
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
        fiboFieldInput
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
        (keydown.enter)="$event.preventDefault(); fieldOverlay().open()"
        (keydown.arrowdown)="openOnArrowDown($event)"
        (blur)="onBlur()"
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

  openOnArrowDown(event: Event) {
    event.preventDefault();
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
