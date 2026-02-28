import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { SelectDate, Popover, PopoverTriggerClick, PortalContent } from '@fibo-ui/cdk';
import { Calendar, FormFieldControl } from '@fibo-ui/components';

@Component({
  selector: 'datepicker-basic-template-example',
  imports: [
    FormField,
    FormFieldControl,
    PopoverTriggerClick,
    PortalContent,
    Popover,
    Calendar,
    SelectDate,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-form-field-control fiboPopoverTriggerClick
        [formField]="userForm.birthDate"
        label="Birth Date" iconEnd="calendar-days" [clearValue]="''">

        <input [formField]="userForm.birthDate"
               placeholder="YYYY-MM-DD" class="text-field-input" />

        <ng-template fiboPortalContent let-trigger>
          <fibo-calendar fiboPopover [trigger]="trigger"
                         fiboSelectDate [(value)]="userForm.birthDate().value"
                         (itemTriggered)="trigger.close()"
                         class="popover-container" />
        </ng-template>
      </fibo-form-field-control>
    </div>
  `,
})
export class DatepickerBasicTemplateExample {
  readonly userModel = signal({ birthDate: '' });
  readonly userForm = form(this.userModel);
}
