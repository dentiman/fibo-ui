import {Component, signal} from '@angular/core';
import {FiboDialog, Select, SelectItem} from '@fibo-ui/components';
import {PopoverTriggerClick} from '@fibo-ui/cdk';
import {FormExample} from '../form-controls/examples/form-example';
import {FormField, form} from '@angular/forms/signals';

@Component({
  imports: [
    FiboDialog,
    PopoverTriggerClick,
    FormExample,
    Select,
    FormField
  ],
  template: `
    <div class="flex gap-4 p-8">

      <!-- Basic dialog with select -->
      <button class="btn" fiboPopoverTriggerClick [contentTemplate]="dialogTpl">Open Dialog</button>
      <ng-template #dialogTpl let-trigger>
        <fibo-dialog [(isOpen)]="trigger.isOpen">
          <div class="p-6 w-96">
            <h2 class="text-lg font-semibold mb-4">Dialog with Select</h2>
            <fibo-select
              [formField]="myForm.country"
              label="Country"
              placeholder="Select a country"
              [items]="countries"
            />
            <div class="mt-4">
              <button class="btn" (click)="trigger.close()">Close</button>
            </div>
          </div>
        </fibo-dialog>
      </ng-template>

      <!-- Dialog with form -->
      <button class="btn" fiboPopoverTriggerClick [contentTemplate]="formDialogTpl">Dialog with Form</button>
      <ng-template #formDialogTpl let-trigger>
        <fibo-dialog [(isOpen)]="trigger.isOpen">
          <div class="overflow-hidden overflow-y-auto">
            <form-example />
          </div>
        </fibo-dialog>
      </ng-template>

      <!-- Nested dialogs -->
      <button class="btn" fiboPopoverTriggerClick [contentTemplate]="nestedTpl">Nested Dialogs</button>
      <ng-template #nestedTpl let-trigger>
        <fibo-dialog [(isOpen)]="trigger.isOpen">
          <div class="p-6">
            <h2 class="text-lg font-semibold mb-4">First Dialog</h2>
            <p class="mb-4">Click below to open a second dialog on top.</p>

            <button class="btn" fiboPopoverTriggerClick [contentTemplate]="nestedTpl2">Open Second Dialog</button>
            <ng-template #nestedTpl2 let-trigger2>
              <fibo-dialog [(isOpen)]="trigger2.isOpen">
                <div class="p-6">
                  <h2 class="text-lg font-semibold mb-4">Second Dialog</h2>
                  <p class="mb-4">This is stacked on top of the first dialog.</p>
                  <button class="btn" (click)="trigger2.close()">Close</button>
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
    {label: 'Argentina', value: 'ar'},
    {label: 'Australia', value: 'au'},
    {label: 'Brazil', value: 'br'},
    {label: 'Canada', value: 'ca'},
    {label: 'China', value: 'cn'},
    {label: 'France', value: 'fr'},
    {label: 'Germany', value: 'de'},
    {label: 'India', value: 'in'},
    {label: 'Italy', value: 'it'},
    {label: 'Japan', value: 'jp'},
    {label: 'Mexico', value: 'mx'},
    {label: 'South Korea', value: 'kr'},
    {label: 'Spain', value: 'es'},
    {label: 'United Kingdom', value: 'gb'},
    {label: 'United States', value: 'us'},
  ];

  readonly data = signal({country: null as string | null});
  readonly myForm = form(this.data);
}
