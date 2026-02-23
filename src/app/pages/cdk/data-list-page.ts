import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../common/doc-viewer/example-registry';
import { CdkDataListItemsBasicExample } from './examples/cdk-data-list-items-basic-example';

const EXAMPLES = new Map<string, any>([['cdk-data-list-items-basic', CdkDataListItemsBasicExample]]);

@Component({
  selector: 'app-cdk-data-list-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/cdk/data-list.md" />`,
})
export class CdkDataListPageComponent {}

