import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { DatepickerComponentExample } from './examples/datepicker-component-example';
import { DatepickerRecipeExample } from './examples/datepicker-recipe-example';

const EXAMPLES = new Map<string, any>([
  ['datepicker', DatepickerComponentExample],
  ['recipe', DatepickerRecipeExample],
]);

@Component({
  selector: 'app-datepicker-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/datepicker/datepicker.md" />`,
})
export class DatepickerPageComponent {}
