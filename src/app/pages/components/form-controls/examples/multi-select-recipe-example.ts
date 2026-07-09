import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { MultiSelect, SelectItem } from '@fibo-ui/components';

@Component({
  selector: 'multi-select-recipe-example',
  imports: [MultiSelect, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-multi-select
        [formField]="form.skills"
        label="Skills"
        placeholder="Select skills"
        [items]="skillItems"
      />
    </div>
  `,
})
export class MultiSelectRecipeExample {
  readonly skillItems: SelectItem[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
  ];

  readonly model = signal({ skills: [] as string[] });
  readonly form = form(this.model);
}
