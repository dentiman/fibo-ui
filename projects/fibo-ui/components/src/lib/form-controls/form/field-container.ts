import { computed, Directive, ElementRef, inject } from '@angular/core';
import { FieldShellHostDirective } from './field-shell-host';
import { FormUiState } from './form-ui-state';

@Directive({
  selector: '[fiboFieldContainer]',
  standalone: true,
  exportAs: 'FieldContainer',
  host: {
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-required]': 'required() || null',
    '[attr.data-error]': 'hasError() || null',
    '[attr.data-readonly]': 'readonly() || null',
    '[attr.data-pending]': 'pending() || null',
    '[class.disabled]': 'disabled()',
    '(click)': 'onContainerClick($event)',
  },
})
export class FieldContainerDirective {
  readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly formUiState = inject(FormUiState, { optional: true });
  private readonly host = inject(FieldShellHostDirective, { optional: true });

  constructor() {
    this.host?.registerContainerElement(this.elementRef.nativeElement);
  }

  readonly disabled = computed(() => this.formUiState?.disabled() ?? false);
  readonly required = computed(() => this.formUiState?.required() ?? false);
  readonly readonly = computed(() => this.formUiState?.readonly() ?? false);
  readonly pending = computed(() => this.formUiState?.pending() ?? false);
  readonly hasError = computed(
    () => (this.formUiState?.invalid() ?? false) && (this.formUiState?.touched() ?? false),
  );

  onContainerClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      target.closest(
        'button,input,textarea,select,a,label,[data-field-interactive],[data-field-auxiliary]',
      )
    ) {
      return;
    }

    this.host?.activatePrimary();
  }
}
