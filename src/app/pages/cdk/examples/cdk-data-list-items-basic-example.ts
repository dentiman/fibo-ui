import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DataList, DataListItem, SelectOne } from '@fibo-ui/cdk';

interface DataListDocItem {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'cdk-data-list-items-basic-example',
  imports: [DataList, DataListItem, SelectOne],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-xl p-6">
      <p class="text-sm text-foreground-secondary mb-3">
        Focus the list and use ArrowUp / ArrowDown to move active item, then press Enter to select.
      </p>

      <div
        fiboDataList
        fiboSelectOne
        [(value)]="selectedValue"
        tabindex="0"
        role="listbox"
        class="popover-container p-2 max-h-72 overflow-auto outline-none"
      >
        @for (item of items; track item.value) {
          <button
            fiboDataListItem
            type="button"
            [value]="item.value"
            [disabled]="!!item.disabled"
            class="datalist-item w-full text-left"
          >
            <span>{{ item.label }}</span>
          </button>
        }
      </div>

      <p class="mt-3 text-sm">
        Selected:
        <strong>{{ selectedLabel() }}</strong>
      </p>
    </section>
  `,
})
export class CdkDataListItemsBasicExample {
  readonly items: DataListDocItem[] = [
    { value: 'registration', label: 'Registration' },
    { value: 'active', label: 'Active State' },
    { value: 'keyboard', label: 'Keyboard Navigation' },
    { value: 'disabled', label: 'Disabled Item', disabled: true },
    { value: 'selection', label: 'Selection' },
  ];

  readonly selectedValue = signal<string>('registration');
  readonly selectedLabel = computed(() => {
    return this.items.find(item => item.value === this.selectedValue())?.label ?? 'None';
  });
}
