import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form} from '@angular/forms/signals';
import {FormField, Checkbox} from '@fibo-ui/components';
import {
  DataList,
  ListItem,
  Popover,
  PopoverTriggerClick,
  PortalTemplateDirective,
  MultipleSelectionModel
} from '@fibo-ui/cdk';
import {FieldLabel} from '../../../../projects/fibo-ui/components/src/lib/form/form-field/field-label';
import {UsageDemo} from '../../common/usage-demo';
import {LucideAngularModule} from 'lucide-angular';

interface UserModel {
  skills: string[];
}

@Component({
  selector: 'app-multiple-select-page',
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
    LucideAngularModule,
    UsageDemo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './multiple-select-page.html',
})
export class MultipleSelectPageComponent {
  readonly user = signal<UserModel>({
    skills: []
  });
  
  readonly userForm = form(this.user);

  readonly skills = ['Angular', 'React', 'Vue', 'Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go'];

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/multiple-select/basic-multiple-select.html.md' },
    { name: 'ts', path: '/documentation/multiple-select/basic-multiple-select.ts.md' }
  ];

  removeSkill(value: string) {
    const currentValue = this.userForm.skills().value();
    if (!currentValue) return;
    this.userForm.skills().value.set(currentValue.filter((v: string) => v !== value));
  }
}
