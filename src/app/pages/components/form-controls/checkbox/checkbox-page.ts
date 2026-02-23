import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../../common/doc-viewer/example-registry';
import { CheckboxBasicExample } from './examples/checkbox-basic-example';
import { CheckboxSignalFormsExample } from './examples/checkbox-signal-forms-example';

const EXAMPLES = new Map<string, any>([
  ['checkbox-basic', CheckboxBasicExample],
  ['checkbox-signal-forms', CheckboxSignalFormsExample],
]);

@Component({
  selector: 'app-checkbox-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/checkbox/checkbox.md" />`,
})
export class CheckboxPageComponent {}
