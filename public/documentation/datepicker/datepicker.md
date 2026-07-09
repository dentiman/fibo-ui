# Datepicker

Calendar-based date picker with Signal Forms support.

## Basic Usage

:::example datepicker

```html {example="datepicker"}
<fibo-datepicker
  [formField]="userForm.birthDate"
  label="Birth Date"
  placeholder="YYYY-MM-DD"
/>
```

```ts {example="datepicker"}
@Component({
  selector: 'datepicker-component-example',
  imports: [DatePickerField, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class DatepickerComponentExample {
  readonly userModel = signal({ birthDate: '' });
  readonly userForm = form(this.userModel);
}
```

## API

### Inputs

- `label: input<string>` - field label
- `placeholder: input<string>` - placeholder text
- `iconStart: input<string>` - start icon name
- standard form-state inputs: `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`

## Recipe

`DatePickerField` is a thin field that opens a `Calendar` inside an overlay. The calendar view and its month-navigation state are separate, focused pieces built on CDK selection. Copy the set as-is, or swap the calendar for your own.

:::example recipe

```ts {example="recipe" title="datepicker-field.ts"}
import { Component, ElementRef, computed, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  FieldInput,
  FieldOverlay,
  FIELD_UI_STATE_INPUTS,
  FieldUiState,
  OverlayPanel,
  SelectDate,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { Calendar } from '../calendar/calendar';
import { FieldShell } from '../form/field-shell';
import { Size } from '../../primitives/size';

@Component({
  selector: 'fibo-datepicker, fibo-datepicker-field',
  hostDirectives: [
    {
      directive: FieldUiState,
      inputs: [...FIELD_UI_STATE_INPUTS],
    },
    { directive: Size, inputs: ['fiboSize'] },
  ],
  imports: [FieldShell, FieldInput, FieldOverlay, Calendar, SelectDate, OverlayPanel],
  host: {
    class: 'block',
  },
  providers: [provideFormValueControl(() => DatePickerField)],
  templateUrl: './datepicker-field.html',
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
```

```html {example="recipe" title="datepicker-field.html"}
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
    class="fibo-field-input"
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
```

