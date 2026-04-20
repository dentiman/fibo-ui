import { computed, Directive, ElementRef, inject, input, signal, TemplateRef } from '@angular/core';
import { createOverlay } from '@fibo-ui/cdk';
import { FieldButton } from './field-button';
import { FieldShellHost } from './field-shell-host';
import { FieldUiState } from './field-ui-state';

@Directive({
  selector: '[fiboFieldOverlay]',
  standalone: true,
  exportAs: 'fiboFieldOverlay',
  host: {
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-controls]': 'panelId()',
    '[attr.data-overlay-open]': 'isOpen() || null',
    '(click)': 'onHostClick($event)',
  },
})
export class FieldOverlay {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly host = inject(FieldShellHost, { optional: true });
  private readonly button = inject(FieldButton, { optional: true });
  private readonly fieldUiState = inject(FieldUiState, { optional: true });

  readonly overlayContent = input.required<TemplateRef<unknown>>({ alias: 'fiboFieldOverlay' });
  readonly matchWidth = input(false);

  readonly isOpen = signal(false);

  private readonly overlayHandle = createOverlay(() => ({
    state: this.isOpen,
    content: this.overlayContent(),
    position: {
      connectedTo: this.host?.referenceElement() ?? this.elementRef.nativeElement,
      matchWidth: this.matchWidth(),
    },
    focus: {
      restoreTo: () => this.host?.focusReturnTarget() ?? this.elementRef.nativeElement,
    },
  }));

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
    if ((event.target as HTMLElement).closest('[data-field-auxiliary]')) return;
    this.toggle();
  }
}
