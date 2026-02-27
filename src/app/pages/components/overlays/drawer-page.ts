import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { DrawerBasicExample } from './examples/drawer-basic-example';

const EXAMPLES = new Map<string, any>([['drawer-basic', DrawerBasicExample]]);

@Component({
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/drawer/drawer.md" />`,
})
export class DrawerPageComponent {}
