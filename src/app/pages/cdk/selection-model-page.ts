import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../common/doc-viewer/example-registry';
import { CdkSelectionSingleExample } from './examples/cdk-selection-single-example';
import { CdkSelectionMultiExample } from './examples/cdk-selection-multi-example';

const EXAMPLES = new Map<string, any>([
  ['cdk-selection-single', CdkSelectionSingleExample],
  ['cdk-selection-multi', CdkSelectionMultiExample],
]);

@Component({
  selector: 'app-cdk-selection-model-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/cdk/selection-model.md" />`,
})
export class CdkSelectionModelPageComponent {}
