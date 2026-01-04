import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form} from '@angular/forms/signals';
import {FormField} from '@fibo-ui/components';
import {
  DataList,
  Option,
  Popover,
  PopoverTrigger,
  PortalContent,
  SelectOne
} from '@fibo-ui/cdk';
import {FieldLabel} from '../../../../projects/fibo-ui/components/src/lib/form/form-field/field-label';
import {UsageDemo} from '../../common/usage-demo';

interface UserModel {
  role: string | null;
}

@Component({
  selector: 'app-select-page',
  standalone: true,
  imports: [
    CommonModule,
    Field,
    FormField,
    DataList,
    Popover,
    PortalContent,
    PopoverTrigger,
    SelectOne,
    Option,
    FieldLabel,
    UsageDemo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select-page.html',
})
export class SelectPageComponent {
  readonly user = signal<UserModel>({
    role: null
  });

  readonly userForm = form(this.user);

  readonly userRoles = ['admin', 'user', 'guest'];

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/select/basic-select.html.md' },
    { name: 'ts', path: '/documentation/select/basic-select.ts.md' }
  ];
}
