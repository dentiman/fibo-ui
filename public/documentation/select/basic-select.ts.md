```ts
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Field, form } from '@angular/forms/signals';
import { FormField } from '@fibo-ui/components';
import {
  DataList,
  ListItem,
  Popover,
  PopoverTrigger,
  PortalTemplateDirective,
  SingleSelectionModel
} from '@fibo-ui/cdk';
import { FieldLabel } from '@fibo-ui/components/src/lib/form/form-field/field-label';

interface UserModel {
  role: string | null;
}

@Component({
  selector: 'app-select-example',
  standalone: true,
  imports: [
    CommonModule,
    Field,
    FormField,
    DataList,
    Popover,
    PortalTemplateDirective,
    PopoverTrigger,
    SingleSelectionModel,
    ListItem,
    FieldLabel
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'basic-select.html'
})
export class SelectExampleComponent {
  readonly user = signal<UserModel>({
    role: null
  });
  
  readonly userForm = form(this.user);

  readonly userRoles = ['admin', 'user', 'guest'];
}
```

