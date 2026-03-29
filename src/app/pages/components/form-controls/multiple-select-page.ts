import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { MultipleSelectComponentExample } from './examples/multiple-select-component-example';

const EXAMPLES = new Map<string, any>([
  ['multiple-select', MultipleSelectComponentExample],
]);

@Component({
  selector: 'app-multiple-select-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/multiple-select/multiple-select.md" />`,
})
export class MultipleSelectPageComponent {}
