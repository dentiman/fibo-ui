import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { SelectDate, Popover, PopoverTriggerClick, FormFieldDirective } from '@fibo-ui/cdk';
import { Calendar } from '@fibo-ui/components';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'datepicker-signal-forms-example',
  imports: [FormField, FormFieldDirective, Popover, PopoverTriggerClick, Calendar, SelectDate, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto p-8 w-[350px]">
      <form class="space-y-4">
        <div fiboFormField fiboPopoverTriggerClick [contentTemplate]="calTpl"
             class="form-field-control flex items-center gap-2">
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">Birth Date</label>
            <input
              type="text"
              [formField]="userForm.birthDate"
              placeholder="YYYY-MM-DD"
              class="text-field-input"
            />
          </div>
          <lucide-icon name="calendar-days" size="16" class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>
        </div>
        <ng-template #calTpl let-trigger>
          <fibo-calendar
            fiboPopover [trigger]="trigger"
            fiboSelectDate [(value)]="userForm.birthDate().value"
            (itemTriggered)="trigger.close()"
            class="popover-container"
          />
        </ng-template>
      </form>
    </div>
  `,
})
export class DatepickerSignalFormsExample {
  readonly userModel = signal({ birthDate: '' });
  readonly userForm = form(this.userModel);
}
