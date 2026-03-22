import { Directive, ElementRef, inject, input } from '@angular/core';
import { FieldShell } from './field-shell';
import { FormUiState } from './form-ui-state';

let nextFieldTargetId = 0;

@Directive({
  selector: '[fiboFieldTarget]',
  standalone: true,
  host: {
    'data-field-interactive': 'true',
    '[id]': 'controlId()',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-describedby]': 'describedBy()',
  },
})
export class FieldTargetDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly fieldShell = inject(FieldShell, { optional: true });
  private readonly formUiState = inject(FormUiState, { optional: true });
  private readonly generatedControlId = `field-target-${nextFieldTargetId++}`;

  readonly fieldTargetMode = input<'focus' | 'click'>('focus');

  element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  focus(options?: FocusOptions): void {
    this.element().focus(options);
  }

  focusReturnTarget(): HTMLElement | null {
    return this.element();
  }

  activateFromShell(): void {
    const element = this.element();

    this.focus();
    if (this.fieldTargetMode() === 'click' && !this.isDisabled(element)) {
      element.click();
    }
  }

  private isDisabled(element: HTMLElement): boolean {
    if ('disabled' in element) {
      return Boolean((element as HTMLButtonElement | HTMLInputElement).disabled);
    }

    return element.getAttribute('aria-disabled') === 'true';
  }

  controlId(): string {
    return this.fieldShell?.idFor('control') ?? this.generatedControlId;
  }

  labelledBy(): string | null {
    return this.fieldShell?.label() ? this.fieldShell.idFor('label') : null;
  }

  describedBy(): string | null {
    if (!this.fieldShell) {
      return null;
    }

    if (this.formUiState?.errorMessage()) {
      return this.fieldShell.idFor('error');
    }

    if (this.fieldShell.hint()) {
      return this.fieldShell.idFor('hint');
    }

    return null;
  }
}
