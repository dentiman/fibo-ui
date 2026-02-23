import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { DatepickerExample } from './examples/datepicker-example';
import { DatepickerComponentExample } from './examples/datepicker-component-example';

const EXAMPLES = new Map<string, any>([
  ['datepicker', DatepickerExample],
  ['datepicker-component', DatepickerComponentExample],
]);

@Component({
  selector: 'app-datepicker-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/datepicker/datepicker.md" />`,
})
export class DatepickerPageComponent {}
