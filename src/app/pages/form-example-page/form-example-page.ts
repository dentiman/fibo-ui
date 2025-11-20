import {Component, signal, ChangeDetectionStrategy, effect} from '@angular/core';
import {CommonModule} from '@angular/common';
import {disabled, Field, form, required} from '@angular/forms/signals';
import {FormField, Calendar, CalendarDateSelectionModel} from '@fibo-ui/components';
import {
  DataList,
  FormFieldContent, ListItem,
  Popover, PopoverTrigger,
  PopoverTriggerClick,
  PortalTemplateDirective,
  SingleSelectionModel,
  MultipleSelectionModel,
  safeProp
} from '@fibo-ui/cdk';
import {LucideAngularModule} from 'lucide-angular';
import {Checkbox} from '@fibo-ui/components';

interface UserProfile {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  age: number | null;
  phone: string;
  website: string;
  city: string | null;
  country: string;
  skills: string[];
  birthDate: string | null;
}

@Component({
  selector: 'app-form-example-page',
  standalone: true,
  imports: [
    CommonModule,
    Field,
    FormField,
    FormFieldContent,
    DataList,
    Popover,
    PortalTemplateDirective,
    PopoverTriggerClick,
    SingleSelectionModel,
    MultipleSelectionModel,
    ListItem,
    PopoverTrigger,
    LucideAngularModule,
    Checkbox,
    Calendar,
    CalendarDateSelectionModel
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto p-4 w-[350px]">
      <h1 class="text-2xl font-bold mb-4">Form Example</h1>
      <form  class="space-y-5">
        <!-- Username -->

          <fibo-form-field [field]="userProfileForm.username" label="Username">
            <input
              fiboFormFieldContent
              name="username"
              [field]="userProfileForm.username"
              placeholder="Enter username"
              class="w-full appearance-none outline-none text-sm   focus:outline-0"  />
          </fibo-form-field>

        <!-- City -->
          <!-- Single  Select          //-->
          <fibo-form-field fiboPopoverTriggerClick #trigger="PopoverTrigger"
                           [field]="userProfileForm.city"
                           label="City" appendIcon="chevron-down"
                           placeholder="placeholder"
          >
            @if( userProfile().city ; as city) {  {{city}}  } @else {
              <div class="from-field-placeholder text-sm">Select City</div>
            }

            <ng-template fiboPortalTemplate  [(isOpen)]="trigger.isOpen">
              <div fiboPopover
                   fiboDataList
                   class="fibo-popover py-1 px-1 rounded-md"
                   [popoverTrigger]="trigger"
                   [popoverFullWidth]="true"
                   [(SingleSelectionModel)]="userProfileForm.city().value"
                   (optionTriggered)="trigger.close()"
              >
                <div class="max-h-70 overflow-y-auto fibo-scrollbar">
                  @for (c of cities; track c.value) {
                    <a [fiboListItemValue]="c.value"
                       class="datalist-item py-1 px-2 rounded-md relative group text-sm">
                      <span class="block truncate font-normal">{{ c.label }}</span>
                    </a>
                  }
                </div>
              </div>
            </ng-template>
          </fibo-form-field>


        <!-- Email -->
        <label class="block">
          <span class="block mb-1">Email</span>
          <fibo-form-field [field]="userProfileForm.email" fixedLabel="Email">
            <input
              fiboFormFieldContent
              name="email"
              type="email"
              [field]="userProfileForm.email"
              placeholder="Enter email address"
              class="w-full appearance-none outline-none text-sm focus:outline-0" />
          </fibo-form-field>
        </label>

        <!-- Password -->
        <label class="block">
          <span class="block mb-1">Password</span>
          <fibo-form-field [field]="userProfileForm.password" label="Password">
            <input
              fiboFormFieldContent
              name="password"
              type="password"
              [field]="userProfileForm.password"
              placeholder="Enter password"
              class="w-full appearance-none outline-none text-sm focus:outline-0" />
          </fibo-form-field>
        </label>

        <!-- Confirm Password -->
        <label class="block">
          <span class="block mb-1">Confirm Password</span>
          <fibo-form-field [field]="userProfileForm.confirmPassword" label="Confirm Password">
            <input
              fiboFormFieldContent
              name="confirmPassword"
              type="password"
              [field]="userProfileForm.confirmPassword"
              placeholder="Confirm your password"
              class="w-full appearance-none outline-none text-sm focus:outline-0" />
          </fibo-form-field>
        </label>

        <!-- First Name -->
        <label class="block">
          <span class="block mb-1">First Name</span>
          <fibo-form-field [field]="userProfileForm.firstName" label="First Name">
            <input
              fiboFormFieldContent
              name="firstName"
              [field]="userProfileForm.firstName"
              placeholder="Enter first name"
              class="w-full appearance-none outline-none text-sm focus:outline-0" />
          </fibo-form-field>
        </label>

        <!-- Last Name -->
        <label class="block">
          <span class="block mb-1">Last Name</span>
          <fibo-form-field [field]="userProfileForm.lastName" label="Last Name">
            <input
              fiboFormFieldContent
              name="lastName"
              [field]="userProfileForm.lastName"
              placeholder="Enter last name"
              class="w-full appearance-none outline-none text-sm focus:outline-0" />
          </fibo-form-field>
        </label>

        <!-- Age -->
        <label class="block">
          <span class="block mb-1">Age</span>
          <fibo-form-field [field]="userProfileForm.age" label="Age">
            <input
              fiboFormFieldContent
              name="age"
              type="number"
              [field]="userProfileForm.age"
              placeholder="Enter your age"
              class="w-full appearance-none outline-none text-sm focus:outline-0" />
          </fibo-form-field>
        </label>

        <!-- Birth Date -->
        <fibo-form-field
          fiboPopoverTrigger
          #dateTrigger="PopoverTrigger"
          [field]="userProfileForm.birthDate"
          label="Birth Date"
          appendIcon="calendar-days">
          <input
            fiboFormFieldContent
            name="birthDate"
            type="text"
            [field]="userProfileForm.birthDate"
            placeholder="YYYY-MM-DD"
            (focus)="dateTrigger.open()"
            class="w-full appearance-none outline-none text-sm focus:outline-0" />
          <ng-template fiboPortalTemplate [(isOpen)]="dateTrigger.isOpen">
            <fibo-calendar
              fiboPopover
              [popoverTrigger]="dateTrigger"
              class="fibo-popover rounded-md"
              [(fiboCalendarDateSelectionModel)]="userProfileForm.birthDate().value"
              (optionTriggered)="dateTrigger.close()"
            />
          </ng-template>
        </fibo-form-field>

        <!-- Website -->
        <label class="block">
          <span class="block mb-1">Website</span>
          <fibo-form-field [field]="userProfileForm.website" label="Website">
            <input
              fiboFormFieldContent
              name="website"
              type="url"
              [field]="userProfileForm.website"
              placeholder="Enter website URL"
              class="w-full appearance-none outline-none text-sm focus:outline-0" />
          </fibo-form-field>
        </label>



        <!-- Skills (multiple) -->
          <fibo-form-field fiboPopoverTriggerClick #skillsTrigger="PopoverTrigger" [field]="userProfileForm.skills" label="Skills" appendIcon="chevron-down">
            <span class="w-full flex flex-wrap gap-x-1 gap-y-1">
              @for (value of userProfile().skills; track value) {
                <div class="flex items-center gap-1 btn btn-sm" >
                  <span class="truncate flex-1 text-xs font-medium">{{ value }}</span>
                  <button type="button"
                    class="rounded-full cursor-pointer flex-shrink-0 btn-text"
                    (click)="removeSkill(value); $event.stopPropagation()"
                    (keydown)="$event.stopPropagation()">
                    <lucide-icon name="x" size="14"></lucide-icon>
                  </button>
                </div>
              }
            </span>
            <ng-template fiboPortalTemplate [(isOpen)]="skillsTrigger.isOpen">
              <div fiboPopover
                   fiboDataList
                   class="fibo-popover py-1 px-1 rounded-md"
                   [popoverTrigger]="skillsTrigger"
                   [popoverFullWidth]="true"
                   [(MultipleSelectionModel)]="userProfileForm.skills().value"
              >
                <div class="max-h-70 overflow-y-auto ">
                  @if (skills.length === 0) {
                    <div class="w-full text-gray-400 text-sm px-3 py-2">No items found</div>
                  }
                  @for (item of skills; track getSkillValue(item)) {
                    <a [fiboListItemValue]="getSkillValue(item)" #option="ListItem"
                       class="datalist-item py-1 px-2 rounded-md relative group text-sm items-center">
                      <fibo-checkbox
                        [checked]="option.isSelected()">{{ getSkillLabel(item) }}
                      </fibo-checkbox>
                    </a>
                  }
                </div>
              </div>
            </ng-template>
          </fibo-form-field>


        <!-- Phone -->
        <label class="block">
          <span class="block mb-1">Phone Number</span>
          <fibo-form-field [field]="userProfileForm.phone" label="Phone Number">
            <input
              fiboFormFieldContent
              name="phone"
              type="tel"
              [field]="userProfileForm.phone"
              placeholder="Enter phone number"
              class="w-full appearance-none outline-none text-sm focus:outline-0" />
          </fibo-form-field>
        </label>


        <button type="submit" class="btn btn-primary" [disabled]="!userProfileForm().valid">Submit</button>
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
    age: null,
    phone: '',
    website: '',
    city: 'london',
    country: '',
    skills: [],
    birthDate: null
  });

  userProfileForm = form(this.userProfile, (patch)=>{
    required(patch.username)
  })

  submittedData = signal<UserProfile | null>(null);

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

  getSkillValue(item: {label: string; value: string}): string {
    return safeProp(item, 'value');
  }

  getSkillLabel(item: {label: string; value: string}): string {
    return String(safeProp(item, 'label'));
  }

  selectedSkill(value: string): {label: string; value: string} | undefined {
    return this.skills.find(item => this.getSkillValue(item) === value);
  }

  removeSkill(value: string) {
    const currentValue = this.userProfileForm.skills().value();
    if (!currentValue) return;
    this.userProfileForm.skills().value.set(currentValue.filter((v: string) => v !== value));
  }

}
