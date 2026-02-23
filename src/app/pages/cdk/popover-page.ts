import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../common/doc-viewer/example-registry';
import { CdkPopoverBasicExample } from './examples/cdk-popover-basic-example';
import { CdkPopoverInfoCardExample } from './examples/cdk-popover-info-card-example';
import { CdkPopoverPlacementsExample } from './examples/cdk-popover-placements-example';

const EXAMPLES = new Map<string, any>([
  ['cdk-popover-basic', CdkPopoverBasicExample],
  ['cdk-popover-info-card', CdkPopoverInfoCardExample],
  ['cdk-popover-placements', CdkPopoverPlacementsExample],
]);

@Component({
  selector: 'app-cdk-popover-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/cdk/popover.md" />`,
})
export class CdkPopoverPageComponent {}
