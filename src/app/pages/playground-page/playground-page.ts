import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {Datepicker, Input, MultipleSelect, Select} from '@fibo-ui/components';
import { FormControlAppendDirective, FormControlPrependDirective } from '@fibo-ui/cdk';
import { User, usersChoices } from '../../common/form-data-example';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Select, FormControlAppendDirective, FormControlPrependDirective, Input, Datepicker, MultipleSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class=" p-8 flex flex-row justify-start space-x-1">
      <fibo-select
        controlClass="rounded-full inline-block  "
        popoverClass="w-60"
        [popoverFullWidth]="false"
        [formControl]="userCtrl"
        [items]="items()"
        appearance="secondary"
        [placeholder]="'Any'">
        <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">User:</span>
      </fibo-select>

      <fibo-input
        controlClass="rounded-full inline-block w-60 "
        [(value)]="search"
        [placeholder]="'search...'">
        <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">Username:</span>
      </fibo-input>

      <fibo-datepicker
        controlClass="rounded-full inline-block w-60 "
        [placeholder]="'Any'">
        <span *fiboFormControlPrepend class="text-sm text-foreground-secondary text-nowrap">Created After:</span>
      </fibo-datepicker>


      <fibo-multiple-select
        controlClass="rounded-full inline-block  "
        popoverClass="w-60"
        [popoverFullWidth]="false"
        [items]="items()"
        appearance="secondary"
        [placeholder]="'Any'">
        <span *fiboFormControlPrepend class="text-sm text-foreground-secondary">Users:</span>
      </fibo-multiple-select>

    </div>
  `,

})
export class PlaygroundPageComponent {
  readonly items = signal<User[]>([...usersChoices]);
  readonly userCtrl = new FormControl<number | null>(null);

  readonly search = signal('');

}
