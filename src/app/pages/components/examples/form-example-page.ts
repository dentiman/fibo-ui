import { Component, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required } from '@angular/forms/signals';
import { Calendar } from '@fibo-ui/components';
import {
  SelectDate,
  DataList,
  DataListItem,
  Popover,
  PopoverTriggerClick,
  PortalContent,
  SelectOne,
  SelectMulti,
  safeProp, FormFieldDirective, FormFieldTrigger
} from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';
import { Checkbox } from '@fibo-ui/components';
import {FormsModule} from '@angular/forms';

interface UserProfile {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  website: string;
  city: string;
  userRole: string;
  country: string;
  skills: string[];
  birthDate: string;
}

@Component({
  selector: 'app-form-example-page',
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    FormFieldDirective,
    DataList,
    Popover,
    PortalContent,
    PopoverTriggerClick,
    SelectOne,
    SelectMulti,
    DataListItem,
    LucideAngularModule,
    Checkbox,
    Calendar,
    SelectDate,
    FormFieldTrigger,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto p-4 w-[350px]">
      <h1 class="text-2xl font-bold mb-4">Form Example</h1>
      <form class="space-y-5" (ngSubmit)="onSubmit()">
        <!-- Username and First Name -->
        <div class="flex gap-3">
          <div fiboFormField class="form-field-control flex items-center gap-2 flex-1">
            <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
              <label class="form-field-label mt-1">Name</label>
              <input [formField]="userProfileForm.username" type="text" placeholder="Name" class="text-field-input"/>
            </div>
          </div>

          <div fiboFormField class="form-field-control flex items-center gap-2 flex-1">
            <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
              <label class="form-field-label mt-1">First Name</label>
              <input [formField]="userProfileForm.firstName" type="text" placeholder="First name"
                     class="text-field-input"/>
            </div>
          </div>
        </div>

        <button type="button" fiboFormFieldTrigger #cityTrigger="PopoverTrigger"
                [formField]="userProfileForm.city"
                class="w-full form-field-control flex items-center gap-2 text-left">
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">City</label>
            @let city = userProfile().city;
            <div class="text-sm" [class.from-field-placeholder]="!city">{{ city || 'Select City' }}</div>
          </div>
          <lucide-icon name="chevron-down" size="16"
                       class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>

          <ng-template fiboPortalContent [(isOpen)]="cityTrigger.isOpen">
            <div fiboPopover [trigger]="cityTrigger" [matchWidth]="true"
                 fiboDataList (itemTriggered)="cityTrigger.close()"
                 fiboSelectOne [(value)]="userProfileForm.city().value"
                 class="popover-container">
              @for (c of cities; track c.value) {
                <a fiboDataListItem [value]="c.value" class="datalist-item">
                  <span class="block truncate font-normal">{{ c.label }}</span>
                </a>
              }
            </div>
          </ng-template>
        </button>


        <button type="button" fiboFormFieldTrigger #roleTrigger="PopoverTrigger"
                [formField]="userProfileForm.userRole"
                class="w-full form-field-control flex items-center gap-2 text-left">
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">User Role</label>
            @let role = userProfile().userRole;
            <div class="text-sm" [class.from-field-placeholder]="!role">{{ role || 'Select Role' }}</div>
          </div>
          <lucide-icon name="chevron-down" size="16"
                       class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>

          <ng-template fiboPortalContent [(isOpen)]="roleTrigger.isOpen">
            <div fiboPopover [trigger]="roleTrigger" [matchWidth]="true"
                 fiboDataList (itemTriggered)="roleTrigger.close()"
                 fiboSelectOne [(value)]="userProfileForm.userRole().value"
                 class="popover-container">
              @for (role of userRoles; track role) {
                <a fiboDataListItem [value]="role"
                   class="datalist-item">
                  <span class="block truncate font-normal">{{ role }}</span>
                </a>
              }
            </div>
          </ng-template>
        </button>

        <!-- Email -->
        <div fiboFormField class="form-field-control flex items-center gap-2">
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">Email</label>
            <input [formField]="userProfileForm.email" type="email" placeholder="Enter email address"
                   class="text-field-input"/>
          </div>
        </div>

        <!-- Password -->
        <div fiboFormField class="form-field-control flex items-center gap-2">
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">Password</label>
            <input [formField]="userProfileForm.password" type="password" placeholder="Enter password"
                   class="text-field-input"/>
          </div>
        </div>

        <!-- Confirm Password -->
        <div fiboFormField class="form-field-control flex items-center gap-2">
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">Confirm Password</label>
            <input [formField]="userProfileForm.confirmPassword" type="password" placeholder="Confirm your password"
                   class="text-field-input"/>
          </div>
        </div>


        <!-- Age -->
        <div fiboFormField class="form-field-control flex items-center gap-2">
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">Age</label>
            <input [formField]="userProfileForm.age" type="number" placeholder="Enter your age"
                   class="text-field-input"/>
          </div>
        </div>

        <!-- Birth Date -->
        <div fiboFormField fiboPopoverTriggerClick #dateTrigger="PopoverTrigger"
             class="form-field-control flex items-center gap-2">
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">Birth Date</label>
            <input
              type="text"
              [formField]="userProfileForm.birthDate"
              placeholder="YYYY-MM-DD"
              class="text-field-input"/>
          </div>
          <lucide-icon name="calendar-days" size="16"
                       class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>
          <ng-template fiboPortalContent [(isOpen)]="dateTrigger.isOpen">
            <fibo-calendar fiboPopover [trigger]="dateTrigger"
                           fiboSelectDate [(value)]="userProfileForm.birthDate().value"
                           (itemTriggered)="dateTrigger.close()"
                           class="popover-container"/>
          </ng-template>
        </div>

        <!-- Website -->
        <div fiboFormField class="form-field-control flex items-center gap-2">
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">Website</label>
            <input [formField]="userProfileForm.website" type="url" placeholder="Enter website URL"
                   class="text-field-input"/>
          </div>
        </div>


        <!-- Skills (multiple) -->
        <button type="button" fiboFormFieldTrigger #skillsTrigger="PopoverTrigger"
                [formField]="userProfileForm.skills"
                class="w-full form-field-control flex items-center gap-2 text-left">
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">Skills</label>
            <span class="w-full flex flex-wrap gap-x-1 gap-y-1">
              @for (value of userProfile().skills; track value) {
                <div class="flex items-center gap-1 btn btn-sm">
                  <span class="truncate flex-1 text-xs font-medium">{{ value }}</span>
                  <button type="button"
                          class="rounded-full cursor-pointer flex-shrink-0 btn-text"
                          (click)="removeSkill(value); $event.stopPropagation()"
                          (keydown)="$event.stopPropagation()">
                    <lucide-icon name="x" size="14"></lucide-icon>
                  </button>
                </div>
              }
              @if (userProfile().skills.length === 0) {
                <div class="from-field-placeholder text-sm">Select Skills</div>
              }
            </span>
          </div>
          <lucide-icon name="chevron-down" size="16"
                       class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>
          <ng-template fiboPortalContent [(isOpen)]="skillsTrigger.isOpen">
            <div fiboPopover [trigger]="skillsTrigger" [matchWidth]="true"
                 fiboDataList
                 fiboSelectMulti [(value)]="userProfileForm.skills().value"
                 class="popover-container">
              @if (skills.length === 0) {
                <div class="w-full text-gray-400 text-sm px-3 py-2">No items found</div>
              }
              @for (item of skills; track getSkillValue(item)) {
                <a fiboDataListItem [value]="getSkillValue(item)" #option="DataListItem"
                   class="datalist-item items-center">
                  <fibo-checkbox
                    [checked]="option.isSelected()">{{ getSkillLabel(item) }}
                  </fibo-checkbox>
                </a>
              }
            </div>
          </ng-template>
        </button>


        <!-- Phone -->
        <div fiboFormField class="form-field-control flex items-center gap-2">
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">Phone Number</label>
            <input [formField]="userProfileForm.phone" type="tel" placeholder="Enter phone number"
                   class="text-field-input"/>
          </div>
        </div>


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
export class FormExamplePageComponent {
  userProfile = signal<UserProfile>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    age: 0,
    phone: '',
    website: '',
    city: 'london',
    userRole: '',
    country: '',
    skills: [],
    birthDate: ''
  });

  userProfileForm = form(this.userProfile, (patch) => {
    required(patch.username)
  })

  submittedData = signal<UserProfile | null>(null);

  cities = [
    { label: 'New York', value: 'new-york' },
    { label: 'London', value: 'london' },
    { label: 'Paris', value: 'paris' },
    { label: 'Tokyo', value: 'tokyo' },
    { label: 'Berlin', value: 'berlin' },
    { label: 'Rome', value: 'rome' }
  ];

  userRoles = ['admin', 'user', 'guest'];

  countries = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'France', value: 'fr' },
    { label: 'Germany', value: 'de' },
    { label: 'Italy', value: 'it' },
    { label: 'Japan', value: 'jp' },
    { label: 'Canada', value: 'ca' },
    { label: 'Australia', value: 'au' }
  ];

  skills = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C#', value: 'csharp' },
    { label: 'PHP', value: 'php' },
    { label: 'Ruby', value: 'ruby' },
    { label: 'Go', value: 'go' }
  ];

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

  getSkillValue(item: { label: string; value: string }): string {
    return safeProp(item, 'value');
  }

  getSkillLabel(item: { label: string; value: string }): string {
    return String(safeProp(item, 'label'));
  }

  selectedSkill(value: string): { label: string; value: string } | undefined {
    return this.skills.find(item => this.getSkillValue(item) === value);
  }

  removeSkill(value: string) {
    const currentValue = this.userProfileForm.skills().value();
    if (!currentValue) return;
    this.userProfileForm.skills().value.set(currentValue.filter((v: string) => v !== value));
  }

  capitalizeFirst(str: string | null): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}
