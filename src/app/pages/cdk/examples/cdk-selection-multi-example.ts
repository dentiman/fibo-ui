import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataList, DataListItem, SelectMulti } from '@fibo-ui/cdk';

@Component({
  selector: 'cdk-selection-multi-example',
  imports: [DataList, DataListItem, SelectMulti],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-xl p-6">
      <div
        fiboDataList
        fiboSelectMulti
        [(value)]="selectedColors"
        tabindex="0"
        role="listbox"
        aria-multiselectable="true"
        class="popover-container p-2 max-h-72 overflow-auto outline-none"
      >
        @for (color of colors; track color) {
          <button fiboDataListItem type="button" [value]="color"
                  class="datalist-item w-full text-left">
            {{ color }}
          </button>
        }
      </div>

      <p class="mt-3 text-sm">
        Selected: <strong>{{ selectedColors().join(', ') || 'None' }}</strong>
      </p>
    </section>
  `,
})
export class CdkSelectionMultiExample {
  readonly colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'];
  readonly selectedColors = signal<string[]>([]);
}
