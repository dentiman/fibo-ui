import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { SelectDate, Popover, PopoverTriggerClick } from '@fibo-ui/cdk';
import { Calendar, FormFieldControl } from '@fibo-ui/components';

@Component({
  selector: 'datepicker-basic-template-example',
  imports: [
    FormField,
    FormFieldControl,
    PopoverTriggerClick,
    Popover,
    Calendar,
    SelectDate,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-form-field-control fiboPopoverTriggerClick [content]="calTpl"
        [formField]="userForm.birthDate"
        label="Birth Date" iconEnd="calendar-days" [clearValue]="''">

        <input [formField]="userForm.birthDate"
               placeholder="YYYY-MM-DD" class="text-field-input" />
      </fibo-form-field-control>
      <ng-template #calTpl let-trigger>
        <fibo-calendar fiboPopover
                       fiboSelectDate [(value)]="userForm.birthDate().value"
                       (itemTriggered)="trigger.close()"
                       class="popover-container" />
      </ng-template>
    </div>
  `,
})
export class DatepickerBasicTemplateExample {
  readonly userModel = signal({ birthDate: '' });
  readonly userForm = form(this.userModel);
}
