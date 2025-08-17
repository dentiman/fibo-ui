import {Component, computed, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormActionsComponent} from "../../common/form-actions";
import {toSignal} from "@angular/core/rxjs-interop";
import {FormFieldContent} from '@fibo-ui/cdk';
import {User, usersChoices} from "../../common/form-data-example";
import {UserSelectComponent} from "./user-select";
import {Select} from '@fibo-ui/components';

@Component({
  selector: 'app-select-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormActionsComponent,
    Select,
    UserSelectComponent,
    FormFieldContent,

  ],
  templateUrl: './select-page.html',
})
export class SelectPageComponent {
  ctrl = new FormControl('1', { validators: Validators.required });
  userCtrl = new FormControl(1, { validators: Validators.required });

  searchText = signal('');

  valueModel = signal<number|null>(1);

  value = toSignal(this.ctrl.valueChanges);
  userValue = toSignal(this.userCtrl.valueChanges);

  // Use shared user data
  users = usersChoices;

  items = signal(this.users);

  filteredItems = computed(() => {
    const searchText = this.searchText();
    if(!searchText) return this.items();
    return this.items().filter((user: User) =>
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Properties for the generic select
  valueProp: keyof User = 'id';
  labelProp: keyof User = 'username';
}
