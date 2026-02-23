import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { MenuOneLevelExample } from './examples/menu-one-level-example';
import { MenuMultiLevelExample } from './examples/menu-multi-level-example';

const EXAMPLES = new Map<string, any>([
  ['menu-one-level', MenuOneLevelExample],
  ['menu-multi-level', MenuMultiLevelExample],
]);

@Component({
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/menu/menu.md" />`,
})
export class MenuPageComponent {}
