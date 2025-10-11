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

        <div *fiboColumn="'name';  source: users();  isSortable:true ; thClass: 'py-1.5 px-2' ;  tdClass: 'py-1.5 px-2' ; let user"  class="flex items-center gap-3">
          <img
            [src]="user.avatar"
            [alt]="user.name"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div class="flex flex-col min-w-0">
              <span class="text-sm font-medium truncate">{{ user.name }}</span>
            <span class="text-xs truncate text-foreground-tertiary">
                {{ user.email }}
              </span>
          </div>
        </div>
          <span *fiboColumn="'phoneNumber'; header: 'Phone Number'; source: users(); isSortable:true; let user">{{ user.phoneNumber }}</span>
          <span *fiboColumn="'speciality'; header: 'Speciality'; source: users(); isSortable:true; let user">{{ user.speciality }}</span>
          <span *fiboColumn="'isDisabled';header: 'Disabled'; source: users(); isSortable:true; let user">{{ user.isDisabled ? 'Yes' : 'No' }}</span>
      </fibo-table>
      <div class="mt-2 text-foreground">Sort: {{ sort().sortBy }} {{ sort().sortOrder }}</div>
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


