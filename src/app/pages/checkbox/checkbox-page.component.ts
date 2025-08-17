import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Checkbox } from '@fibo-ui/components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox-page',
  standalone: true,
  imports: [
    CommonModule,
    Checkbox,
    ReactiveFormsModule
  ],
  templateUrl: './checkbox-page.component.html',
})
export class CheckboxPageComponent {
  // Basic checkbox states
  basicCheckbox = signal(false);
  checkedCheckbox = signal(true);
  disabledCheckbox = signal(false);
  disabledCheckedCheckbox = signal(true);
  loadingCheckbox = signal(false);

  // Indeterminate checkbox states
  indeterminateCheckbox = signal(false);
  indeterminateCheckedCheckbox = signal(true);
  disabledIndeterminateCheckbox = signal(false);
  dynamicCheckbox = signal(false);
  dynamicIndeterminate = signal(true);

  // Parent-child checkbox example
  parentCheckbox = signal(false);
  childCheckbox1 = signal(false);
  childCheckbox2 = signal(true);
  childCheckbox3 = signal(false);

  // Form control
  formCheckbox = new FormControl(false, { validators: Validators.requiredTrue });

  // Settings simulation
  emailNotifications = signal(true);
  pushNotifications = signal(false);
  marketingEmails = signal(false);
  twoFactorAuth = signal(true);

  toggleLoading() {
    this.loadingCheckbox.update(value => !value);
  }

  toggleDynamicIndeterminate() {
    this.dynamicIndeterminate.update(value => !value);
  }

  onCheckboxChange(value: boolean | null, type: string) {
    console.log(`${type} checkbox changed to:`, value);
  }

  onParentCheckboxChange(value: boolean | null) {
    if (value !== null) {
      // If parent is checked, check all children
      // If parent is unchecked, uncheck all children
      this.childCheckbox1.set(value);
      this.childCheckbox2.set(value);
      this.childCheckbox3.set(value);
    }
  }

  onChildCheckboxChange() {
    const checkedCount = [this.childCheckbox1(), this.childCheckbox2(), this.childCheckbox3()]
      .filter(Boolean).length;

    if (checkedCount === 0) {
      this.parentCheckbox.set(false);
    } else if (checkedCount === 3) {
      this.parentCheckbox.set(true);
    } else {
      // Some but not all children are checked - parent should be indeterminate
      // Note: In this example, we're keeping the parent as indeterminate by not setting it
      // The indeterminate state is handled by the template logic
    }
  }

  isParentIndeterminate(): boolean {
    const checkedCount = [this.childCheckbox1(), this.childCheckbox2(), this.childCheckbox3()]
      .filter(Boolean).length;
    return checkedCount > 0 && checkedCount < 3;
  }

  resetParentCheckbox() {
    this.parentCheckbox.set(false);
    this.childCheckbox1.set(false);
    this.childCheckbox2.set(false);
    this.childCheckbox3.set(false);
  }
}
