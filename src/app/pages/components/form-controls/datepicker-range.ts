import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocViewer } from '../../../common/doc-viewer/doc-viewer';
import { EXAMPLE_REGISTRY } from '../../../common/doc-viewer/example-registry';
import { DatepickerRangeExample } from './examples/datepicker-range-example';

const EXAMPLES = new Map<string, any>([['datepicker-range', DatepickerRangeExample]]);

@Component({
  selector: 'app-datepicker-range-page',
  imports: [DocViewer],
  providers: [{ provide: EXAMPLE_REGISTRY, useValue: EXAMPLES }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<doc-viewer docUrl="/documentation/datepicker-range/datepicker-range.md" />`,
})
export class DatepickerRangePageComponent {}
