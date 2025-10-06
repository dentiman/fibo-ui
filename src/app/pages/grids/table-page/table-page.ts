import {
  ChangeDetectionStrategy,
  Component,
  contentChildren, effect,
  signal,
  TemplateRef,
  viewChild,
  viewChildren
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FiboColumn, FiboColumnContext, FiboColumnHeader, FiboTableRow, Table} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {DataList, MultipleSelectionModel} from '@fibo-ui/cdk';

@Component({
  selector: 'app-table-page',
  imports: [CommonModule, Table, FiboColumnHeader, FiboColumn, FiboTableRow, MultipleSelectionModel, DataList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <h2 class="text-foreground mb-4">Table</h2>
      <fibo-table  [dataSource]="users()" fiboDataList [(MultipleSelectionModel)]="selectedItems">
          <span *fiboColumn="'name'; source: users(); thClass: 'w-12' ;  let user">{{ user.name }}</span>
          <span *fiboColumn="'email'; source: users(); let user">{{ user.email }}</span>
      </fibo-table>
      {{ selectedItems().length }}
    </div>
  `,
})
export class TablePageComponent {
  readonly users = signal<User[]>([...usersChoices]);
  columns = viewChildren(FiboColumn);

  selectedItems = signal([]);

}


