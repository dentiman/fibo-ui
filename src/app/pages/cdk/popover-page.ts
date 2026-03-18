import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../common/doc-viewer/example-registry';
import { CdkOverlaysBasicExample } from './examples/cdk-overlays-basic-example';

const EXAMPLES = new Map<string, any>([
  ['cdk-overlays-basic', CdkOverlaysBasicExample],
]);

@Component({
  selector: 'app-cdk-overlays-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/cdk/popover.md" />`,
})
export class CdkOverlaysPageComponent {}
