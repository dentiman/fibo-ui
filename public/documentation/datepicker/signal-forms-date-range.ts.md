```ts
import {ChangeDetectionStrategy, Component, computed, effect, model, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form} from '@angular/forms/signals';
import {FormField, Calendar, SelectDateRange, DateRange} from '@fibo-ui/components';
import {
    FiboInput,
    Popover,
    PopoverTrigger,
    PortalContent
} from '@fibo-ui/cdk';
import {FieldLabel} from '@fibo-ui/components';

@Component({
    selector: 'app-date-range-signal-forms',
    imports: [
        CommonModule,
        Field,
        FormField,
        FiboInput,
        Popover,
        PortalContent,
        PopoverTrigger,
        Calendar,
        SelectDateRange,
        FieldLabel
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: 'signal-forms-date-range.html'
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
}
```

