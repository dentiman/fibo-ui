import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateRangePicker} from '@fibo-ui/components';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-date-range-picker',
  imports: [CommonModule, DateRangePicker, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Date range picker</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70">
        <fibo-date-range-picker [label]="'Confirm Dates'" [(value)]="range"></fibo-date-range-picker>
      </div>
    </app-usage-demo>
  `,
})
export class DateRangePickerExampleComponent {
  readonly range = signal({startDate: '2024-07-02', endDate: '2024-07-06'});

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/datepicker/date-range-picker.html.md' },
    { name: 'ts', path: '/documentation/datepicker/date-range-picker.ts.md' }
  ];
}
