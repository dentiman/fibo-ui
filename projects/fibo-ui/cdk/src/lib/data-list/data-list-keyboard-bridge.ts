import { Directive, effect, inject, input } from '@angular/core';
import { DataList } from './data-list';
import { KeyboardTarget, KeyboardTargetHandler } from './keyboard-target';

@Directive({
  selector: '[fiboDataListKeyboardBridge]',
})
export class DataListKeyboardBridge implements KeyboardTargetHandler {
  private readonly dataList = inject(DataList);

  readonly target = input<KeyboardTarget | null>(null, {
    alias: 'fiboDataListKeyboardBridge',
  });

  constructor() {
    effect((onCleanup) => {
      const target = this.target();
      if (!target) {
        return;
      }

      onCleanup(target.connect(this));
    });
  }

  onKeydown(event: KeyboardEvent): void {
    this.dataList.onKeydown(event);
  }

  navigateNext(event: Event): void {
    this.dataList.navigateNext(event);
  }
}
