import { computed, Directive, ElementRef, inject } from '@angular/core';
import { FieldShellHost } from './field-shell-host';
import { FieldUiState } from './field-ui-state';

@Directive({
  selector: '[fiboFieldContainer]',
  standalone: true,
  exportAs: 'FieldContainer',
  host: {
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.data-invalid]': 'hasError() || null',
    '[attr.data-readonly]': 'readonly() || null',
    '[attr.data-pending]': 'pending() || null',
    '[class.disabled]': 'disabled()',
    '(click)': 'onContainerClick($event)',
  },
})
export class FieldContainer {
  readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly fieldUiState = inject(FieldUiState, { optional: true });
  private readonly host = inject(FieldShellHost, { optional: true });

  constructor() {
    this.host?.registerContainerElement(this.elementRef.nativeElement);
  }

  readonly disabled = computed(() => this.fieldUiState?.disabled() ?? false);
  readonly readonly = computed(() => this.fieldUiState?.readonly() ?? false);
  readonly pending = computed(() => this.fieldUiState?.pending() ?? false);
  readonly hasError = computed(
    () => (this.fieldUiState?.invalid() ?? false) && (this.fieldUiState?.touched() ?? false),
  );

  onContainerClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      target.closest(
        'button,input,textarea,select,a,label,[data-field-target],[data-field-auxiliary]',
      )
    ) {
      return;
    }

    this.host?.activatePrimary();
  }
}
