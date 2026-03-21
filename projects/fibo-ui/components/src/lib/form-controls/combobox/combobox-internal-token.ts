import {
  Injectable,
  inject,
  signal,
} from '@angular/core';

let nextComboboxListboxId = 0;

@Injectable()
export class ComboboxInternal {
  readonly listboxId = signal(`fibo-combobox-listbox-${nextComboboxListboxId++}`);
  readonly activeDescendantId = signal<string | null>(null);
}

export function injectComboboxInternal(): ComboboxInternal {
  return inject(ComboboxInternal);
}
