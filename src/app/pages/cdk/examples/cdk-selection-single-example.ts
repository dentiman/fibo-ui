import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataList, DataListItem, SelectOne } from '@fibo-ui/cdk';

@Component({
  selector: 'cdk-selection-single-example',
  imports: [DataList, DataListItem, SelectOne],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-xl p-6">
      <div
        fiboDataList
        fiboSelectOne
        [(value)]="selectedFruit"
        tabindex="0"
        role="listbox"
        class="popover-container p-2 max-h-72 overflow-auto outline-none"
      >
        @for (fruit of fruits; track fruit) {
          <button fiboDataListItem type="button" [value]="fruit"
                  class="datalist-item w-full text-left">
            {{ fruit }}
          </button>
        }
      </div>

      <p class="mt-3 text-sm">
        Selected: <strong>{{ selectedFruit() || 'None' }}</strong>
      </p>
    </section>
  `,
})
export class CdkSelectionSingleExample {
  readonly fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  readonly selectedFruit = signal<string | null>(null);
}
