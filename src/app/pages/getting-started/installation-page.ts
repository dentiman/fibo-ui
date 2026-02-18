import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DocViewer } from '../../common/doc-viewer/doc-viewer';

@Component({
  selector: 'app-installation-page',
  imports: [DocViewer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/getting-started/installation.md" />`,
})
export class InstallationPageComponent {}
