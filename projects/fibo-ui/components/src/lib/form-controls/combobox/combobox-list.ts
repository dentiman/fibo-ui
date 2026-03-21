import { Directive, effect, inject } from '@angular/core';
import { DataList } from '@fibo-ui/cdk';
import { injectComboboxInternal } from './combobox-internal-token';

@Directive({
  selector: '[fiboComboboxList]',
  exportAs: 'ComboboxList',
  host: {
    role: 'listbox',
    '[attr.id]': 'comboboxInternal.listboxId()',
  },
})
export class ComboboxList {
  readonly comboboxInternal = injectComboboxInternal();
  private readonly dataList = inject(DataList);

  constructor() {
    effect(() => {
      this.comboboxInternal.activeDescendantId.set(
        this.dataList.activeDataListItem()?.id() ?? null,
      );
    });
  }
}
