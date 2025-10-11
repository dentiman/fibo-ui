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
import {FiboColumn, Table} from '@fibo-ui/components';
import {User, usersChoices} from '../../../common/form-data-example';
import {DataList, MultipleSelectionModel} from '@fibo-ui/cdk';

@Component({
  selector: 'app-table-page',
  imports: [CommonModule, Table, FiboColumn, MultipleSelectionModel, DataList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <h2 class="text-foreground mb-4">Table</h2>
      <fibo-table  [dataSource]="users()" fiboDataList [(MultipleSelectionModel)]="selectedItems" [(sort)]="sort">
          <span *fiboColumn="'name';  source: users();  isSortable:true ; thClass: 'w-12' ;  let user">{{ user.name }}</span>
          <span *fiboColumn="'email'; source: users(); isSortable:true; let user">{{ user.email }}</span>
      </fibo-table>
      <div class="mt-2 text-foreground">Sort: {{ sort()?.sortBy }} {{ sort()?.sortOrder }}</div>
      {{ selectedItems().length }}
    </div>
  `,
})
export class TablePageComponent {
  readonly users = signal<User[]>([...usersChoices]);
  columns = viewChildren(FiboColumn);

  selectedItems = signal<User[]>([]);

  sort = signal({ sortBy: 'name', sortOrder: 'asc' });

}


