import {computed, DestroyRef, Directive, effect, inject, model, OnDestroy, OnInit, signal} from '@angular/core';
import {ControlValueAccessor, FormControlStatus, NgControl, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Directive({
  exportAs: 'PrimitiveValueAccessor',
  standalone: true,
})
export class PrimitiveValueAccessor<T> implements ControlValueAccessor, OnInit{
  private readonly destroyRef = inject(DestroyRef);
  public  readonly ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  public readonly status = signal<FormControlStatus | undefined>(undefined);


  value = model<T | null>(null)
  disabled = model<boolean>(false)

  ngOnInit() {
    if (this.ngControl?.statusChanges) {
      this.ngControl.statusChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(status => {
          this.status.set(status);
          this.touched.set(!!this.ngControl?.control?.touched)
        });
    }
  }


  readonly hasError = computed(() => {
    this.status();
    this.touched();
    if (!this.ngControl) return false;
    return this.ngControl.invalid && this.ngControl.touched;
  });

  readonly isRequired = computed(() => {
    this.status()
    if (!this.ngControl?.control) return false;
    return this.ngControl?.control.hasValidator(Validators.required)
  });

  readonly touched = signal<boolean>(false)

  /** @ignore */
  public constructor() {
    if (this.ngControl != null) this.ngControl.valueAccessor = this;
  }


  public onChange: (value: T) => void = () => {
  };
  public onTouched: () => void = () => {
  };

  writeValue(value: T): void {
    this.value.set(value);
    this.touched.set(!!this.ngControl?.control?.touched)
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
    // Subscribe to value changes
    this.value?.subscribe(value => {
      // @ts-ignore
      this.onChange(value);
    });
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = () => {
      fn();
      this.touched.set(!!this.ngControl?.control?.touched)
    };
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

}
