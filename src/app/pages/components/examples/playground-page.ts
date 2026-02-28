import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Calendar } from '@fibo-ui/components';
import {
  SelectDate,
  DataList,
  FiboInput,
  DataListItem,
  Popover,
  PopoverTriggerClick,
  PortalContent,
  SelectOne,
  SelectMulti,
  FormFieldDirective
} from '@fibo-ui/cdk';
import { User, usersChoices } from '../../../common/form-data-example';
import { LucideAngularModule } from 'lucide-angular';
import { Checkbox } from '@fibo-ui/components';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormFieldDirective,
    FiboInput,
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
    SelectDate
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div class="p-8 space-y-8">
          <!-- Top Row: Primary Controls -->
          <div class="flex flex-row justify-start space-x-1">
              <!-- User Select -->
              <div fiboFormField
                   fiboPopoverTriggerClick
                   class="group content-center form-field-control rounded-full inline-block relative">
                  <span class="form-field-label">User:</span>
                  <span class="text-sm text-nowrap">{{ getSelectedUserLabel() || 'Any' }}</span>
                  <lucide-icon name="chevron-down" size="16"
                               class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 text-foreground-tertiary"></lucide-icon>
                  <ng-template fiboPortalContent let-trigger>
                      <div fiboPopover [trigger]="trigger" [matchWidth]="false"
                           fiboDataList (itemTriggered)="trigger.close()"
                           fiboSelectOne [(value)]="userSelectValue"
                           class="popover-container w-60"
                      >
                              @for (item of items(); track getUserId(item)) {
                                  <a fiboDataListItem [value]="getUserId(item)"
                                     class="datalist-item">
                                      <span class="block truncate font-normal">{{ getUserLabel(item) }}</span>
                                  </a>
                              }
                      </div>
                  </ng-template>
              </div>

              <!-- Search Input -->
              <div fiboFormField
                   class="group content-center form-field-control rounded-full inline-block w-60">
                  <span class="form-field-label">User Search:</span>
                  <input
                          fiboInput
                          type="text"
                          [(ngModel)]="search"
                          [placeholder]="'search...'"
                          class="w-full appearance-none outline-none text-sm focus:outline-0"/>
              </div>

              <!-- Datepicker -->
              <div fiboFormField
                   fiboPopoverTriggerClick
                   class="group content-center form-field-control rounded-full inline-block w-46 relative">
                  <span class="form-field-label">Date:</span>
                  <input
                          fiboInput
                          type="text"
                          [(ngModel)]="createdAfter"
                          [ngModelOptions]="{standalone: true}"
                          [placeholder]="'Any'"
                          class="w-full appearance-none outline-none text-sm focus:outline-0"/>
                  <lucide-icon name="calendar-days" size="16"
                               class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 text-foreground-tertiary"></lucide-icon>
                  <ng-template fiboPortalContent let-trigger>
                      <fibo-calendar fiboPopover [trigger]="trigger"
                                     fiboSelectDate [(value)]="createdAfter"
                                     (itemTriggered)="trigger.close()"
                                     class="popover-container"/>
                  </ng-template>
              </div>

              <!-- Multiple Select Users -->
              <div fiboFormField
                   fiboPopoverTriggerClick
                   class="group content-center form-field-control rounded-full inline-block relative min-w-40">
                  <span class="form-field-label">Users:</span>
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
                  <lucide-icon name="chevron-down" size="16"
                               class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 text-foreground-tertiary"></lucide-icon>
                  <ng-template fiboPortalContent let-trigger>
                      <div fiboPopover [trigger]="trigger" [matchWidth]="false"
                           fiboDataList
                           fiboSelectMulti [(value)]="selectedUsers"
                           class="popover-container w-60"
                      >
                              @for (item of items(); track getUserId(item)) {
                                  <a fiboDataListItem [value]="getUserId(item)" #option="DataListItem"
                                     class="datalist-item items-center">
                                      <fibo-checkbox [checked]="option.isSelected()">{{ getUserLabel(item) }}
                                      </fibo-checkbox>
                                  </a>
                              }
                      </div>
                  </ng-template>
              </div>


          </div>

          <!-- Second Row: More Examples -->
          <div class="flex flex-row justify-start space-x-1">
              <!-- Text Input -->
              <div fiboFormField
                   class="group content-center form-field-control w-60">
                  <input
                          fiboInput
                          type="text"
                          [(ngModel)]="standaloneInput"
                          [ngModelOptions]="{standalone: true}"
                          [placeholder]="'Enter text...'"
                          class="w-full appearance-none outline-none text-sm focus:outline-0"/>
              </div>

              <!-- Email Input -->
              <div fiboFormField
                   class="group content-center form-field-control rounded-full inline-block w-60">
                  <input
                          fiboInput
                          type="email"
                          [formControl]="emailCtrl"
                          [placeholder]="'email@example.com'"
                          class="w-full appearance-none outline-none text-sm focus:outline-0"/>
              </div>

              <!-- Age Input -->
              <div fiboFormField
                   class="group content-center form-field-control rounded-full inline-block w-60">
                  <input
                          fiboInput
                          type="number"
                          [formControl]="ageCtrl"
                          [placeholder]="'Enter age'"
                          class="w-full appearance-none outline-none text-sm focus:outline-0"/>
              </div>
          </div>

          <!-- Third Row: Status and Category -->
          <div class="flex flex-row justify-start space-x-1">
              <div class="overflow-hidden rounded-lg border-2 border-dashed border-border p-4">
                  <div class="text-xs text-foreground-secondary mb-2">Container with overflow-hidden:</div>
                  <div fiboFormField
                       fiboPopoverTriggerClick
                       class="group content-center form-field-control w-60 relative">
                      <span class="form-field-label">Status:</span>
                      <span class="text-sm">{{ getStatusLabel(statusSelect()) || 'Select status' }}</span>
                      <lucide-icon name="chevron-down" size="16"
                                   class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 text-foreground-tertiary"></lucide-icon>
                      <ng-template fiboPortalContent let-trigger>
                          <div fiboPopover [trigger]="trigger" [matchWidth]="false"
                               fiboDataList (itemTriggered)="trigger.close()"
                               fiboSelectOne [(value)]="statusSelect"
                               class="popover-container w-60"
                          >
                                  @for (item of statusItems; track item.value) {
                                      <a fiboDataListItem [value]="item.value"
                                         class="datalist-item">
                                          <span class="block truncate font-normal">{{ item.label }}</span>
                                      </a>
                                  }
                          </div>
                      </ng-template>
                  </div>
              </div>

              <div fiboFormField
                   fiboPopoverTriggerClick
                   class="group content-center form-field-control rounded-full inline-block w-60 relative">
                  <span class="form-field-label">Category:</span>
                  <span class="text-sm">{{ getCategoryLabel(categorySelect()) || 'Select category' }}</span>
                  <lucide-icon name="chevron-down" size="16"
                               class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 text-foreground-tertiary"></lucide-icon>
                  <ng-template fiboPortalContent let-trigger>
                      <div fiboPopover [trigger]="trigger" [matchWidth]="false"
                           fiboDataList (itemTriggered)="trigger.close()"
                           fiboSelectOne [(value)]="categorySelect"
                           class="popover-container w-60"
                      >
                              @for (item of categoryItems; track item.value) {
                                  <a fiboDataListItem [value]="item.value"
                                     class="datalist-item">
                                      <span class="block truncate font-normal">{{ item.label }}</span>
                                  </a>
                              }
                      </div>
                  </ng-template>
              </div>
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
                  <h4 class="text-sm font-medium text-foreground-secondary">position: fixed (absolute in this
                      context)</h4>
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
