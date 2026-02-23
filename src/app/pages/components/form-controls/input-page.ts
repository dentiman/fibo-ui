import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { InputBasicExample } from './examples/input-basic-example';

const EXAMPLES = new Map<string, any>([['input-basic', InputBasicExample]]);

@Component({
  selector: 'app-input-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/input/input.md" />`,
})
export class InputPageComponent {}
