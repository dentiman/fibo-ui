import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { DataList, FormFieldTrigger, DataListItem, Popover, PortalContent, SelectMulti } from '@fibo-ui/cdk';
import { Checkbox } from '@fibo-ui/components';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'multiple-select-basic-example',
  imports: [FormField, FormFieldTrigger, DataList, Popover, PortalContent, SelectMulti, DataListItem, LucideAngularModule, Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto p-8 w-[350px]">
      <form class="space-y-5">
        <button
          type="button"
          fiboFormFieldTrigger
          #trigger="PopoverTrigger"
          [formField]="userForm.skills"
          class="w-full form-field-control flex items-center gap-2 text-left"
        >
          <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
            <label class="form-field-label mt-1">Skills</label>
            <span class="w-full flex flex-wrap gap-x-1 gap-y-1">
              @for (value of user().skills; track value) {
                <div class="flex items-center gap-1 btn btn-sm">
                  <span class="truncate flex-1 text-xs font-medium">{{ value }}</span>
                  <button
                    type="button"
                    class="rounded-full cursor-pointer flex-shrink-0 btn-text"
                    (click)="removeSkill(value); $event.stopPropagation()"
                    (keydown)="$event.stopPropagation()"
                  >
                    <lucide-icon name="x" size="14"></lucide-icon>
                  </button>
                </div>
              }
              @if (user().skills.length === 0) {
                <div class="from-field-placeholder text-sm">Select Skills</div>
              }
            </span>
          </div>
          <lucide-icon name="chevron-down" size="16" class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>
          <ng-template fiboPortalContent [(isOpen)]="trigger.isOpen">
            <div
              fiboPopover [trigger]="trigger" [matchWidth]="true"
              fiboDataList
              fiboSelectMulti [(value)]="userForm.skills().value"
              class="popover-container"
            >
              @for (item of skillsItems; track item.value) {
                <a fiboDataListItem [value]="item.value" #option="DataListItem" class="datalist-item items-center">
                  <fibo-checkbox [checked]="option.isSelected()">{{ item.label }}</fibo-checkbox>
                </a>
              }
            </div>
          </ng-template>
        </button>
      </form>
    </div>
  `,
})
export class MultipleSelectBasicExample {
  readonly user = signal<{ skills: string[] }>({ skills: [] });
  readonly userForm = form(this.user);
  readonly skills = ['Angular', 'React', 'Vue', 'Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go'];
  readonly skillsItems = this.skills.map(s => ({ label: s, value: s }));

  removeSkill(value: string) {
    const current = this.userForm.skills().value();
    if (!current) return;
    this.userForm.skills().value.set(current.filter((v: string) => v !== value));
  }
}
