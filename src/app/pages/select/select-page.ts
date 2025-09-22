import {Component, computed, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from "@angular/core/rxjs-interop";
import {User, usersChoices} from "../../common/form-data-example";
import {BasicSelectExampleComponent} from './content/basic-select-example';
import {FloatingLabelSelectExampleComponent} from './content/floating-label-example';
import {FixedLabelSelectExampleComponent} from './content/fixed-label-example';
import {CustomTemplateSelectExampleComponent} from './content/custom-template-example';
import {CustomComponentSelectExampleComponent} from './content/user-select-wrapper';

@Component({
  selector: 'app-select-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BasicSelectExampleComponent,
    FloatingLabelSelectExampleComponent,
    FixedLabelSelectExampleComponent,
    CustomTemplateSelectExampleComponent,
    CustomComponentSelectExampleComponent,

  ],
  templateUrl: './select-page.html',
})
export class SelectPageComponent {
  // Create a form group with individual controls for each field
  form = new FormGroup({
    placeholderField: new FormControl(null),
    floatingLabelField: new FormControl(null),
    fixedLabelField: new FormControl(null),
    searchableField: new FormControl('4', { validators: Validators.required }),
    customTemplateField: new FormControl('5', { validators: Validators.required }),
    userSelectField: new FormControl(6, { validators: Validators.required })
  });

  // Individual form controls for easy access
  placeholderCtrl = this.form.get('placeholderField') as FormControl;
  floatingLabelCtrl = this.form.get('floatingLabelField') as FormControl;
  fixedLabelCtrl = this.form.get('fixedLabelField') as FormControl;
  searchableCtrl = this.form.get('searchableField') as FormControl;
  customTemplateCtrl = this.form.get('customTemplateField') as FormControl;
  userSelectCtrl = this.form.get('userSelectField') as FormControl;

  searchText = signal('');

  valueModel = signal<number|null>(1);

  // Use shared user data for all fields
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

  // Method to disable/enable the entire form
  toggleFormDisabled() {
    if (this.form.disabled) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }
}
