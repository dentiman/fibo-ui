import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DataList,
  DataListItem,
  Popover,
  PopoverTrigger,
  PopoverTriggerToggle,
  SelectOne,
} from '@fibo-ui/cdk';

interface PopoverAction {
  id: string;
  label: string;
  description: string;
}

@Component({
  selector: 'cdk-popover-basic-example',
  imports: [PopoverTriggerToggle, Popover, DataList, DataListItem, SelectOne],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-xl p-6">
      <div class="flex items-center gap-3">
        <button type="button" #trigger="PopoverTrigger" fiboPopoverTriggerToggle [contentTemplate]="popoverTpl"
                class="btn btn-primary">
          Toggle popover
        </button>
        <ng-template #popoverTpl let-trigger>
          <div
            fiboPopover
            [trigger]="trigger"
            placement="bottom-start"
            [offset]="8"
            fiboDataList
            fiboSelectOne
            [(value)]="selectedAction"
            (itemTriggered)="onActionTriggered(trigger)"
            class="popover-container min-w-72 p-2"
          >
            @for (action of actions; track action.id) {
              <button fiboDataListItem type="button" [value]="action.id" class="datalist-item w-full text-left">
                <span class="block">{{ action.label }}</span>
                <span class="block text-xs text-foreground-secondary">{{ action.description }}</span>
              </button>
            }
          </div>
        </ng-template>
        <span class="text-sm text-foreground-secondary">Open: {{ trigger.isOpen() ? 'yes' : 'no' }}</span>
      </div>

      <p class="mt-3 text-sm">
        Last selected action: <strong>{{ selectedAction() || 'None' }}</strong>
      </p>
    </section>
  `,
})
export class CdkPopoverBasicExample {
  readonly actions: PopoverAction[] = [
    { id: 'open', label: 'Open details', description: 'Typical action item in overlay content' },
    { id: 'rename', label: 'Rename', description: 'Runs through DataList item trigger flow' },
    { id: 'archive', label: 'Archive', description: 'Popover closes after action trigger' },
  ];

  readonly selectedAction = signal<string>('');

  onActionTriggered(trigger: PopoverTrigger): void {
    trigger.close();
  }
}
