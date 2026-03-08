import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormExample } from '../form-controls/examples/form-example';

@Component({
  selector: 'app-form-example-label-top-page',
  imports: [FormExample],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-field-variant-label-top">
      <form-example
        title="Form Example Label Top"
        description="Same registration demo with the default stacked layout from form-fields.css."
      />
    </div>
  `,
})
export class FormExampleLabelTopPageComponent {}
