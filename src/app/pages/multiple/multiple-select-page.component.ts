import {Component, computed, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {User, usersChoices} from "../../common/form-data-example";
import {FormActionsComponent} from "../../common/form-actions.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {MultipleSelect, MultipleSelectInput} from '@fibo-ui/components';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormActionsComponent,
    MultipleSelect,
    MultipleSelectInput,
  ],
  templateUrl: './multiple-select-page.component.html',
})
export class MultipleSelectPageComponent {
  ctrl = new FormControl<string[]>(['1', '2'], { validators: Validators.required });

  searchText = signal('');

  value = toSignal(this.ctrl.valueChanges);

  // Use shared user data
  users = usersChoices;


  items = signal(this.users);

  filteredItems = computed(() => {
    const searchText = this.searchText().toLowerCase();
    return this.items().filter((user: User) =>
      user.username.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText)
    );
  });

  onValueChange(value: string) {
    this.searchText.set(value);
  }

  // Properties for the generic multiple select
  valueProp: keyof User = 'value';
  labelProp: keyof User = 'username';
}
