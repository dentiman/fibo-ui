import { Directive, computed, input, model } from '@angular/core';
import {
  type DisabledReason,
  type ValidationError,
  type WithOptionalField,
} from '@angular/forms/signals';

export const FORM_UI_STATE_INPUTS = [
  'disabled',
  'disabledReasons',
  'readonly',
  'hidden',
  'invalid',
  'pending',
  'touched',
  'dirty',
  'name',
  'required',
  'min',
  'minLength',
  'max',
  'maxLength',
  'pattern',
  'errors',
] as const;

@Directive({
  standalone: true,
  selector: '[fiboFormUiState]',
})
export class FormUiState {
  readonly disabled = input(false);
  readonly disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);
  readonly readonly = input(false);
  readonly hidden = input(false);
  readonly invalid = input(false);
  readonly pending = input(false);
  readonly touched = model(false);
  readonly dirty = input(false);
  readonly name = input('');
  readonly required = input(false);
  readonly min = input<number | undefined>(undefined);
  readonly minLength = input<number | undefined>(undefined);
  readonly max = input<number | undefined>(undefined);
  readonly maxLength = input<number | undefined>(undefined);
  readonly pattern = input<readonly RegExp[]>([]);
  readonly errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  readonly errorMessage = computed(() => {
    if (this.invalid() && this.touched() && this.errors().length > 0) {
      return this.errors()[0]?.message ?? null;
    }

    return null;
  });
}
