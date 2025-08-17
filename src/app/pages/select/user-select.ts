import {Component, computed, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {
  DataList,
  FormFieldErrors,
  Option,
  OverlayTriggerClick,
  Popover,
  SingleSelectionModel,
  FormFieldControl
} from '@fibo-ui/cdk';
import {FormField} from '@fibo-ui/components';



export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  value: string;
  label: string;
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
    OverlayTriggerClick,
    DataList,
    Option,
    FormFieldErrors,
  ],
  templateUrl: './user-select.html',
  hostDirectives: [
    {
      directive: FormFieldControl,
      inputs: ['label', 'placeholder','fixedLabel'],
    }
  ],
})
export class UserSelectComponent {
  formFieldControl = inject<FormFieldControl<number|null>>(FormFieldControl)
  value = this.formFieldControl.cva.value;
  disabled = this.formFieldControl.cva.disabled
  users = input<User[]>([]);

  selectedUser = computed(() => {
    const currentValue = this.value();
    return this.users().find(user => user.id === currentValue);
  });
}
