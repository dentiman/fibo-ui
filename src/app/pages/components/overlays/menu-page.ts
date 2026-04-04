import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { MenuComponentExample } from './examples/menu-component-example';
import { MenuMultilevelExample } from './examples/menu-multilevel-example';

const EXAMPLES = new Map<string, any>([
  ['menu', MenuComponentExample],
  ['menu-multilevel', MenuMultilevelExample],
]);

@Component({
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/menu/menu.md" />`,
})
export class MenuPageComponent {}
