```ts
import {Component, signal} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MultipleSelect} from '@fibo-ui/components';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

interface User { id: number; label: string; }

@Component({
  selector: 'demo-multiple-select-styles-states',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultipleSelect],
  templateUrl: './styles-states.html',
})
export class DemoMultipleSelectStylesStatesComponent {
  readonly items = signal<User[]>([
    { id: 1, label: 'Alice' },
    { id: 2, label: 'Bob' },
    { id: 3, label: 'Charlie' },
  ]);

  readonly floatingLabelCtrl = new FormControl<number[]>([]);
  readonly fixedLabelCtrl = new FormControl<number[]>([]);
  readonly disabledCtrl = new FormControl<number[] | null>({ value: [], disabled: true });
  readonly errorCtrl = new FormControl<number[]>([]);

  readonly floatingLabelCtrl2 = new FormControl<number[]>([]);
  readonly fixedLabelCtrl2 = new FormControl<number[]>([]);
  readonly disabledCtrl2 = new FormControl<number[] | null>({ value: [], disabled: true });
  readonly errorCtrl2 = new FormControl<number[]>([]);
}
```


