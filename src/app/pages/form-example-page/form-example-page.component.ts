import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Datepicker, Input, MultipleSelect, Select} from '@fibo-ui/components';

@Component({
  selector: 'app-form-example-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Input,
    Select,
    MultipleSelect,
    Datepicker
  ],
  template: `
    <div class="container mx-auto p-4 w-[350px]">
      <h1 class="text-2xl font-bold mb-4">Form Example</h1>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
        <!-- Username -->
        <sui-input
          formControlName="username"
          label="Username"
          placeholder="Enter username">
        </sui-input>

        <!-- Email -->
        <sui-input
          formControlName="email"
          label="Email"
          placeholder="Enter email address"
          type="email">
        </sui-input>

        <!-- Password -->
        <sui-input
          formControlName="password"
          label="Password"
          placeholder="Enter password"
          type="password">
        </sui-input>

        <!-- Confirm Password -->
        <sui-input
          formControlName="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          type="password">
        </sui-input>

        <!-- First Name -->
        <sui-input
          formControlName="firstName"
          label="First Name"
          placeholder="Enter first name">
        </sui-input>

        <!-- Last Name -->
        <sui-input
          formControlName="lastName"
          fixedLabel="Last Name"
          placeholder="Enter last name">
        </sui-input>

        <!-- Age -->
        <sui-input
          formControlName="age"
          label="Age"
          placeholder="Enter your age"
          type="number">
        </sui-input>

        <!-- Phone -->
        <sui-input
          formControlName="phone"
          label="Phone Number"
          placeholder="Enter phone number"
          type="tel">
        </sui-input>

        <!-- Website -->
        <sui-input
          formControlName="website"
          label="Website"
          placeholder="Enter website URL"
          type="url">
        </sui-input>

        <!-- City -->
        <sui-select
          formControlName="city"
          fixedLabel="City"
          placeholder="Select city"
          [items]="cities">
        </sui-select>

        <!-- Country -->
        <sui-select
          formControlName="country"
          fixedLabel="Country"
          placeholder="Select country"
          [items]="countries">
        </sui-select>

        <!-- Skills -->
        <sui-multiple-select
          formControlName="skills"
          fixedLabel="Skills"
          placeholder="Select skills"
          [items]="skills">
        </sui-multiple-select>

        <!-- Date of Birth -->
        <sui-datepicker
          formControlName="dateOfBirth"
          fixedLabel="Date of Birth"
          placeholder="Select date of birth">
        </sui-datepicker>

        <!-- Hire Date -->
        <sui-datepicker
          formControlName="hireDate"
          fixedLabel="Hire Date"
          placeholder="Select hire date">
        </sui-datepicker>

        <button
          type="submit"
          class="spacy-button-primary"
          [disabled]="!form.valid">
          Submit
        </button>
      </form>

      <!-- Form Data Display -->
      <div *ngIf="submittedData" class="mt-8 p-4 bg-gray-100 rounded">
        <h2 class="text-xl font-bold mb-2">Submitted Data:</h2>
        <pre class="whitespace-pre-wrap">{{ submittedData | json }}</pre>
      </div>

      <!-- Form Validation Status -->
      <div class="mt-4 p-4 bg-gray-50 rounded">
        <h3 class="text-lg font-semibold mb-2">Form Status:</h3>
        <p><strong>Valid:</strong> {{ form.valid }}</p>
        <p><strong>Dirty:</strong> {{ form.dirty }}</p>
        <p><strong>Touched:</strong> {{ form.touched }}</p>
        <p><strong>Submitted:</strong> {{ submittedData ? 'Yes' : 'No' }}</p>
      </div>
    </div>
  `
})
export class FormExamplePageComponent {
  form: FormGroup;
  submittedData: any = null;

  cities = [
    {label: 'New York', value: 'new-york'},
    {label: 'London', value: 'london'},
    {label: 'Paris', value: 'paris'},
    {label: 'Tokyo', value: 'tokyo'},
    {label: 'Berlin', value: 'berlin'},
    {label: 'Rome', value: 'rome'}
  ];

  countries = [
    {label: 'United States', value: 'us'},
    {label: 'United Kingdom', value: 'uk'},
    {label: 'France', value: 'fr'},
    {label: 'Germany', value: 'de'},
    {label: 'Italy', value: 'it'},
    {label: 'Japan', value: 'jp'},
    {label: 'Canada', value: 'ca'},
    {label: 'Australia', value: 'au'}
  ];

  skills = [
    {label: 'Angular', value: 'angular'},
    {label: 'React', value: 'react'},
    {label: 'Vue', value: 'vue'},
    {label: 'Node.js', value: 'nodejs'},
    {label: 'Python', value: 'python'},
    {label: 'Java', value: 'java'},
    {label: 'C#', value: 'csharp'},
    {label: 'PHP', value: 'php'},
    {label: 'Ruby', value: 'ruby'},
    {label: 'Go', value: 'go'}
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [
        Validators.required
      ]],
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      age: ['', [
        Validators.required,
        Validators.min(18),
        Validators.max(100)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\+?[\d\s\-\(\)]+$/)
      ]],
      website: ['', [
        Validators.pattern(/^https?:\/\/.+/)
      ]],
      city: ['', [
        Validators.required
      ]],
      country: ['', [
        Validators.required
      ]],
      skills: [[]],
      dateOfBirth: ['', [
        Validators.required
      ]],
      hireDate: ['']
    }, {validators: this.passwordMatchValidator});
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({passwordMismatch: true});
      return {passwordMismatch: true};
    }

    if (confirmPassword && confirmPassword.errors && confirmPassword.errors['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.submittedData = this.form.value;
      console.log('Form submitted successfully:', this.form.value);
    } else {
      console.log('Form has validation errors');
      this.markFormGroupTouched();
    }
  }

  // Mark all form controls as touched to trigger validation display
  markFormGroupTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

}
