import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { SelectComponentExample } from './examples/select-component-example';

const EXAMPLES = new Map<string, any>([
  ['select', SelectComponentExample],
]);

@Component({
  selector: 'app-select-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/select/select.md" />`,
})
export class SelectPageComponent {}
