import { Component, computed, inject, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FieldAuxiliary } from './field-auxiliary';
import { FieldContainer } from './field-container';
import { FieldLabel } from './field-label';
import { FieldShellHost } from './field-shell-host';
import { FieldUiState } from './field-ui-state';
import { FormLayout } from './form-layout';

@Component({
  selector: 'fibo-field-shell',
  standalone: true,
  hostDirectives: [FieldShellHost],
  imports: [LucideAngularModule, FieldAuxiliary, FieldLabel, FieldContainer],
  host: {
    class: 'fibo-field-shell',
    '[attr.data-layout]': 'externalLayout()',
  },
  template: `
    @if (externalLayout()) {
      <label [id]="idFor('label')" class="fibo-field-shell-label">{{ label() }}</label>
    }

    <div fiboFieldContainer
      [attr.data-has-clear]="canClear() || null"
      [attr.aria-labelledby]="externalLayout() ? idFor('label') : null"
    >
      @if (iconStart()) {
        <lucide-icon [name]="iconStart()" size="16" class="fibo-field-icon shrink-0"></lucide-icon>
      }

      <div class="fibo-field-body">
        @if (!externalLayout() && label()) {
          <label fiboFieldLabel>{{ label() }}</label>
        }

        <div class="fibo-field-content">
          <ng-content></ng-content>
        </div>
      </div>

      @if (canClear()) {
        <button
          type="button"
          fiboFieldAuxiliary
          aria-label="Clear value"
          class="fibo-field-clear"
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
          class="fibo-field-icon fibo-field-icon-end shrink-0"
        ></lucide-icon>
      }
    </div>

    @if (errorMessage(); as error) {
      <div [id]="idFor('error')" class="fibo-field-error">{{ error }}</div>
    } @else if (hint()) {
      <div [id]="idFor('hint')" class="fibo-field-hint">{{ hint() }}</div>
    }
  `,
})
export class FieldShell {
  private readonly host = inject(FieldShellHost);
  private readonly formUiState = inject(FieldUiState, { optional: true });
  private readonly formLayout = inject(FormLayout, { optional: true });

  readonly label = input('');
  readonly hint = input('');
  readonly iconStart = input('');
  readonly iconEnd = input('');
  readonly canClear = input(false);

  readonly clearRequested = output<void>();

  readonly externalLayout = computed(() => this.formLayout?.formLayout() ?? null);

  readonly errorMessage = computed(() => this.formUiState?.errorMessage() ?? null);

  idFor(suffix: string): string {
    return this.host.idFor(suffix);
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    this.clearRequested.emit();
  }
}
