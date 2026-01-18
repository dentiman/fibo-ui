import { Component, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required } from '@angular/forms/signals';
import { TextField } from '@fibo-ui/components';
import { FormFieldDirective } from '@fibo-ui/cdk';

interface UserProfile {
  firstName: string;
}

@Component({
  selector: 'app-components-fields-form',
  standalone: true,
  imports: [
    CommonModule,
    TextField,
    FormField
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto p-4 w-[350px]">
      <h1 class="text-2xl font-bold mb-4">Form Example</h1>
      <form class="space-y-5">
        
        <fibo-text-field 
            label="First Name" 
            placeholder="Name"
            [formField]="userProfileForm.firstName">
        </fibo-text-field>

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
  });

  userProfileForm = form(this.userProfile, (patch) => {
    required(patch.firstName)
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

