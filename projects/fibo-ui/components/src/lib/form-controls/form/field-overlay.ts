import { computed, Directive, inject, input, signal, TemplateRef } from '@angular/core';
import { createOverlay } from '@fibo-ui/cdk';
import { FieldTarget } from './field-target';
import { FieldShellHost } from './field-shell-host';
import { FieldUiState } from './field-ui-state';

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
export class FieldOverlay {
  private readonly interactive = inject(FieldTarget);
  private readonly host = inject(FieldShellHost, { optional: true });
  private readonly fieldUiState = inject(FieldUiState, { optional: true });

  /** Template to render inside the overlay. Bound via `[fiboFieldOverlay]="tpl"`. */
  readonly overlayContent = input.required<TemplateRef<unknown>>({ alias: 'fiboFieldOverlay' });
  /** Match the width of the reference element. Default: false. */
  readonly matchWidth = input(false);

  readonly isOpen = signal(false);

  private readonly overlayHandle = createOverlay(() => ({
    state: this.isOpen,
    content: this.overlayContent(),
    position: {
      connectedTo: this.host?.referenceElement() ?? this.interactive.element(),
      matchWidth: this.matchWidth(),
    },
    focus: {
      restoreTo: () => this.host?.focusReturnTarget() ?? this.interactive.focusReturnTarget(),
    },
  }));

  /** ID of the rendered overlay panel. Null when the overlay is closed. */
  readonly panelId = computed(() => this.overlayHandle()?.id ?? null);

  open(): void {
    if (this.fieldUiState?.disabled() || this.fieldUiState?.readonly()) return;
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    if (this.fieldUiState?.disabled() || this.fieldUiState?.readonly()) return;
    this.isOpen.update(v => !v);
  }

  onHostClick(event: MouseEvent): void {
    if (this.interactive.fieldTargetMode() !== 'click') return;
    if ((event.target as HTMLElement).closest('[data-field-auxiliary]')) return;
    this.toggle();
  }
}
