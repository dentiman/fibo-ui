import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { FormFieldControlBasicExample } from './examples/form-field-control-basic-example';
import { FormFieldControlClearableExample } from './examples/form-field-control-clearable-example';
import { FormExample } from './examples/form-example';

const EXAMPLES = new Map<string, any>([
  ['form-field-control-basic', FormFieldControlBasicExample],
  ['form-field-control-clearable', FormFieldControlClearableExample],
  ['form-example', FormExample],
]);

@Component({
  selector: 'app-form-field-control-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/form-field-control/form-field-control.md" />`,
})
export class FormFieldControlPageComponent {}
