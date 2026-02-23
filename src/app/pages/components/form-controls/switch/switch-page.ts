import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../../common/doc-viewer/example-registry';
import { SwitchBasicExample } from './examples/switch-basic-example';
import { SwitchSizesExample } from './examples/switch-sizes-example';
import { SwitchSignalFormsExample } from './examples/switch-signal-forms-example';

const EXAMPLES = new Map<string, any>([
  ['switch-basic', SwitchBasicExample],
  ['switch-sizes', SwitchSizesExample],
  ['switch-signal-forms', SwitchSignalFormsExample],
]);

@Component({
  selector: 'app-switch-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/switch/switch.md" />`,
})
export class SwitchPageComponent {}
