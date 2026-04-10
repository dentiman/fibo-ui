import { Component, computed, inject, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FieldAuxiliaryDirective } from './field-auxiliary';
import { FieldContainerDirective } from './field-container';
import { FieldLabelDirective } from './field-label';
import { FieldShellHostDirective } from './field-shell-host';
import { FormUiState } from './form-ui-state';

@Component({
  selector: 'fibo-field-shell',
  standalone: true,
  hostDirectives: [FieldShellHostDirective],
  imports: [LucideAngularModule, FieldAuxiliaryDirective, FieldLabelDirective, FieldContainerDirective],
  host: {
    class: 'block',
  },
  template: `
    <div fiboFieldContainer class="form-field-control" [attr.data-can-clear]="canClear() || null">
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
  private readonly host = inject(FieldShellHostDirective);
  private readonly formUiState = inject(FormUiState, { optional: true });

  readonly label = input('');
  readonly hint = input('');
  readonly iconStart = input('');
  readonly iconEnd = input('');
  readonly canClear = input(false);

  readonly clearRequested = output<void>();

  readonly errorMessage = computed(() => this.formUiState?.errorMessage() ?? null);

  idFor(suffix: string): string {
    return this.host.idFor(suffix);
  }

  overlayReferenceElement(): HTMLElement {
    return this.host.referenceElement();
  }

  overlayFocusReturnTarget(): HTMLElement | null {
    return this.host.focusReturnTarget();
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    this.clearRequested.emit();
  }
}
