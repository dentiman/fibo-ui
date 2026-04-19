import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { FieldControlBasicExample } from './examples/form-field-control-basic-example';
import { FieldControlClearableExample } from './examples/form-field-control-clearable-example';
import { FormExample } from './examples/form-example';

const EXAMPLES = new Map<string, any>([
  ['field-control-basic', FieldControlBasicExample],
  ['field-control-clearable', FieldControlClearableExample],
  ['form-example', FormExample],
]);

@Component({
  selector: 'app-field-control-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/field-control/field-control.md" />`,
})
export class FieldControlPageComponent {}
