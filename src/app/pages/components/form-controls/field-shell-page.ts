import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { FieldShellExample } from './examples/field-shell-example';
import { FieldShellRecipeExample } from './examples/field-shell-recipe-example';

const EXAMPLES = new Map<string, any>([
  ['field-shell', FieldShellExample],
  ['recipe', FieldShellRecipeExample],
]);

@Component({
  selector: 'app-field-shell-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/field-shell/field-shell.md" />`,
})
export class FieldShellPageComponent {}
