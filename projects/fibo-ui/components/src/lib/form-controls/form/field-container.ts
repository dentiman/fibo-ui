import { computed, contentChild, Directive, ElementRef, inject, InjectionToken, output } from '@angular/core';
import { FormUiState } from './form-ui-state';

export interface FieldInteractiveRef {
  focus(options?: FocusOptions): void;
  focusReturnTarget(): HTMLElement | null;
  activateFromShell(): void;
}

export const FIELD_INTERACTIVE = new InjectionToken<FieldInteractiveRef>('FIELD_INTERACTIVE');
export const FIELD_LABEL = new InjectionToken<unknown>('FIELD_LABEL');

let nextFieldContainerId = 0;

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
  private readonly fieldInteractive = contentChild(FIELD_INTERACTIVE, { descendants: true });
  private readonly fieldLabel = contentChild(FIELD_LABEL, { descendants: true });

  private readonly baseId = `field-${nextFieldContainerId++}`;

  idFor(suffix: string): string {
    return `${this.baseId}-${suffix}`;
  }

  readonly hasLabel = computed(() => !!this.fieldLabel());

  readonly disabled = computed(() => this.formUiState?.disabled() ?? false);
  readonly required = computed(() => this.formUiState?.required() ?? false);
  readonly readonly = computed(() => this.formUiState?.readonly() ?? false);
  readonly pending = computed(() => this.formUiState?.pending() ?? false);
  readonly hasError = computed(
    () => (this.formUiState?.invalid() ?? false) && (this.formUiState?.touched() ?? false),
  );

  readonly focusRequested = output<void>();

  focusPrimary(options?: FocusOptions): void {
    this.fieldInteractive()?.focus(options);
  }

  activatePrimaryFromShell(): void {
    this.fieldInteractive()?.activateFromShell();
  }

  overlayFocusReturnTarget(): HTMLElement | null {
    return this.fieldInteractive()?.focusReturnTarget() ?? null;
  }

  overlayInteractionRoot(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  onContainerClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      target.closest(
        'button,input,textarea,select,a,label,[data-field-interactive],[data-field-auxiliary]',
      )
    ) {
      return;
    }

    if (this.fieldInteractive()) {
      this.activatePrimaryFromShell();
      return;
    }

    this.focusRequested.emit();
  }
}
