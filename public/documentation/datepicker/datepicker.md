# Datepicker

Calendar-based date picker with Signal Forms support.

## Basic Usage

:::example datepicker

```html {example="datepicker"}
<fibo-form-field-control fiboPopoverTriggerClick
  [formField]="userForm.birthDate"
  label="Birth Date" iconEnd="calendar-days" [clearValue]="''">

  <input [formField]="userForm.birthDate"
         placeholder="YYYY-MM-DD" class="text-field-input" />

  <fibo-calendar *fiboPortalContent="let trigger"
                 fiboPopover [trigger]="trigger"
                 fiboSelectDate [(value)]="userForm.birthDate().value"
                 (itemTriggered)="trigger.close()"
                 class="popover-container" />
</fibo-form-field-control>
```

```ts {example="datepicker"}
@Component({
  selector: 'datepicker-example',
  imports: [
    FormField, FormFieldControl, PopoverTriggerClick,
    PortalContent, Popover, Calendar, SelectDate,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class DatepickerExample {
  readonly userModel = signal({ birthDate: '' });
  readonly userForm = form(this.userModel);
}
```

## Datepicker Component

Ready-made datepicker component that encapsulates calendar popover, input, and form field control.

:::example datepicker-component

```html {example="datepicker-component" title="usage.html"}
<fibo-datepicker
  [formField]="userForm.birthDate"
  label="Birth Date"
  placeholder="YYYY-MM-DD"
/>
```

```ts {example="datepicker-component" title="usage.ts"}
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

```html {example="datepicker-component" title="fibo-datepicker.html"}
<fibo-form-field-control
  fiboPopoverTriggerClick
  [id]="id()"
  [label]="label()"
  [iconStart]="iconStart()"
  [iconEnd]="'calendar-days'"
  [required]="required()"
  [disabled]="disabled()"
  [invalid]="invalid()"
  [touched]="touched()"
  [errors]="errors()"
  [clearValue]="''"
  [(value)]="value">

  <input
    [id]="id()"
    [value]="value()"
    [placeholder]="placeholder()"
    [disabled]="disabled()"
    [attr.data-error]="invalid() && touched() || null"
    (input)="onInput($event)"
    (blur)="onBlur()"
    class="text-field-input" />

  <fibo-calendar *fiboPortalContent="let trigger"
                 fiboPopover [trigger]="trigger"
                 fiboSelectDate [(value)]="value"
                 (itemTriggered)="trigger.close()"
                 class="popover-container" />
</fibo-form-field-control>
```

```ts {example="datepicker-component" title="fibo-datepicker.ts"}
@Component({
  selector: 'fibo-datepicker',
  imports: [
    FormFieldControl, Popover, PortalContent,
    PopoverTriggerClick, Calendar, SelectDate,
  ],
  host: { class: 'block' },
  template: '...',
})
export class DatePickerField implements FormValueControl<string> {
  value = model<string>('');
  required = input(false);
  disabled = input(false);
  touched = model(false);
  invalid = input(false);
  dirty = input(false);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);

  label = input<string>('');
  placeholder = input<string>('');
  iconStart = input<string>('');

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onBlur() {
    this.touched.set(true);
  }
}
```
