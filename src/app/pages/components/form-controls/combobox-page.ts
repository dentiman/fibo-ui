import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { ComboboxBasicTemplateExample } from './examples/combobox-basic-template-example';
import { ComboboxComponentExample } from './examples/combobox-component-example';

const EXAMPLES = new Map<string, any>([
  ['combobox-basic-template', ComboboxBasicTemplateExample],
  ['combobox-component', ComboboxComponentExample],
]);

@Component({
  selector: 'app-combobox-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/combobox/combobox.md" />`,
})
export class ComboboxPageComponent {}
