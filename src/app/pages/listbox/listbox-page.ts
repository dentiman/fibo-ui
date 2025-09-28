import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MultipleSelectionModel, SingleSelectionModel} from '@fibo-ui/cdk';
import {User, usersChoices} from "../../common/form-data-example";
import {Listbox} from '@fibo-ui/components';

@Component({
  selector: 'app-listbox-page',
  standalone: true,
  imports: [
    CommonModule,
    Listbox,
    SingleSelectionModel,
    MultipleSelectionModel,
  ],
  templateUrl: './listbox-page.html',
})
export class ListboxPageComponent {
  // Use shared user data for all fields
  users = usersChoices;

  // Properties for the listbox
  valueProp: keyof User = 'id';
  labelProp: keyof User = 'name';

  // Selection values
  singleSelectionValue = signal<number | null>(null);
  multipleSelectionValue = signal<number[]>([]);
  disabledValue = signal<number | null>(3);

  // Method to clear selections
  clearSelections() {
    this.singleSelectionValue.set(null);
    this.multipleSelectionValue.set([]);
    this.disabledValue.set(3);
  }

  // Method to select all items (for multiple selection)
  selectAll() {
    this.multipleSelectionValue.set(this.users.map(user => user.id));
  }

  // Method to deselect all items (for multiple selection)
  deselectAll() {
    this.multipleSelectionValue.set([]);
  }

  // Method to get selected name
  getSelectedName(value: any): string {
    if (!value) return 'None';
    const user = this.users.find(u => u.id === value);
    return user?.name || 'None';
  }
}
