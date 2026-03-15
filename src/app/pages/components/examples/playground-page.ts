import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {Checkbox, Combobox} from '@fibo-ui/components';
import {form, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    LucideAngularModule,
    Combobox,
    FormField,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fibo-combobox
      [formField]="userForm.assignee"
      label="Assignee"
      placeholder="Search assignee"
      [items]="assignees"
    />
  `,

})
export class PlaygroundPageComponent {
  readonly assignees = [
    'Ada Lovelace',
    'Alan Turing',
    'Barbara Liskov',
    'Grace Hopper',
    'Linus Torvalds',
    'Margaret Hamilton',
  ];


  readonly user = signal({ assignee: null as string | null });
  readonly userForm = form(this.user);
}
