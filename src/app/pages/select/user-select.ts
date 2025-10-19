import {Component, computed, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {
  DataList,
  FormFieldErrors,
  ListItem,
  PopoverTriggerClick,
  Popover,
  SingleSelectionModel,
  FormFieldControl
} from '@fibo-ui/cdk';
import {FormField} from '@fibo-ui/components';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}
@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Popover,
    SingleSelectionModel,
    FormField,
    PopoverTriggerClick,
    DataList,
    ListItem,
    FormFieldErrors,
  ],
  templateUrl: './user-select.html',
  hostDirectives: [
    {
      directive: FormFieldControl,
      inputs: ['label', 'placeholder','fixedLabel', 'controlClass'],
    }
  ],
})
export class UserSelect {
  formFieldControl = inject<FormFieldControl<number|null>>(FormFieldControl)
  value = this.formFieldControl.cva.value;
  disabled = this.formFieldControl.cva.disabled
  users = input<User[]>([]);

  selectedUser = computed(() => {
    const currentValue = this.value();
    return this.users().find(user => user.id === currentValue);
  });
}
