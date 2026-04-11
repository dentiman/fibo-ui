import { computed, Directive, inject, input, signal, TemplateRef } from '@angular/core';
import { createConnectedOverlay } from '@fibo-ui/cdk';
import { FieldInteractiveDirective } from './field-interactive';
import { FieldShellHostDirective } from './field-shell-host';
import { FormUiState } from './form-ui-state';

@Directive({
  selector: '[fiboFieldOverlay]',
  standalone: true,
  exportAs: 'fiboFieldOverlay',
  host: {
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-controls]': 'panelId()',
    '(click)': 'onHostClick($event)',
  },
})
export class FieldOverlayDirective {
  private readonly interactive = inject(FieldInteractiveDirective);
  private readonly host = inject(FieldShellHostDirective, { optional: true });
  private readonly formUiState = inject(FormUiState, { optional: true });

  /** Template to render inside the overlay. Bound via `[fiboFieldOverlay]="tpl"`. */
  readonly overlayContent = input.required<TemplateRef<unknown>>({ alias: 'fiboFieldOverlay' });
  /** Match the width of the reference element. Default: false. */
  readonly matchWidth = input(false);

  readonly isOpen = signal(false);

  private readonly overlayHandle = createConnectedOverlay(
    this.isOpen,
    () => ({
      referenceElement: this.host?.referenceElement() ?? this.interactive.element(),
      matchWidth: this.matchWidth(),
    }),
    this.overlayContent,
    { restoreFocusTo: () => this.host?.focusReturnTarget() ?? this.interactive.focusReturnTarget() },
  );

  /** ID of the rendered overlay panel. Null when the overlay is closed. */
  readonly panelId = computed(() => this.overlayHandle()?.id ?? null);

  open(): void {
    if (this.formUiState?.disabled() || this.formUiState?.readonly()) return;
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    if (this.formUiState?.disabled() || this.formUiState?.readonly()) return;
    this.isOpen.update(v => !v);
  }

  onHostClick(event: MouseEvent): void {
    if (this.interactive.fieldInteractiveMode() !== 'click') return;
    if ((event.target as HTMLElement).closest('[data-field-auxiliary]')) return;
    this.toggle();
  }
}