```ts {example="recipe" title="calendar.ts"}
import { Component, computed, inject, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataList, DataListItem, SELECTION_MODEL } from '@fibo-ui/cdk';
import { ActiveMonth } from './active-date.state';
import { parse } from 'date-fns';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'fibo-calendar',
  standalone: true,
  imports: [CommonModule, DataListItem, LucideAngularModule],
  hostDirectives: [
    {
      directive: DataList,
      outputs: ['itemTriggered'],
    },
  ],
  styles: `
    button[aria-selected="true"] {
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
    }
    button[aria-selected="true"] ~ button[aria-selected="true"] {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    button[aria-selected="true"]:not(:has(~ button[aria-selected="true"])) {
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
  `,
  template: `
    <div class=" w-70 flex-none">
      <div class="border-b border-border-primary ">
        <div class="flex items-center text-center text-foreground-secondary space-x-2 p-1">
          <button type="button" (click)="state.setPreviousYear()"
                  class=" flex flex-none items-center justify-center btn btn-text   py-1 px-2  rounded-md">
            <span class="sr-only">Previous year</span>
            <lucide-icon name="chevrons-left" class="size-4"></lucide-icon>
          </button>
          <button type="button" (click)="state.setPreviousMonth()"
                  class=" flex flex-none items-center justify-center btn btn-text   py-1 px-2  rounded-md">
            <span class="sr-only">Previous month</span>
            <lucide-icon name="chevron-left" class="size-4"></lucide-icon>
          </button>

          <div class="flex-auto text-sm font-semibold py-1  whitespace-nowrap ">
            {{ state.monthName() }} {{ state.year() }}
          </div>

          <button type="button" (click)="state.setNextMonth()"
                  class=" flex flex-none items-center justify-center btn btn-text py-1 px-2 rounded-md">
            <span class="sr-only">Next month</span>
            <lucide-icon name="chevron-right" class="size-4"></lucide-icon>
          </button>
          <button type="button" (click)="state.setNextYear()"
                  class=" flex flex-none items-center justify-center btn btn-text py-1 px-2 rounded-md">
            <span class="sr-only">Next year</span>
            <lucide-icon name="chevrons-right" class="size-4"></lucide-icon>
          </button>
        </div>
        <div class=" grid grid-cols-7 text-center text-xs text-foreground-tertiary leading-6 px-1 ">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
      </div>

      <div class="mt-2 grid grid-cols-7 space-y-1 space-x-0 text-sm p-1 ">
        @for (week of state.weeks(); track $index) {
          @for (date of week; track date + $index) {
            <button fiboDataListItem [value]="date" #option="DataListItem"
                    class="datalist-item p-1 justify-center items-center"
                    [class.text-foreground-tertiary]="!state.hasTheSameMonthAs(date)"
            >
              {{ dayLabel(date) }}
            </button>
          }
        }
      </div>
    </div>
  `,
})
export class Calendar {
  private readonly dateFormat = 'yyyy-MM-dd';
  minDate = input<string | null>(null);
  maxDate = input<string | null>(null);

  selectionModel = inject(SELECTION_MODEL, { self: true });

  state = new ActiveMonth(this.selectionModel.lastSelection);

  dayLabel(date: string) {
    return parse(date, this.dateFormat, new Date()).getDate();
  }
}
```

```ts {example="recipe" title="active-date.state.ts"}
import { computed, Signal, signal, WritableSignal, effect, linkedSignal } from '@angular/core';
import { parse, isValid, isEqual, format, addMonths, subMonths, addYears, subYears, getYear, getMonth, startOfMonth, endOfMonth, startOfWeek, addDays } from 'date-fns';

export class ActiveMonth {
  private readonly dateFormat = 'yyyy-MM-dd';

  constructor(private _changes: Signal<string | null>) {}

  year = linkedSignal(() => {
    const changes = this._changes();
    if (!changes) return getYear(new Date());

    const parsedDate = parse(changes, this.dateFormat, new Date());
    return isValid(parsedDate) ? getYear(parsedDate) : getYear(new Date());
  });

  month = linkedSignal(() => {
    const changes = this._changes();
    if (!changes) return getMonth(new Date()) + 1;

    const parsedDate = parse(changes, this.dateFormat, new Date());
    return isValid(parsedDate) ? getMonth(parsedDate) + 1 : getMonth(new Date()) + 1;
  });

  monthName = computed(() => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = this.month() - 1;
    return monthNames[monthIndex];
  });

  weeks: Signal<string[][]> = computed(() => {
    const year = this.year();
    const month = this.month();
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = endOfMonth(firstDayOfMonth);

    const weeks: string[][] = [];
    let currentWeek: string[] = [];

    const currentDate = startOfWeek(firstDayOfMonth);

    while (currentDate <= lastDayOfMonth || currentDate.getDay() !== 0) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push(format(currentDate, this.dateFormat));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  });

  setFromDate(date: string): void {
    if (typeof date === 'string' && isValid(parse(date, this.dateFormat, new Date()))) {
      const parsedDate = parse(date, this.dateFormat, new Date());
      this.year.set(getYear(parsedDate));
      this.month.set(getMonth(parsedDate) + 1);
    }
  }

  setMonth(month: number): void {
    this.month.set(month);
  }

  setNextMonth(): void {
    const currentMonth = this.month();
    const currentYear = this.year();
    const newDate = addMonths(new Date(currentYear, currentMonth - 1, 1), 1);
    this.year.set(getYear(newDate));
    this.month.set(getMonth(newDate) + 1);
  }

  setPreviousMonth(): void {
    const currentMonth = this.month();
    const currentYear = this.year();
    const newDate = subMonths(new Date(currentYear, currentMonth - 1, 1), 1);
    this.year.set(getYear(newDate));
    this.month.set(getMonth(newDate) + 1);
  }

  setYear(fullYear: number): void {
    this.year.set(fullYear);
  }

  setNextYear(): void {
    const currentMonth = this.month();
    const currentYear = this.year();
    const newDate = addYears(new Date(currentYear, currentMonth - 1, 1), 1);
    this.year.set(getYear(newDate));
    this.month.set(getMonth(newDate) + 1);
  }

  setPreviousYear(): void {
    const currentMonth = this.month();
    const currentYear = this.year();
    const newDate = subYears(new Date(currentYear, currentMonth - 1, 1), 1);
    this.year.set(getYear(newDate));
    this.month.set(getMonth(newDate) + 1);
  }

  hasTheSameMonthAs(date: string): boolean {
    const compareDate = parse(date, this.dateFormat, new Date());
    return this.month() === getMonth(compareDate) + 1 && this.year() === getYear(compareDate);
  }
}
```
