import { Directive, effect, inject, untracked } from '@angular/core';
import { injectFormValueControl } from '@fibo-ui/cdk';
import { injectComboboxControl } from './combobox-control-token';
import { injectComboboxInternal } from './combobox-internal-token';

@Directive({
  selector: 'input[fiboComboboxInput]',
  exportAs: 'ComboboxInput',
  host: {
    type: 'text',
    role: 'combobox',
    autocomplete: 'off',
    autocorrect: 'off',
    autocapitalize: 'none',
    spellcheck: 'false',
    'aria-autocomplete': 'list',
    'aria-haspopup': 'listbox',
    '[value]': 'combobox.query()',
    '[disabled]': 'formControl.disabled?.() ?? false',
    '[required]': 'formControl.required?.() ?? false',
    '[attr.aria-required]': 'formControl.required?.() ?? false',
    '[attr.aria-invalid]': 'formControl.invalid?.() ?? false',
    '[attr.aria-expanded]': 'combobox.expanded()',
    '[attr.aria-controls]': 'combobox.expanded() ? comboboxInternal.listboxId() : null',
    '[attr.aria-activedescendant]': 'combobox.expanded() ? comboboxInternal.activeDescendantId() : null',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class ComboboxInput {
  readonly combobox = injectComboboxControl<string | number | null, string | number>();
  readonly formControl = injectFormValueControl<string | number | null>();
  readonly comboboxInternal = injectComboboxInternal();

  constructor() {
    effect(() => {
      if (!this.combobox.expanded()) {
        this.comboboxInternal.activeDescendantId.set(null);
      }
    });

    effect(() => {
      const value = this.combobox.value();
      const valueText = value !== null ? String(value) : '';

      if (untracked(() => this.combobox.query()) !== valueText) {
        this.combobox.query.set(valueText);
      }
    });

    effect(() => {
      const disabled = this.formControl.disabled?.() ?? false;
      const hasOptions = this.combobox.options().length > 0;

      if (this.combobox.expanded() && (disabled || !hasOptions)) {
        this.collapse();
      }
    });
  }

  private collapse() {
    this.combobox.expanded.set(false);
    this.comboboxInternal.activeDescendantId.set(null);
  }

  private resetInputValue() {
    this.combobox.query.set(this.currentValueText());
  }

  private currentValueText() {
    const value = this.combobox.value();
    return value !== null ? String(value) : '';
  }

  onInput(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.combobox.query.set(text);

    if (!text) {
      this.combobox.value.set(null);
      this.collapse();
      return;
    }

    this.combobox.expanded.set(this.combobox.options().length > 0);
  }

  onBlur() {
    queueMicrotask(() => {
      if (!this.combobox.expanded()) {
        this.resetInputValue();
      }
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.collapse();
      this.resetInputValue();
      event.preventDefault();
      return;
    }

    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && !this.combobox.expanded()) {
      if (this.combobox.options().length > 0) {
        this.combobox.expanded.set(true);
      }
      event.preventDefault();
    }
  }
}
