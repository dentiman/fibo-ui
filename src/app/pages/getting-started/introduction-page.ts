import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DocViewer } from '../../common/doc-viewer/doc-viewer';

@Component({
  selector: 'app-introduction-page',
  imports: [DocViewer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/getting-started/introduction.md" />`,
})
export class IntroductionPageComponent {}
