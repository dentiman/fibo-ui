import {
  Component,
  ElementRef,
  computed,
  contentChild,
  inject,
  input,
  output,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FieldActionDirective } from './field-action';
import { FieldOverlayAnchorDirective } from './field-overlay-anchor';
import { FieldTargetDirective } from './field-target';
import { FormUiState } from './form-ui-state';

let nextFieldShellId = 0;

@Component({
  selector: 'fibo-field-shell',
  standalone: true,
  imports: [LucideAngularModule, FieldActionDirective],
  host: {
    class: 'block',
  },
  template: `
    <div
      class="form-field-control"
      (click)="onContainerClick($event)"
      [attr.aria-disabled]="disabled() || null"
      [attr.aria-required]="required() || null"
      [attr.data-error]="hasError() || null"
      [attr.data-can-clear]="canClear() || null"
      [attr.data-readonly]="readonly() || null"
      [attr.data-pending]="pending() || null"
      [class.disabled]="disabled()"
    >
      @if (iconStart()) {
        <lucide-icon [name]="iconStart()" size="16" class="form-field-icon shrink-0"></lucide-icon>
      }

      <div class="form-field-body">
        @if (label()) {
          <label [id]="idFor('label')" [for]="idFor('control')" class="form-field-label">
            {{ label() }}
          </label>
        }

        <div class="form-field-content">
          <ng-content></ng-content>
        </div>
      </div>

      @if (canClear()) {
        <button
          type="button"
          fiboFieldAction
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
  readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly formUiState = inject(FormUiState, { optional: true });
  private readonly fieldTarget = contentChild(FieldTargetDirective, { descendants: true });
  private readonly overlayAnchor = contentChild(FieldOverlayAnchorDirective, { descendants: true });
  private readonly generatedBaseId = `field-${nextFieldShellId++}`;

  readonly id = input('');
  readonly label = input('');
  readonly hint = input('');
  readonly iconStart = input('');
  readonly iconEnd = input('');
  readonly canClear = input(false);

  readonly clearRequested = output<void>();
  readonly focusRequested = output<void>();

  readonly disabled = computed(() => this.formUiState?.disabled() ?? false);
  readonly required = computed(() => this.formUiState?.required() ?? false);
  readonly readonly = computed(() => this.formUiState?.readonly() ?? false);
  readonly pending = computed(() => this.formUiState?.pending() ?? false);
  readonly hasError = computed(
    () => (this.formUiState?.invalid() ?? false) && (this.formUiState?.touched() ?? false),
  );
  readonly errorMessage = computed(() => this.formUiState?.errorMessage() ?? null);
  readonly baseId = computed(() => this.id() || this.generatedBaseId);

  focusPrimary(options?: FocusOptions): void {
    this.fieldTarget()?.focus(options);
  }

  activatePrimaryFromShell(): void {
    this.fieldTarget()?.activateFromShell();
  }

  overlayReferenceElement(): HTMLElement {
    return this.overlayAnchor()?.element() ?? this.elementRef.nativeElement;
  }

  overlayInteractionRoot(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  overlayFocusReturnTarget(): HTMLElement | null {
    return this.fieldTarget()?.focusReturnTarget() ?? null;
  }

  idFor(suffix: string): string {
    return `${this.baseId()}-${suffix}`;
  }

  onContainerClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('button,input,textarea,select,a,label,[data-field-interactive],[data-field-action]')) {
      return;
    }

    if (this.fieldTarget()) {
      this.activatePrimaryFromShell();
      return;
    }

    this.focusRequested.emit();
  }

  onClear(event: MouseEvent) {
    event.stopPropagation();
    this.clearRequested.emit();
  }
}
