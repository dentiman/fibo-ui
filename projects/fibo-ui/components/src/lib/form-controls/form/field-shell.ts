import { Component, ElementRef, EventEmitter, Output, computed, inject, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormUiState } from './form-ui-state';

@Component({
  selector: 'fibo-field-shell',
  standalone: true,
  imports: [LucideAngularModule],
  host: {
    class: 'block',
    '(click)': 'onContainerClick($event)',
  },
  template: `
    <div
      class="form-field-control"
      [attr.aria-disabled]="disabled() || null"
      [attr.aria-required]="required() || null"
      [attr.data-error]="hasError() || null"
      [attr.data-can-clear]="canClear() || null"
      [class.disabled]="disabled()"
    >
      @if (iconStart()) {
        <lucide-icon [name]="iconStart()" size="16" class="form-field-icon shrink-0"></lucide-icon>
      }

      <div class="form-field-body">
        @if (label()) {
          <label [for]="id() || null" class="form-field-label">{{ label() }}</label>
        }

        <div class="form-field-content">
          <ng-content></ng-content>
        </div>
      </div>

      @if (canClear()) {
        <lucide-icon
          name="X"
          size="16"
          class="form-field-clear-icon"
          (click)="onClear($event)"
        ></lucide-icon>
      }

      @if (iconEnd()) {
        <lucide-icon
          [name]="iconEnd()"
          size="16"
          class="form-field-icon form-field-icon-end shrink-0"
        ></lucide-icon>
      }
    </div>
  `,
})
export class FieldShell {
  readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly formUiState = inject(FormUiState, { optional: true });

  readonly id = input('');
  readonly label = input('');
  readonly iconStart = input('');
  readonly iconEnd = input('');
  readonly clearable = input(false);
  readonly hasValue = input(false);

  @Output() readonly clearRequested = new EventEmitter<void>();
  @Output() readonly focusRequested = new EventEmitter<void>();

  readonly disabled = computed(() => this.formUiState?.disabled() ?? false);
  readonly required = computed(() => this.formUiState?.required() ?? false);
  readonly hasError = computed(
    () => (this.formUiState?.invalid() ?? false) && (this.formUiState?.touched() ?? false),
  );
  readonly canClear = computed(() => this.clearable() && this.hasValue());

  onContainerClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('button,input,textarea,select,a,label,[data-field-interactive],[data-field-action]')) {
      return;
    }

    this.focusRequested.emit();
  }

  onClear(event: MouseEvent) {
    event.stopPropagation();
    this.clearRequested.emit();
  }
}
