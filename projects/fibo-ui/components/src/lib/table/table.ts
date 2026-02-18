import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  model
} from '@angular/core';
import {CommonModule, NgTemplateOutlet} from '@angular/common';
import {FiboColumn, DataListItem, SelectMulti, SELECTION_MODEL, SelectionModel} from '@fibo-ui/cdk';
import {Checkbox} from '../form-controls/checkbox/checkbox';

// TODO:: need implement checkbox multiselect outside table component
@Component({
  selector: 'fibo-table',
  imports: [CommonModule, NgTemplateOutlet, Checkbox, DataListItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'fibo-table block w-full overflow-x-auto',
  },
  template: `
    <table class="min-w-full divide-y divide-gray-300 dark:divide-white/15">
      <thead>
      <tr>
        @if (hasMultipleSelectionModel) {
          <th scope="col" class="w-10 px-1 items-center text-sm font-semibold text-foreground" >
            <fibo-checkbox
              [checked]="allSelected()"
              [indeterminate]="isIndeterminate()"
              (checkedChange)="toggleAll($event)"
            ></fibo-checkbox>
          </th>
        }


        @for (col of columns(); track col) {
          <th scope="col" class=" text-left text-sm font-semibold text-foreground"
              [class]="col.fiboColumnThClass()">
            @if (col.fiboColumnIsSortable()) {
              <a class="inline-flex items-center gap-1 cursor-pointer select-none text-foreground"
                 (click)="onHeaderClick(col.fiboColumn())">
                <span>
                  {{ col.fiboColumnHeader() || col.fiboColumn() }}
                </span>
                @if (isSortedBy(col.fiboColumn())) {
                  @if (getSortOrderFor(col.fiboColumn()) === 'asc') {
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5"
                         aria-hidden="true">
                      <path d="M12 19V5"/>
                      <polyline points="5 12 12 5 19 12"/>
                    </svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5"
                         aria-hidden="true">
                      <path d="M12 5v14"/>
                      <polyline points="19 12 12 19 5 12"/>
                    </svg>
                  }
                }
              </a>
            } @else {
              <span>
                {{ col.fiboColumnHeader() || col.fiboColumn() }}
              </span>
            }
          </th>
        }

      </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-white/10">
        @for (row of rows(); track $index) {
          <tr>
            @if (hasMultipleSelectionModel) {
              <td class="px-1 text-sm whitespace-nowrap text-foreground-secondary">
                <a fiboDataListItem [value]="row"
                   #item="DataListItem">
                  <fibo-checkbox
                    [readonly]="true"
                    [checked]="item.isSelected()"
                  ></fibo-checkbox>
                </a>

              </td>
            }
            @for (col of columns(); track col) {
              <td class=" text-sm whitespace-nowrap text-foreground-secondary"
                  [class]="col.fiboColumnTdClass()">
                <ng-container
                  [ngTemplateOutlet]="col.templateRef"
                  [ngTemplateOutletContext]="{$implicit: row, value: getCellValue(row, col.fiboColumn()), key: col.fiboColumn()}"
                ></ng-container>
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class Table<T> {

  selectionModel = inject(SELECTION_MODEL, { optional: true }) as SelectionModel<T> | null;

  dataSource = input<T[]>([]);

  sort = model<{ sortBy: string; sortOrder: string } | null>(null, { alias: 'sort' });

  columns = contentChildren(FiboColumn as any, { descendants: true }) as unknown as () => readonly FiboColumn<T, keyof T>[];

  rows = computed<ReadonlyArray<T>>(() => this.dataSource());

  get hasMultipleSelectionModel() {
    return this.selectionModel instanceof SelectMulti;
  }

  // Number of selected items among the current rows
  private selectedInViewCount = computed<number>(() => {
    if (!(this.selectionModel instanceof SelectMulti)) return 0;
    const currentRows = this.rows();
    const selected = this.selectionModel.value();
    if (!Array.isArray(selected) || currentRows.length === 0) return 0;
    const selectedSet = new Set(selected as ReadonlyArray<T>);
    let count = 0;
    for (const row of currentRows) {
      if (selectedSet.has(row)) count++;
    }
    return count;
  });

  // Header checkbox states
  allSelected = computed<boolean>(() => {
    const total = this.rows().length;
    const selected = this.selectedInViewCount();
    return total > 0 && selected === total;
  });

  isIndeterminate = computed<boolean>(() => {
    const total = this.rows().length;
    const selected = this.selectedInViewCount();
    return selected > 0 && selected < total;
  });

  // Toggle all visible rows based on header checkbox
  toggleAll(next: boolean | null) {
    if (!(this.selectionModel instanceof SelectMulti)) return;
    const checked = !!next;
    const currentRows = this.rows();
    if (currentRows.length === 0) return;
    this.selectionModel.value.set(checked ? [...currentRows] : []);
  }

  // Sorting helpers
  isSortedBy(key: unknown): boolean {
    const s = this.sort();
    const k = String(key as any);
    return !!s && s.sortBy === k;
  }

  getSortOrderFor(key: unknown): 'asc' | 'desc' | null {
    const s = this.sort();
    const k = String(key as any);
    if (!s || s.sortBy !== k) return null;
    return (s.sortOrder === 'asc' ? 'asc' : 'desc');
  }

  onHeaderClick(key: unknown) {
    const s = this.sort();
    const k = String(key as any);
    if (!s || s.sortBy !== k) {
      // First click on a column or switching columns -> ascending
      this.sort.set({ sortBy: k, sortOrder: 'asc' });
      return;
    }
    if (s.sortOrder === 'asc') {
      // Second click on same column -> descending
      this.sort.set({ sortBy: k, sortOrder: 'desc' });
      return;
    }
    // Third click on same column while descending -> remove sorting
    this.sort.set(null);
  }

  getCellValue<Row extends T, K extends keyof Row>(row: Row, key: K) {
    return row[key];
  }
}

