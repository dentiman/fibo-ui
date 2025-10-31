import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {Datepicker, Input, MultipleSelect, Select} from '@fibo-ui/components';
import { FormControlAppendDirective, FormControlPrependDirective } from '@fibo-ui/cdk';
import { User, usersChoices } from '../../common/form-data-example';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Select, FormControlAppendDirective, FormControlPrependDirective, Input, Datepicker, MultipleSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-8">
      <!-- Top Row: Primary Controls -->
      <div class="flex flex-row justify-start space-x-1">
        <fibo-select
          controlClass="rounded-full inline-block "
          popoverClass="w-60"
          [popoverFullWidth]="false"
          [formControl]="userCtrl"
          [items]="items()"
          appearance="secondary"
          [placeholder]="'Any'">
          <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">User:</span>
        </fibo-select>

        <fibo-input
          controlClass="rounded-full inline-block w-60 "
          [(value)]="search"
          [placeholder]="'search...'">
          <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">Username:</span>
        </fibo-input>

        <fibo-datepicker
          controlClass="rounded-full inline-block w-60 "
          [placeholder]="'Any'">
          <span *fiboFormControlPrepend class="text-sm text-foreground-secondary text-nowrap">Created After:</span>
        </fibo-datepicker>

        <fibo-multiple-select
          controlClass="rounded-full inline-block "
          popoverClass="w-60"
          [popoverFullWidth]="false"
          [items]="items()"
          appearance="secondary"
          [placeholder]="'Any'">
          <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">Users:</span>
        </fibo-multiple-select>

        <fibo-select
          controlClass="rounded-full inline-block "
          popoverClass="w-60"
          [popoverFullWidth]="false"
          [(value)]="standaloneSelect"
          [items]="items()"
          [resetCallback]="resetStandaloneSelect"
          appearance="secondary"
          [placeholder]="'Select without form control'">
          <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">Standalone:</span>
        </fibo-select>
      </div>

      <!-- Second Row: More Examples -->
      <div class="flex flex-row justify-start space-x-1">
        <fibo-input
          controlClass="rounded-full inline-block w-60 "
          [(value)]="standaloneInput"
          type="text"
          [placeholder]="'Enter text...'">
          <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">Text:</span>
        </fibo-input>

        <fibo-input
          controlClass="rounded-full inline-block w-60 "
          [formControl]="emailCtrl"
          type="email"
          [placeholder]="'email@example.com'">
          <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">Email:</span>
        </fibo-input>

        <fibo-input
          controlClass="rounded-full inline-block w-60 "
          [formControl]="ageCtrl"
          type="number"
          [placeholder]="'Enter age'">
          <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">Age:</span>
        </fibo-input>
      </div>

      <!-- Third Row: Status and Category -->
      <div class="flex flex-row justify-start space-x-1">
        <div class="overflow-hidden rounded-lg border-2 border-dashed border-border p-4">
          <div class="text-xs text-foreground-secondary mb-2">Container with overflow-hidden:</div>
          <fibo-select
            controlClass="rounded-full inline-block w-60 "
            popoverClass="w-60"
            [popoverFullWidth]="false"
            [(value)]="statusSelect"
            [items]="statusItems"
            appearance="secondary"
            [placeholder]="'Select status'">
            <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">Status:</span>
          </fibo-select>
        </div>

        <fibo-select
          controlClass="rounded-full inline-block w-60 "
          popoverClass="w-60"
          [popoverFullWidth]="false"
          [(value)]="categorySelect"
          [items]="categoryItems"
          appearance="secondary"
          [placeholder]="'Select category'">
          <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">Category:</span>
        </fibo-select>
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

  readonly search = signal('');
  readonly standaloneSelect = signal<number | null>(null);
  readonly standaloneInput = signal('');
  readonly emailCtrl = new FormControl<string>('');
  readonly ageCtrl = new FormControl<number | null>(null);
  readonly statusSelect = signal<string | null>(null);
  readonly categorySelect = signal<string | null>(null);

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

}
