import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Calendar, CalendarDateSelectionModel, FormField} from '@fibo-ui/components';
import {
  DataList,
    FiboInput,
  Option,
  Popover,
  PopoverTrigger,
  PopoverTriggerClick,
  PortalContent,
  SelectOne,
  SelectMulti
} from '@fibo-ui/cdk';
import { User, usersChoices } from '../../common/form-data-example';
import {LucideAngularModule} from 'lucide-angular';
import {Checkbox} from '@fibo-ui/components';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormField,
    FiboInput,
    DataList,
    Popover,
    PortalContent,
    PopoverTriggerClick,
    SelectOne,
    SelectMulti,
    Option,
    PopoverTrigger,
    LucideAngularModule,
    Checkbox,
    Calendar,
    CalendarDateSelectionModel
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-8">
      <!-- Top Row: Primary Controls -->
      <div class="flex flex-row justify-start space-x-1">
        <!-- User Select -->
        <fibo-form-field
          fiboPopoverTriggerClick
          #userTrigger="PopoverTrigger"
          [(value)]="userSelectValue"
          appearance="secondary"
          class="rounded-full inline-block"
          appendIcon="chevron-down">
          <span class="prepend text-sm text-foreground-secondary">User:</span>
          <span  class="text-sm text-foreground-secondary text-nowrap">{{ getSelectedUserLabel() || 'Any' }}</span>
          <ng-template fiboPortalContent [(isOpen)]="userTrigger.isOpen">
            <div fiboPopover
                 fiboDataList
                 class="fibo-popover py-1 px-1 rounded-md w-60"
                 [trigger]="userTrigger"
                 [matchWidth]="false"
                 fiboSelectOne [(value)]="userSelectValue"
                 (optionTriggered)="userTrigger.close()">
              <div class="max-h-70 overflow-y-auto fibo-scrollbar">
                @for (item of items(); track getUserId(item)) {
                  <a fiboOption [value]="getUserId(item)"
                     class="datalist-item py-1 px-2 rounded-md relative group text-sm">
                    <span class="block truncate font-normal">{{ getUserLabel(item) }}</span>
                  </a>
                }
              </div>
            </div>
          </ng-template>
        </fibo-form-field>

        <!-- Search Input -->
        <fibo-form-field
          [(value)]="search"
          class="rounded-full inline-block w-60">
          <span class="prepend text-sm text-foreground-secondary text-nowrap">User Serach:</span>
          <input
            fiboInput
            type="text"
            [(ngModel)]="search"
            [placeholder]="'search...'"
            class="w-full appearance-none outline-none text-sm focus:outline-0" />
        </fibo-form-field>

        <!-- Datepicker -->
        <fibo-form-field
          fiboPopoverTriggerClick
          #dateTrigger="PopoverTrigger"
          [(value)]="createdAfter"
          class="rounded-full inline-block w-46"
          appendIcon="calendar-days">
          <span class="prepend text-sm text-foreground-secondary">Date:</span>
          <input
            fiboInput
            type="text"
            [(ngModel)]="createdAfter"
            [ngModelOptions]="{standalone: true}"
            [placeholder]="'Any'"
            (focus)="dateTrigger.open()"
            class="w-full appearance-none outline-none text-sm focus:outline-0" />
          <ng-template fiboPortalContent [(isOpen)]="dateTrigger.isOpen">
            <fibo-calendar
              fiboPopover
              [trigger]="dateTrigger"
              class="fibo-popover rounded-md"
              [(fiboCalendarDateSelectionModel)]="createdAfter"
              (optionTriggered)="dateTrigger.close()"
            />
          </ng-template>
        </fibo-form-field>

        <!-- Multiple Select Users -->
        <fibo-form-field
          fiboPopoverTriggerClick
          #usersTrigger="PopoverTrigger"
          appearance="secondary"
          class="rounded-full inline-block"
          appendIcon="chevron-down">
          <span class="w-full flex flex-wrap gap-x-1 gap-y-1">
            @for (value of selectedUsers(); track value) {
              <div class="flex items-center gap-1 btn btn-sm">
                <span class="truncate flex-1 text-xs font-medium">{{ getUserLabelById(value) }}</span>
                <button type="button"
                  class="rounded-full cursor-pointer flex-shrink-0 btn-text"
                  (click)="removeUser(value); $event.stopPropagation()"
                  (keydown)="$event.stopPropagation()">
                  <lucide-icon name="x" size="14"></lucide-icon>
                </button>
              </div>
            }
            @if (selectedUsers().length === 0) {
              <span class="text-sm text-foreground-tertiary">Any</span>
            }
          </span>
          <ng-template fiboPortalContent [(isOpen)]="usersTrigger.isOpen">
            <div fiboPopover
                 fiboDataList
                 class="fibo-popover py-1 px-1 rounded-md w-60"
                 [trigger]="usersTrigger"
                 [matchWidth]="false"
                 fiboSelectMulti [(value)]="selectedUsers">
              <div class="max-h-70 overflow-y-auto">
                @for (item of items(); track getUserId(item)) {
                  <a fiboOption [value]="getUserId(item)" #option="Option"
                     class="datalist-item py-1 px-2 rounded-md relative group text-sm items-center">
                    <fibo-checkbox [checked]="option.isSelected()">{{ getUserLabel(item) }}</fibo-checkbox>
                  </a>
                }
              </div>
            </div>
          </ng-template>
        </fibo-form-field>


      </div>

      <!-- Second Row: More Examples -->
      <div class="flex flex-row justify-start space-x-1">
        <!-- Text Input -->
        <fibo-form-field
          class="  w-60">
          <input
            fiboInput
            type="text"
            [(ngModel)]="standaloneInput"
            [ngModelOptions]="{standalone: true}"
            [placeholder]="'Enter text...'"
            class="w-full appearance-none outline-none text-sm focus:outline-0" />
        </fibo-form-field>

        <!-- Email Input -->
        <fibo-form-field
          class="rounded-full inline-block w-60">
          <input
            fiboInput
            type="email"
            [formControl]="emailCtrl"
            [placeholder]="'email@example.com'"
            class="w-full appearance-none outline-none text-sm focus:outline-0" />
        </fibo-form-field>

        <!-- Age Input -->
        <fibo-form-field
          class="rounded-full inline-block w-60">
          <input
            fiboInput
            type="number"
            [formControl]="ageCtrl"
            [placeholder]="'Enter age'"
            class="w-full appearance-none outline-none text-sm focus:outline-0" />
        </fibo-form-field>
      </div>

      <!-- Third Row: Status and Category -->
      <div class="flex flex-row justify-start space-x-1">
        <div class="overflow-hidden rounded-lg border-2 border-dashed border-border p-4">
          <div class="text-xs text-foreground-secondary mb-2">Container with overflow-hidden:</div>
          <fibo-form-field
            fiboPopoverTriggerClick
            #statusTrigger="PopoverTrigger"
            [(value)]="statusSelect"
            appearance="secondary"
            class=" w-60"
            appendIcon="chevron-down">
            <span class="text-sm">{{ getStatusLabel(statusSelect()) || 'Select status' }}</span>
            <ng-template fiboPortalContent [(isOpen)]="statusTrigger.isOpen">
              <div fiboPopover
                   fiboDataList
                   class="fibo-popover py-1 px-1 rounded-md w-60"
                   [trigger]="statusTrigger"
                   [matchWidth]="false"
                   fiboSelectOne [(value)]="statusSelect"
                   (optionTriggered)="statusTrigger.close()">
                <div class="max-h-70 overflow-y-auto fibo-scrollbar">
                  @for (item of statusItems; track item.value) {
                    <a fiboOption [value]="item.value"
                       class="datalist-item py-1 px-2 rounded-md relative group text-sm">
                      <span class="block truncate font-normal">{{ item.label }}</span>
                    </a>
                  }
                </div>
              </div>
            </ng-template>
          </fibo-form-field>
        </div>

        <fibo-form-field
          fiboPopoverTriggerClick
          #categoryTrigger="PopoverTrigger"
          appearance="secondary"
          class="rounded-full inline-block w-60"
          appendIcon="chevron-down">
          <span class="text-sm">{{ getCategoryLabel(categorySelect()) || 'Select category' }}</span>
          <ng-template fiboPortalContent [(isOpen)]="categoryTrigger.isOpen">
            <div fiboPopover
                 fiboDataList
                 class="fibo-popover py-1 px-1 rounded-md w-60"
                 [trigger]="categoryTrigger"
                 [matchWidth]="false"
                 fiboSelectOne [(value)]="categorySelect"
                 (optionTriggered)="categoryTrigger.close()">
              <div class="max-h-70 overflow-y-auto fibo-scrollbar">
                @for (item of categoryItems; track item.value) {
                  <a fiboOption [value]="item.value"
                     class="datalist-item py-1 px-2 rounded-md relative group text-sm">
                    <span class="block truncate font-normal">{{ item.label }}</span>
                  </a>
                }
              </div>
            </div>
          </ng-template>
        </fibo-form-field>
      </div>

      <!-- Positioning Examples Section -->
      <div class="space-y-6">
        <h3 class="text-xl font-semibold text-foreground">Positioning Examples</h3>

        <!-- Relative Positioning -->
        <div class="relative h-48 bg-surface-secondary rounded-lg p-4 border border-border">
          <h4 class="text-sm font-medium text-foreground-secondary mb-2">position: relative</h4>
          <div class="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
            Top Right
          </div>
          <div class="absolute bottom-4 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
            Bottom Left
          </div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm">
            Center
          </div>
        </div>

        <!-- Fixed Positioning -->
        <div class="h-48 bg-surface-secondary rounded-lg p-4 border border-border flex items-center justify-center">
          <div class="fixed top-20 right-8 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm z-10">
            Fixed Top Right
          </div>
          <h4 class="text-sm font-medium text-foreground-secondary">position: fixed (absolute in this context)</h4>
        </div>

        <!-- Sticky Positioning -->
        <div class="h-64 bg-surface-secondary rounded-lg overflow-auto border border-border">
          <h4 class="text-sm font-medium text-foreground-secondary mb-2 sticky top-0 bg-surface-secondary p-2 z-10 border-b border-border">
            Sticky Header
          </h4>
          @for (item of listItems; track item) {
            <div class="p-2 text-sm text-foreground-secondary border-b border-border">
              Item {{ item }}
            </div>
          }
        </div>
      </div>
    </div>
  `,

})
export class PlaygroundPageComponent {
  readonly items = signal<User[]>([...usersChoices]);
  readonly userCtrl = new FormControl<number | null>(null);
  readonly userSelectValue = signal<number | null>(null);

  readonly search = signal('');
  readonly standaloneSelect = signal<number | null>(null);
  readonly standaloneInput = signal('');
  readonly emailCtrl = new FormControl<string>('');
  readonly ageCtrl = new FormControl<number | null>(null);
  readonly statusSelect = signal<string | null>(null);
  readonly categorySelect = signal<string | null>(null);
  readonly createdAfter = signal<string | null>(null);
  readonly selectedUsers = signal<number[]>([]);

  constructor() {
    // Sync FormControl with signal (bidirectional)
    this.userCtrl.valueChanges.subscribe(value => {
      if (this.userSelectValue() !== value) {
        this.userSelectValue.set(value);
      }
    });
    // Sync signal to FormControl
    effect(() => {
      const value = this.userSelectValue();
      if (this.userCtrl.value !== value) {
        this.userCtrl.setValue(value, { emitEvent: false });
      }
    });
    // Initial sync
    this.userSelectValue.set(this.userCtrl.value);
  }

  readonly statusItems = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'archived', label: 'Archived' }
  ];

  readonly categoryItems = [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' }
  ];

  readonly listItems = Array.from({ length: 20 }, (_, i) => i + 1);

  resetStandaloneSelect = () => {
    this.standaloneSelect.set(null);
  }

  getUserId(user: User): number {
    return user.id;
  }

  getUserLabel(user: User): string {
    return user.name;
  }

  getSelectedUserLabel(): string | null {
    const userId = this.userSelectValue();
    if (!userId) return null;
    const user = this.items().find(u => u.id === userId);
    return user ? user.name : null;
  }

  getUserLabelById(userId: number): string {
    const user = this.items().find(u => u.id === userId);
    return user ? user.name : String(userId);
  }

  getSelectedUserLabelById(userId: number | null): string | null {
    if (!userId) return null;
    return this.getUserLabelById(userId);
  }

  removeUser(userId: number) {
    const current = this.selectedUsers();
    this.selectedUsers.set(current.filter(id => id !== userId));
  }

  getStatusLabel(value: string | null): string | null {
    if (!value) return null;
    const item = this.statusItems.find(i => i.value === value);
    return item ? item.label : null;
  }

  getCategoryLabel(value: string | null): string | null {
    if (!value) return null;
    const item = this.categoryItems.find(i => i.value === value);
    return item ? item.label : null;
  }

}
