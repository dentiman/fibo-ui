```ts
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Field, form } from '@angular/forms/signals';
import { FormField, Checkbox } from '@fibo-ui/components';
import {
  DataList,
  ListItem,
  Popover,
  PopoverTriggerClick,
  PortalTemplateDirective,
  MultipleSelectionModel
} from '@fibo-ui/cdk';
import { FieldLabel } from '@fibo-ui/components/src/lib/form/form-field/field-label';
import { LucideAngularModule } from 'lucide-angular';

interface UserModel {
  skills: string[];
}

@Component({
  selector: 'app-multiple-select-example',
  standalone: true,
  imports: [
    CommonModule,
    Field,
    FormField,
    DataList,
    Popover,
    PortalTemplateDirective,
    PopoverTriggerClick,
    MultipleSelectionModel,
    ListItem,
    FieldLabel,
    Checkbox,
    LucideAngularModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'basic-multiple-select.html'
})
export class MultipleSelectExampleComponent {
  readonly user = signal<UserModel>({
    skills: []
  });
  
  readonly userForm = form(this.user);

  readonly skills = ['Angular', 'React', 'Vue', 'Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go'];

  removeSkill(value: string) {
    const currentValue = this.userForm.skills().value();
    if (!currentValue) return;
    this.userForm.skills().value.set(currentValue.filter((v: string) => v !== value));
  }
}
```
