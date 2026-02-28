import { Component, signal } from '@angular/core';
import {FiboDialog, Select, SelectItem, Tooltip} from '@fibo-ui/components';
import { PopoverTriggerClick } from '@fibo-ui/cdk';
import { FormExample } from '../form-controls/examples/form-example';
import { FormField, form } from '@angular/forms/signals';

@Component({
  imports: [FiboDialog, PopoverTriggerClick, FormExample, Select, FormField, Tooltip],
  template: `
    <div class="flex gap-4 p-8">

      <!-- Basic dialog with select -->
      <button class="btn" fiboPopoverTriggerClick overlayCategory="dialog" [content]="dialogTpl">
        Open Dialog
      </button>
      <ng-template #dialogTpl>
        <fibo-dialog>
          <div class="p-6 w-96">
            <h2 class="text-lg font-semibold mb-4">Dialog with Select</h2>
            <fibo-select
              [fiboTooltip]="'Some text'"
              [formField]="myForm.country"
              label="Country"
              placeholder="Select a country"
              [items]="countries"
            />
          </div>
        </fibo-dialog>
      </ng-template>

      <!-- Dialog with form -->
      <button class="btn" fiboPopoverTriggerClick overlayCategory="dialog" [content]="formDialogTpl">
        Dialog with Form
      </button>
      <ng-template #formDialogTpl>
        <fibo-dialog>
          <div class="overflow-hidden overflow-y-auto">
            <form-example />
          </div>
        </fibo-dialog>
      </ng-template>

      <!-- Nested dialogs -->
      <button class="btn" fiboPopoverTriggerClick overlayCategory="dialog" [content]="nestedTpl">
        Nested Dialogs
      </button>
      <ng-template #nestedTpl>
        <fibo-dialog>
          <div class="p-6">
            <h2 class="text-lg font-semibold mb-4">First Dialog</h2>
            <p class="mb-4">Click below to open a second dialog on top.</p>

            <button class="btn" fiboPopoverTriggerClick overlayCategory="dialog" [content]="nestedTpl2">
              Open Second Dialog
            </button>
            <ng-template #nestedTpl2>
              <fibo-dialog>
                <div class="p-6">
                  <h2 class="text-lg font-semibold mb-4">Second Dialog</h2>
                  <p class="mb-4">This is stacked on top of the first dialog.</p>
                </div>
              </fibo-dialog>
            </ng-template>
          </div>
        </fibo-dialog>
      </ng-template>

    </div>
  `,
})
export class DialogPageComponent {
  readonly countries: SelectItem[] = [
    { label: 'Argentina', value: 'ar' },
    { label: 'Australia', value: 'au' },
    { label: 'Brazil', value: 'br' },
    { label: 'Canada', value: 'ca' },
    { label: 'China', value: 'cn' },
    { label: 'France', value: 'fr' },
    { label: 'Germany', value: 'de' },
    { label: 'India', value: 'in' },
    { label: 'Italy', value: 'it' },
    { label: 'Japan', value: 'jp' },
    { label: 'Mexico', value: 'mx' },
    { label: 'South Korea', value: 'kr' },
    { label: 'Spain', value: 'es' },
    { label: 'United Kingdom', value: 'gb' },
    { label: 'United States', value: 'us' },
  ];

  readonly data = signal({ country: null as string | null });
  readonly myForm = form(this.data);
}
