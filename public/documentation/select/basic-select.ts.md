```ts
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Field, form } from '@angular/forms/signals';
import {
  DataList,
  Option,
  Popover,
  PopoverTriggerClick,
  PortalContent,
  SelectOne,
  FormFieldDirective
} from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';

interface UserModel {
  role: string | null;
}

@Component({
  selector: 'app-select-example',
  standalone: true,
  imports: [
    CommonModule,
    Field,
    FormFieldDirective,
    DataList,
    Popover,
    PortalContent,
    PopoverTriggerClick,
    SelectOne,
    Option,
    LucideAngularModule
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

