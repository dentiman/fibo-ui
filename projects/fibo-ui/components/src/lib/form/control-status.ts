import {computed, Directive, Input, input, Self} from '@angular/core';
import { AbstractControlDirective, NgControl, Validators } from '@angular/forms';

@Directive({
  selector: '[ControlStatus]',
  standalone: true,
  host: {
    '[attr.data-untouched]': 'isUntouched',
    '[attr.data-touched]': 'isTouched',
    '[attr.aria-invalid]': 'isInvalid',
    '[attr.data-dirty]': 'isDirty',
    '[attr.data-error]': '(isInvalid && (isTouched || isDirty)) || null',
    '[attr.data-pending]': 'isPending',
    '[attr.aria-disabled]': 'isDisabled',
    '[attr.aria-required]': 'requiredState()',
    // for input
    '[disabled]': 'isDisabled',
    '[required]': 'requiredState()',
  }
})
export class ControlStatus {

  private _cd: AbstractControlDirective|null;
  constructor(@Self() cd: NgControl) {
    this._cd = cd;
  }

  protected get isTouched() {
    return !!this._cd?.control?.touched;
  }

  protected get isUntouched() {
    return !!this._cd?.control?.untouched;
  }

  protected get isPristine() {
    return !!this._cd?.control?.pristine;
  }

  protected get isDirty() {
    return !!this._cd?.control?.dirty;
  }

  protected get isValid() {
    return !!this._cd?.control?.valid;
  }

  protected get isInvalid() {
    return !!this._cd?.control?.invalid;
  }

  protected get isPending() {
    return !!this._cd?.control?.pending;
  }
  protected get isDisabled() {
    return !!this._cd?.control?.disabled;
  }

  required = input(false);

  requiredState = computed(() => this.required() ?? this._cd?.control?.hasValidator(Validators.required) ?? false);


}


@Directive({
  selector: '[ControlStatusFor]',
  standalone: true,
  host: {
    '[attr.data-untouched]': 'isUntouched',
    '[attr.data-touched]': 'isTouched',
    '[attr.aria-invalid]': 'isInvalid',
    '[attr.data-dirty]': 'isDirty',
    '[attr.data-error]': '(isInvalid && (isTouched || isDirty)) || null',
    '[attr.data-pending]': 'isPending',
    '[attr.aria-disabled]': 'isDisabled',
    '[attr.aria-required]': 'requiredState()',
    // for input
    '[disabled]': 'isDisabled',
    '[required]': 'requiredState()',
  }
})
export class ControlStatusFor {

  @Input({alias:'ControlStatusFor'})  _cd!: AbstractControlDirective|null;

  protected get isTouched() {
    return !!this._cd?.control?.touched;
  }

  protected get isUntouched() {
    return !!this._cd?.control?.untouched;
  }

  protected get isPristine() {
    return !!this._cd?.control?.pristine;
  }

  protected get isDirty() {
    return !!this._cd?.control?.dirty;
  }

  protected get isValid() {
    return !!this._cd?.control?.valid;
  }

  protected get isInvalid() {
    return !!this._cd?.control?.invalid;
  }

  protected get isPending() {
    return !!this._cd?.control?.pending;
  }
  protected get isDisabled() {
    return !!this._cd?.control?.disabled;
  }

  required = input(false);

  requiredState = computed(() => this.required() ?? this._cd?.control?.hasValidator(Validators.required) ?? false);


}
