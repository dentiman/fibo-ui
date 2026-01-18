import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form } from '@angular/forms/signals';
import { Checkbox, MultiSelect } from '@fibo-ui/components';
import { UsageDemo } from '../../common/usage-demo';
import { LucideAngularModule } from 'lucide-angular';

interface UserModel {
  skills: string[];
}

@Component({
  selector: 'app-multiple-select-page',
  standalone: true,
  imports: [
    FormField,
    MultiSelect,
    UsageDemo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 flex flex-col space-y-12">
      <h2 class="text-foreground">Basic multiple select</h2>
      <app-usage-demo [codeBlocks]="codeBlocks">
        <div class="mx-auto w-90 p-8">
          <fibo-multi-select
            label="Skills"
            [items]="skillsItems"
            [formField]="userForm.skills"
          >
          </fibo-multi-select>
        </div>
      </app-usage-demo>
    </div>
  `
})
export class MultipleSelectPageComponent {
  readonly user = signal<UserModel>({
    skills: []
  });

  readonly userForm = form(this.user);

  readonly skills = ['Angular', 'React', 'Vue', 'Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go'];

  readonly skillsItems = this.skills.map(s => ({ label: s, value: s }));

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
