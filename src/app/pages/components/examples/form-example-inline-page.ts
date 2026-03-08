import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormExample } from '../form-controls/examples/form-example';

@Component({
  selector: 'app-form-example-inline-page',
  imports: [FormExample],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-field-variant-inline">
      <form-example
        title="Form Example Inline"
        description="Same registration demo, but layout is overridden by the global wrapper class."
      />
    </div>
  `,
})
export class FormExampleInlinePageComponent {}
