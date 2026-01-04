import {Component, signal, ChangeDetectionStrategy, effect} from '@angular/core';
import {CommonModule} from '@angular/common';
import {disabled, Field, form, required} from '@angular/forms/signals';
import {Calendar, CalendarDateSelectionModel} from '@fibo-ui/components';
import {
  DataList,
  ListItem,
  Popover, PopoverTrigger,
  PopoverTriggerClick,
  PortalTemplateDirective,
  SingleSelectionModel,
  MultipleSelectionModel,
  safeProp, FormFieldDirective
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
  age: number ;
  phone: string;
  website: string;
  city: string;
  userRole: string ;
  country: string;
  skills: string[];
  birthDate: string;
}

@Component({
  selector: 'app-form-example-page',
  standalone: true,
  imports: [
    CommonModule,
    Field,
    FormFieldDirective,
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

        <div fiboFormField class="group content-center fibo-form-field px-3 py-1 ">
          <label  class="block text-xs fibo-form-field-label">Name</label>
          <input  [field]="userProfileForm.username"  type="text"  placeholder="Name" class="w-full appearance-none outline-none text-sm   focus:outline-0" />
        </div>


        <div fiboFormField class="group content-center fibo-form-field px-3 py-1 relative">
          <label for="name" class="block text-xs fibo-form-field-label">First Name</label>
          <input  [field]="userProfileForm.firstName"  type="text"  placeholder="Name" class="w-full appearance-none outline-none text-sm   focus:outline-0" />
          <div class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 hidden
            cursor-pointer
            group-hover:block
            group-focus-within:block
            rounded-full  text-foreground-tertiary hover:text-foreground">
            <lucide-icon name="X" size="16" class=""></lucide-icon>
          </div>
        </div>

        <button  type="button"  fiboFormField fiboPopoverTriggerClick class="w-full group fibo-form-field px-3 py-1 relative block text-left">
          <input type="hidden"  [field]="userProfileForm.userRole">
          <span class="block text-xs fibo-form-field-label">City</span>
            @if( userProfile().city ; as city) {
             <span class="text-sm">{{city}}</span>
            }
            @else {
              <div class="from-field-placeholder text-sm">Select City</div>
            }
            <ng-template fiboPortalTemplate  let-trigger>
              <div fiboPopover
                   fiboDataList
                   class="fibo-popover py-1 px-1 rounded-md"
                   [trigger]="trigger"
                   [matchWidth]="true"
                   [(fiboSelectOne)]="userProfileForm.city().value"
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
            <lucide-icon name="chevron-down" size="16" class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2   text-foreground-tertiary"></lucide-icon>
        </button>



        <!-- User Role -->
        <button type="button" fiboFormField fiboPopoverTriggerClick   class="w-full group fibo-form-field px-3 py-1 relative block text-left">
          <input type="hidden" [field]="userProfileForm.userRole">
          <label class="block text-xs fibo-form-field-label">User Role</label>
          @let role = userProfile().userRole;
          @if (role) {
            <span class="text-sm">{{ role }}</span>
          }
          @else {
            <div class="from-field-placeholder text-sm">Select Role</div>
          }
          <ng-template fiboPortalTemplate let-trigger>
            <div fiboPopover    [trigger]="trigger" [matchWidth]="true"
                 fiboDataList   (optionTriggered)="trigger.close()"
                 fiboSelectOne  [(value)]="userProfileForm.userRole().value"
                 class="fibo-popover py-1 px-1 rounded-md"
                >
              <div class="max-h-70 overflow-y-auto">
                @for (role of userRoles; track role) {
                  <a [fiboListItemValue]="role"
                     class="datalist-item py-1 px-2 rounded-md relative group text-sm">
                    <span class="block truncate font-normal">{{ role }}</span>
                  </a>
                }
              </div>
            </div>
          </ng-template>
          <div class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2">
            <lucide-icon name="chevron-down" size="16" class="text-foreground-tertiary" ></lucide-icon>
          </div>
        </button>

        <!-- Email -->
        <div fiboFormField class="group content-center fibo-form-field px-3 py-1">
          <label class="block text-xs fibo-form-field-label">Email</label>
          <input [field]="userProfileForm.email" type="email" placeholder="Enter email address" class="w-full appearance-none outline-none text-sm focus:outline-0" />
        </div>

        <!-- Password -->
        <div fiboFormField class="group content-center fibo-form-field px-3 py-1">
          <label class="block text-xs fibo-form-field-label">Password</label>
          <input [field]="userProfileForm.password" type="password" placeholder="Enter password" class="w-full appearance-none outline-none text-sm focus:outline-0" />
        </div>

        <!-- Confirm Password -->
        <div fiboFormField class="group content-center fibo-form-field px-3 py-1">
          <label class="block text-xs fibo-form-field-label">Confirm Password</label>
          <input [field]="userProfileForm.confirmPassword" type="password" placeholder="Confirm your password" class="w-full appearance-none outline-none text-sm focus:outline-0" />
        </div>



        <!-- Age -->
        <div fiboFormField class="group content-center fibo-form-field px-3 py-1">
          <label class="block text-xs fibo-form-field-label">Age</label>
          <input [field]="userProfileForm.age" type="number" placeholder="Enter your age" class="w-full appearance-none outline-none text-sm focus:outline-0" />
        </div>

        <!-- Birth Date -->
        <div fiboFormField fiboPopoverTrigger   class="group content-center fibo-form-field px-3 py-1 relative">
          <label class="block text-xs fibo-form-field-label">Birth Date</label>
          <input
            type="text"
            [field]="userProfileForm.birthDate"
            placeholder="YYYY-MM-DD"
            class="w-full appearance-none outline-none text-sm focus:outline-0" />
          <lucide-icon name="calendar-days" size="16" class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 text-foreground-tertiary"></lucide-icon>
          <ng-template fiboPortalTemplate let-trigger>
            <fibo-calendar
              fiboPopover
              [trigger]="trigger"
              class="fibo-popover rounded-md"
              [(fiboCalendarDateSelectionModel)]="userProfileForm.birthDate().value"
              (optionTriggered)="trigger.close()"
            />
          </ng-template>
        </div>

        <!-- Website -->
        <div fiboFormField class="group content-center fibo-form-field px-3 py-1">
          <label class="block text-xs fibo-form-field-label">Website</label>
          <input [field]="userProfileForm.website" type="url" placeholder="Enter website URL" class="w-full appearance-none outline-none text-sm focus:outline-0" />
        </div>



        <!-- Skills (multiple) -->
        <button type="button" fiboFormField fiboPopoverTriggerClick class="w-full group fibo-form-field px-3 py-1 relative block text-left">
          <label class="block text-xs fibo-form-field-label">Skills</label>
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
          <ng-template fiboPortalTemplate let-trigger>
            <div fiboPopover
                 fiboDataList
                 class="fibo-popover py-1 px-1 rounded-md"
                 [trigger]="trigger"
                 [matchWidth]="true"
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
          <lucide-icon name="chevron-down" size="16" class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 text-foreground-tertiary"></lucide-icon>
        </button>


        <!-- Phone -->
        <div fiboFormField class="group content-center fibo-form-field px-3 py-1">
          <label class="block text-xs fibo-form-field-label">Phone Number</label>
          <input [field]="userProfileForm.phone" type="tel" placeholder="Enter phone number" class="w-full appearance-none outline-none text-sm focus:outline-0" />
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

  userRoles = ['admin', 'user', 'guest'];

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

  capitalizeFirst(str: string | null): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}
