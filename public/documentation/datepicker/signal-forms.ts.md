```ts
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form} from '@angular/forms/signals';
import {FormField, Calendar, SelectDate} from '@fibo-ui/components';
import {
  FiboInput,
  Popover,
  PopoverTrigger,
  PortalTemplateDirective
} from '@fibo-ui/cdk';
import {FieldLabel} from '@fibo-ui/components';

@Component({
  selector: 'app-datepicker-signal-forms',
  imports: [
    CommonModule,
    Field,
    FormField,
    FiboInput,
    Popover,
    PortalTemplateDirective,
    PopoverTrigger,
    Calendar,
    SelectDate,
    FieldLabel
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'signal-forms.html'
})
export class SignalFormsDatepickerExampleComponent {
  userModel = signal({
    birthDate: null as string | null
  });

  userForm = form(this.userModel, (schemaPath) => {
    // Add validation if needed
  });
}
```

