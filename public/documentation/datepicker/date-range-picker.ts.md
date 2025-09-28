```ts
import { Component, signal } from '@angular/core';
import { DateRangePicker } from '@fibo-ui/components';

@Component({
  imports: [DateRangePicker],
  template: 'date-range-picker.html'
})
export class DateRangePickerComponent {
  readonly range = signal({startDate: '2024-07-02', endDate: '2024-07-06'});
}
```
