import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { MenuComponentExample } from './examples/menu-component-example';

const EXAMPLES = new Map<string, any>([
  ['menu', MenuComponentExample],
]);

@Component({
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/menu/menu.md" />`,
})
export class MenuPageComponent {}
