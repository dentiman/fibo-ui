import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form } from '@angular/forms/signals';
import { Checkbox } from '@fibo-ui/components';
import { UsageDemo } from '../../../common/usage-demo';
import { LucideAngularModule } from 'lucide-angular';
import {
  DataList,
  FormFieldTrigger,
  Option,
  Popover,
  PortalContent,
  SelectMulti
} from '@fibo-ui/cdk';

interface UserModel {
  skills: string[];
}

@Component({
  selector: 'app-multiple-select-page',
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    FormFieldTrigger,
    DataList,
    Popover,
    PortalContent,
    SelectMulti,
    Option,
    LucideAngularModule,
    Checkbox,
    UsageDemo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 flex flex-col space-y-12">
      <h2 class="text-foreground">Basic multiple select</h2>
      <app-usage-demo [codeBlocks]="codeBlocks">
        <div class="container mx-auto p-4 w-[350px]">
          <form class="space-y-5">
            <button type="button" fiboFormFieldTrigger [formField]="userForm.skills"
                    class="w-full form-field-control flex items-center gap-2 text-left">
              <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
                <label class="form-field-label mt-1">Skills</label>
                <span class="w-full flex flex-wrap gap-x-1 gap-y-1">
                  @for (value of user().skills; track value) {
                    <div class="flex items-center gap-1 btn btn-sm">
                      <span class="truncate flex-1 text-xs font-medium">{{ value }}</span>
                      <button type="button"
                              class="rounded-full cursor-pointer flex-shrink-0 btn-text"
                              (click)="removeSkill(value); $event.stopPropagation()"
                              (keydown)="$event.stopPropagation()">
                        <lucide-icon name="x" size="14"></lucide-icon>
                      </button>
                    </div>
                  }
                  @if (user().skills.length === 0) {
                    <div class="from-field-placeholder text-sm">Select Skills</div>
                  }
                </span>
              </div>
              <lucide-icon name="chevron-down" size="16"
                           class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>
              <div *fiboPortalContent="let trigger"
                   fiboPopover [trigger]="trigger" [matchWidth]="true"
                   fiboDataList
                   fiboSelectMulti [(value)]="userForm.skills().value"
                   class="popover-container">
                @if (skillsItems.length === 0) {
                  <div class="w-full text-gray-400 text-sm px-3 py-2">No items found</div>
                }
                @for (item of skillsItems; track item.value) {
                  <a fiboOption [value]="item.value" #option="Option"
                     class="datalist-item items-center">
                    <fibo-checkbox [checked]="option.isSelected()">{{ item.label }}</fibo-checkbox>
                  </a>
                }
              </div>
            </button>
          </form>

          <div class="mt-8 p-4 rounded">
            <h2 class="text-xl font-bold mb-2">user:</h2>
            <pre class="whitespace-pre-wrap">{{ user() | json }}</pre>
          </div>
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
