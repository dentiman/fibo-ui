import { Component, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required, disabled } from '@angular/forms/signals';
import { TextField, Select, MultiSelect } from '@fibo-ui/components';
import { FormFieldDirective } from '@fibo-ui/cdk';
import { citiesChoices } from '../../common/form-data-example';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: string[] | null;
  city: string | null;
}

@Component({
  selector: 'app-components-fields-form',
  standalone: true,
  imports: [
    CommonModule,
    TextField,
    Select,
    MultiSelect,
    FormField
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto p-4 w-[350px]">
      <h1 class="text-2xl font-bold mb-4">Form Example</h1>
      <form class="space-y-2">

        <fibo-text-field
          iconStart="chevron-right"
          iconEnd="chevron-right"
          label="First Name"
          placeholder="Name"
          [formField]="userProfileForm.firstName">
        </fibo-text-field>

        <fibo-text-field
          iconStart="chevron-right"
          label="Last Name"
          placeholder="Surname"
          [formField]="userProfileForm.lastName">
        </fibo-text-field>

        <fibo-text-field
          iconStart="chevron-right"
          label="Email"
          placeholder="example@mail.com"
          [formField]="userProfileForm.email">
        </fibo-text-field>

        <fibo-text-field
          iconStart="chevron-right"
          label="Phone"
          placeholder="+1 234 567 890"
          [formField]="userProfileForm.phone"
          iconEnd="chevron-right">
        </fibo-text-field>

        <fibo-multi-select
                label="Roles"
                [items]="roles"
                [formField]="userProfileForm.roles">
        </fibo-multi-select>

        <fibo-select
                label="City"
                [items]="cities"
                [clearValue]="''"
                [formField]="userProfileForm.city">
        </fibo-select>

        <button type="submit" class="btn btn-primary" [disabled]="!userProfileForm().valid()">Submit</button>
      </form>


      <!-- Form Data Display -->

      <div class="mt-8 p-4 rounded">
        <h2 class="text-xl font-bold mb-2">userProfile:</h2>
        <pre class="whitespace-pre-wrap">{{ userProfile() | json }}</pre>
      </div>

    </div>
  `
})
export class ComponentsFieldsFormComponent {
  userProfile = signal<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roles: [],
    city: null,
  });

  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
  ];

  cities = citiesChoices;

  userProfileForm = form(this.userProfile, (patch) => {
    required(patch.firstName, { message: 'First Name is required' });
    required(patch.lastName, { message: 'Last Name is required' });
    required(patch.email, { message: 'Email is required' });
    required(patch.phone, { message: 'Phone is required' });
    required(patch.roles, { message: 'Roles are required' });
    required(patch.city, { message: 'City is required' });
    disabled(patch.phone)
  })

  submittedData = signal<UserProfile | null>(null);

  constructor() {
    effect(() => {
      const data = this.userProfile();
      console.log('userProfile changed:', data);
    });
  }

  onSubmit() {
    const data = this.userProfile();
    this.submittedData.set(data);
    console.log('Form submitted successfully:', data);
  }
}

