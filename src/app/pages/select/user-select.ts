import {Component, computed, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {
  DataList,
  FormField,
  FormFieldErrors,
  Option,
  OverlayTriggerClick,
  Popover,
  SingleSelectionModel,
  FormFieldDirective
} from '@fibo-ui/components';

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
      directive: FormFieldDirective,
      inputs: ['label', 'placeholder','fixedLabel'],
    }
  ],
})
export class UserSelectComponent {
  formFieldControl = inject<FormFieldDirective<number|null>>(FormFieldDirective)
  value = this.formFieldControl.cva.value;
  disabled = this.formFieldControl.cva.disabled
  users = input<User[]>([]);

  selectedUser = computed(() => {
    const currentValue = this.value();
    return this.users().find(user => user.id === currentValue);
  });
}
