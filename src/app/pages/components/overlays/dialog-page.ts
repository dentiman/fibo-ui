import { Component, ElementRef, TemplateRef, computed, signal, viewChild } from '@angular/core';
import {FiboDialog, Select, SelectItem, Tooltip} from '@fibo-ui/components';
import {
  OverlaySetupContext,
  createOverlay,
  restoreFocusOnBeforeClose,
} from '@fibo-ui/cdk';
import { FormExample } from '../form-controls/examples/form-example';
import { FormField, form } from '@angular/forms/signals';

@Component({
  imports: [FiboDialog, FormExample, Select, FormField, Tooltip],
  template: `
    <div class="flex gap-4 p-8">

      <!-- Basic dialog with select -->
      <button #dialogTrigger class="btn" (click)="basicDialogOpen.set(true)">
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
            <div class="mt-4 flex justify-end">
              <button class="btn" (click)="basicDialogOpen.set(false)">Close</button>
            </div>
          </div>
        </fibo-dialog>
      </ng-template>

      <!-- Dialog with form -->
      <button #formDialogTrigger class="btn" (click)="formDialogOpen.set(true)">
        Dialog with Form
      </button>
      <ng-template #formDialogTpl>
        <fibo-dialog>
          <div class="overflow-hidden overflow-y-auto">
            <form-example />
            <div class="p-4 pt-0 flex justify-end">
              <button class="btn" (click)="formDialogOpen.set(false)">Close</button>
            </div>
          </div>
        </fibo-dialog>
      </ng-template>

      <!-- Nested dialogs -->
      <button #nestedDialogTrigger class="btn" (click)="nestedDialogOpen.set(true)">
        Nested Dialogs
      </button>
      <ng-template #nestedTpl>
        <fibo-dialog>
          <div class="p-6">
            <h2 class="text-lg font-semibold mb-4">First Dialog</h2>
            <p class="mb-4">Click below to open a second dialog on top.</p>

            <button #nestedDialog2Trigger class="btn" (click)="nestedDialog2Open.set(true)">
              Open Second Dialog
            </button>
            <div class="mt-4 flex justify-end">
              <button class="btn" (click)="nestedDialogOpen.set(false)">Close</button>
            </div>
          </div>
        </fibo-dialog>
      </ng-template>

      <ng-template #nestedTpl2>
        <fibo-dialog>
          <div class="p-6">
            <h2 class="text-lg font-semibold mb-4">Second Dialog</h2>
            <p class="mb-4">This is stacked on top of the first dialog.</p>
            <div class="mt-4 flex justify-end">
              <button class="btn" (click)="nestedDialog2Open.set(false)">Close</button>
            </div>
          </div>
        </fibo-dialog>
      </ng-template>

    </div>
  `,
})
export class DialogPageComponent {
  private dialogTemplate = viewChild.required<TemplateRef<any>>('dialogTpl');
  private dialogTrigger = viewChild.required<ElementRef<HTMLElement>>('dialogTrigger');
  private formDialogTemplate = viewChild.required<TemplateRef<any>>('formDialogTpl');
  private formDialogTrigger = viewChild.required<ElementRef<HTMLElement>>('formDialogTrigger');
  private nestedDialogTemplate = viewChild.required<TemplateRef<any>>('nestedTpl');
  private nestedDialogTrigger = viewChild.required<ElementRef<HTMLElement>>('nestedDialogTrigger');
  private nestedDialog2Template = viewChild.required<TemplateRef<any>>('nestedTpl2');
  private nestedDialog2Trigger = viewChild<ElementRef<HTMLElement>>('nestedDialog2Trigger');

  basicDialogOpen = signal(false);
  formDialogOpen = signal(false);
  nestedDialogOpen = signal(false);
  nestedDialog2Open = signal(false);

  private setupDialogOverlay = (overlay: OverlaySetupContext) => {
    restoreFocusOnBeforeClose(overlay);
  };

  private basicDialogConfig = computed(() => ({
    templateRef: this.dialogTemplate(),
    referenceElement: this.dialogTrigger().nativeElement,
    category: 'dialog' as const,
  }));

  private formDialogConfig = computed(() => ({
    templateRef: this.formDialogTemplate(),
    referenceElement: this.formDialogTrigger().nativeElement,
    category: 'dialog' as const,
  }));

  private nestedDialogConfig = computed(() => ({
    templateRef: this.nestedDialogTemplate(),
    referenceElement: this.nestedDialogTrigger().nativeElement,
    category: 'dialog' as const,
  }));

  private nestedDialog2Config = computed(() => ({
    templateRef: this.nestedDialog2Template(),
    referenceElement: this.nestedDialog2Trigger()?.nativeElement ?? null,
    category: 'dialog' as const,
  }));

  basicDialogRef = createOverlay(this.basicDialogOpen, this.basicDialogConfig, this.setupDialogOverlay);
  formDialogRef = createOverlay(this.formDialogOpen, this.formDialogConfig, this.setupDialogOverlay);
  nestedDialogRef = createOverlay(this.nestedDialogOpen, this.nestedDialogConfig, this.setupDialogOverlay);
  nestedDialog2Ref = createOverlay(this.nestedDialog2Open, this.nestedDialog2Config, this.setupDialogOverlay);

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
