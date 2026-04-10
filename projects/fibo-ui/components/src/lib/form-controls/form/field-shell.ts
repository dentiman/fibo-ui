import { Component, computed, contentChild, inject, input, output, viewChild } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FieldAuxiliaryDirective } from './field-auxiliary';
import { FieldContainerDirective } from './field-container';
import { FieldLabelDirective } from './field-label';
import { FieldOverlayAnchorDirective } from './field-overlay-anchor';
import { FormUiState } from './form-ui-state';

@Component({
  selector: 'fibo-field-shell',
  standalone: true,
  imports: [LucideAngularModule, FieldContainerDirective, FieldAuxiliaryDirective, FieldLabelDirective],
  host: {
    class: 'block',
  },
  template: `
    <div
      fiboFieldContainer
      class="form-field-control"
      [attr.data-can-clear]="canClear() || null"
      (focusRequested)="onContainerFocusRequested()"
    >
      @if (iconStart()) {
        <lucide-icon [name]="iconStart()" size="16" class="form-field-icon shrink-0"></lucide-icon>
      }

      <div class="form-field-body">
        @if (label()) {
          <label fiboFieldLabel class="form-field-label">{{ label() }}</label>
        }

        <div class="form-field-content">
          <ng-content></ng-content>
        </div>
      </div>

      @if (canClear()) {
        <button
          type="button"
          fiboFieldAuxiliary
          aria-label="Clear value"
          class="form-field-clear-icon"
          (pointerdown)="$event.preventDefault()"
          (click)="onClear($event)"
        >
          <lucide-icon name="X" size="16"></lucide-icon>
        </button>
      }

      @if (iconEnd()) {
        <lucide-icon
          [name]="iconEnd()"
          size="16"
          class="form-field-icon form-field-icon-end shrink-0"
        ></lucide-icon>
      }
    </div>

    @if (errorMessage(); as error) {
      <div [id]="idFor('error')" class="form-field-error">{{ error }}</div>
    } @else if (hint()) {
      <div [id]="idFor('hint')" class="form-field-hint">{{ hint() }}</div>
    }
  `,
})
export class FieldShell {
  private readonly formUiState = inject(FormUiState, { optional: true });
  private readonly container = viewChild.required(FieldContainerDirective);
  private readonly overlayAnchor = contentChild(FieldOverlayAnchorDirective, { descendants: true });

  readonly label = input('');
  readonly hint = input('');
  readonly iconStart = input('');
  readonly iconEnd = input('');
  readonly canClear = input(false);

  readonly clearRequested = output<void>();
  readonly focusRequested = output<void>();

  readonly errorMessage = computed(() => this.formUiState?.errorMessage() ?? null);

  idFor(suffix: string): string {
    return this.container().idFor(suffix);
  }

  overlayReferenceElement(): HTMLElement {
    return this.overlayAnchor()?.element() ?? this.container().elementRef.nativeElement;
  }

  overlayInteractionRoot(): HTMLElement {
    return this.container().overlayInteractionRoot();
  }

  overlayFocusReturnTarget(): HTMLElement | null {
    return this.container().overlayFocusReturnTarget();
  }

  focusPrimary(options?: FocusOptions): void {
    this.container().focusPrimary(options);
  }

  activatePrimaryFromShell(): void {
    this.container().activatePrimaryFromShell();
  }

  onContainerFocusRequested(): void {
    this.focusRequested.emit();
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    this.clearRequested.emit();
  }
}
