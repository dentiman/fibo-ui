import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { InputComponentExample } from './examples/input-component-example';
import { TextFieldRecipeExample } from './examples/text-field-recipe-example';

const EXAMPLES = new Map<string, any>([
  ['input', InputComponentExample],
  ['recipe', TextFieldRecipeExample],
]);

@Component({
  selector: 'app-input-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/input/input.md" />`,
})
export class InputPageComponent {}
