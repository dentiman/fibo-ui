import {ChangeDetectionStrategy, Component, computed, effect, model, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form} from '@angular/forms/signals';
import {FormField, Calendar, CalendarDateRangeSelectionModel, DateRange} from '@fibo-ui/components';
import {
  FiboInput,
  Popover,
  PopoverTrigger,
  PortalTemplateDirective
} from '@fibo-ui/cdk';
import {FieldLabel} from '../../../../../projects/fibo-ui/components/src/lib/form/form-field/field-label';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-date-range-signal-forms',
  imports: [
    CommonModule,
    Field,
    FormField,
    FiboInput,
    Popover,
    PortalTemplateDirective,
    PopoverTrigger,
    Calendar,
    CalendarDateRangeSelectionModel,
    FieldLabel,
    UsageDemo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Date Range Picker with Signal Forms</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 space-y-4 p-8">
        <form class="space-y-4">
          <fibo-form-field
            fiboPopoverTrigger
            #dateRangeTrigger="PopoverTrigger"
            [field]="userForm.dateRange"
            appendIcon="calendar-range">
            <fibo-field-label>Date Range</fibo-field-label>
            <div class="flex items-center gap-1">
              <input
                fiboInput
                name="startDate"
                type="text"
                [value]="dateRangeValue().startDate || ''"
                placeholder="YYYY-MM-DD"
                (focus)="dateRangeTrigger.open()"
                (input)="onStartDateInput($event)"
                class="w-19 appearance-none outline-none text-sm placeholder:text-xs focus:outline-0" />
              <span class="flex items-center mx-1 text-gray-400 text-center">-</span>
              <input
                fiboInput
                name="endDate"
                type="text"
                [value]="dateRangeValue().endDate || ''"
                placeholder="YYYY-MM-DD"
                (focus)="dateRangeTrigger.open()"
                (input)="onEndDateInput($event)"
                class="w-full pl-1 appearance-none outline-none text-sm placeholder:text-xs focus:outline-0" />
            </div>
            <ng-template fiboPortalTemplate [(isOpen)]="dateRangeTrigger.isOpen">
              <fibo-calendar
                fiboPopover
                [popoverTrigger]="dateRangeTrigger"
                class="fibo-popover rounded-md"
                [(fiboCalendarDateRangeSelectionModel)]="calendarDateRange"
                (optionTriggered)="dateRangeTrigger.close()"
              />
            </ng-template>
          </fibo-form-field>
        </form>
      </div>
    </app-usage-demo>
  `,
})
export class SignalFormsDateRangeExampleComponent {
  userModel = signal({
    dateRange: {
      startDate: null,
      endDate: null
    } as DateRange
  });

  userForm = form(this.userModel, (schemaPath) => {
    // Add validation if needed
  });

  // Computed signal to get the date range value from the form
  dateRangeValue = computed(() => this.userForm.dateRange().value());

  // Model signal for calendar component (needs to sync with form field)
  calendarDateRange = model<DateRange>({
    startDate: null,
    endDate: null
  });

  constructor() {
    // Sync form field value to calendar model
    effect(() => {
      const formValue = this.dateRangeValue();
      this.calendarDateRange.set(formValue);
    });

    // Sync calendar model changes back to form field
    effect(() => {
      const calendarValue = this.calendarDateRange();
      const currentFormValue = this.dateRangeValue();
      // Only update if different to avoid infinite loops
      if (calendarValue.startDate !== currentFormValue.startDate || 
          calendarValue.endDate !== currentFormValue.endDate) {
        this.userForm.dateRange().value.set(calendarValue);
      }
    });
  }

  onStartDateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value || null;
    const currentRange = this.dateRangeValue();
    this.userForm.dateRange().value.set({
      ...currentRange,
      startDate: value
    });
  }

  onEndDateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value || null;
    const currentRange = this.dateRangeValue();
    this.userForm.dateRange().value.set({
      ...currentRange,
      endDate: value
    });
  }

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/datepicker/signal-forms-date-range.html.md' },
    { name: 'ts', path: '/documentation/datepicker/signal-forms-date-range.ts.md' }
  ];
}

