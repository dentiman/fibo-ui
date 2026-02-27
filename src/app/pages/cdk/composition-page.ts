import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../common/doc-viewer/doc-viewer';

@Component({
  selector: 'app-cdk-composition-page',
  imports: [DocViewer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/cdk/composition.md" />`,
})
export class CdkCompositionPageComponent {}
