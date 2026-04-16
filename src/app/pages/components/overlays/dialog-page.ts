import { Component, signal } from '@angular/core';
import { Select, SelectItem, Tooltip, Button } from '@fibo-ui/components';
import { DialogTrigger } from '@fibo-ui/cdk';
import { FormExample } from '../form-controls/examples/form-example';
import { FormField, form } from '@angular/forms/signals';

@Component({
  imports: [FormExample, Select, FormField, Tooltip, DialogTrigger, Button],
  template: `
    <div class="flex gap-4 p-8">

      <!-- Basic dialog with select -->
      <button fiboButton fiboDialogTrigger [content]="dialogTpl">
        Open Dialog
      </button>
      <ng-template #dialogTpl let-overlay>
        <div class="p-6 w-96">
          <h2 class="text-lg font-semibold mb-4">Dialog with Select</h2>
          <fibo-select
            [fiboTooltip]="'Some text'"
            [formField]="myForm.country"
            label="Country"
            placeholder="Select a country"
            [items]="countries"
          />
          <div class="mt-4 flex justify-end">
            <button fiboButton (click)="overlay.close()">Close</button>
          </div>
        </div>
      </ng-template>

      <!-- Dialog with form -->
      <button fiboButton fiboDialogTrigger [content]="formDialogTpl">
        Dialog with Form
      </button>
      <ng-template #formDialogTpl let-overlay>
        <div class="overflow-hidden overflow-y-auto">
          <form-example/>
          <div class="p-4 pt-0 flex justify-end">
            <button fiboButton (click)="overlay.close()">Close</button>
          </div>
        </div>
      </ng-template>

      <!-- Nested dialogs -->
      <button fiboButton fiboDialogTrigger [content]="nestedTpl">
        Nested Dialogs
      </button>
      <ng-template #nestedTpl let-overlay>
        <div class="p-6">
          <h2 class="text-lg font-semibold mb-4">First Dialog</h2>
          <p class="mb-4">Click below to open a second dialog on top.</p>

          <button fiboButton fiboDialogTrigger [content]="nestedTpl2">
            Open Second Dialog
          </button>
          <ng-template #nestedTpl2 let-overlay>
            <div class="p-6">
              <h2 class="text-lg font-semibold mb-4">Second Dialog</h2>
              <p class="mb-4">This is stacked on top of the first dialog.</p>
              <div class="mt-4 flex justify-end">
                <button fiboButton (click)="overlay.close()">Close</button>
              </div>
            </div>
          </ng-template>
          <div class="mt-4 flex justify-end">
            <button fiboButton (click)="overlay.close()">Close</button>
          </div>
        </div>
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
