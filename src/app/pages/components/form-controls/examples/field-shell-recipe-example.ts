import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldShell } from '@fibo-ui/components';

@Component({
  selector: 'field-shell-recipe-example',
  imports: [FieldShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-field-shell
        label="Field Shell"
        hint="Wraps any control via content projection"
        iconStart="box"
      >
        <input class="fibo-field-input" placeholder="Projected input" />
      </fibo-field-shell>
    </div>
  `,
})
export class FieldShellRecipeExample {}
