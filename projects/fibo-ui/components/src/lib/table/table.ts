import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
  input
} from '@angular/core';
import {CommonModule, NgTemplateOutlet} from '@angular/common';
import {FiboColumn} from './column';
import {FiboColumnHeader} from './column-header';
import {FiboTableRow} from './table-row';
import {ListItem, MultipleSelectionModel, SELECTION_MODEL, SelectionModel} from '@fibo-ui/cdk';
import {Checkbox} from '../checkbox/checkbox';

type RecordLike = Record<string, unknown>;

@Component({
  selector: 'fibo-table',
  imports: [CommonModule, NgTemplateOutlet, Checkbox, ListItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'fibo-table block w-full overflow-x-auto',
  },
  template: `
    <table class="relative min-w-full divide-y divide-gray-300 dark:divide-white/15">
      <thead>
      <tr>
        @if (hasMultipleSelectionModel) {
          <th scope="col" class="w-10 px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                <fibo-checkbox ></fibo-checkbox>
          </th>
        }


        @if (headers().length) {
          @for (header of headers(); track header) {
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
              <ng-container [ngTemplateOutlet]="header.templateRef"></ng-container>
            </th>
          }
        } @else {
          @for (col of columns(); track col) {
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-foreground"
                [class]="col.fiboColumnThClass()">
              {{ col.columnName() || col.fiboColumn() }}
            </th>
          }
        }
      </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-white/10">
        @for (row of rows(); track $index) {
          <tr>
            @if (hasMultipleSelectionModel) {
              <td class="px-3 py-4 text-sm whitespace-nowrap text-foreground-secondary">
                <a [fiboListItemValue]="row"
                   #item="ListItem">
                  <fibo-checkbox
                    [readonly]="true"
                    [checked]="item.isSelected()"
                  ></fibo-checkbox>
                </a>

              </td>
            }
            @for (col of columns(); track col) {
              <td class="px-3 py-4 text-sm whitespace-nowrap text-foreground-secondary"
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


  headers = contentChildren(FiboColumnHeader, { descendants: true });
  columns = contentChildren(FiboColumn as any, { descendants: true }) as unknown as () => readonly FiboColumn<T, keyof T>[];

  rows = computed<ReadonlyArray<T>>(() => this.dataSource());

  get hasMultipleSelectionModel() {
    return this.selectionModel instanceof MultipleSelectionModel;
  }

  getCellValue<Row extends T, K extends keyof Row>(row: Row, key: K) {
    return row[key];
  }
}


