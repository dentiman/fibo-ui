import { computed, Directive, ElementRef, inject, signal } from '@angular/core';

export interface FieldInteractiveRef {
  focus(options?: FocusOptions): void;
  focusReturnTarget(): HTMLElement | null;
  activateFromShell(): void;
}

let nextFieldShellHostId = 0;

@Directive({
  selector: '[fiboFieldShellHost]',
  standalone: true,
  exportAs: 'fiboFieldShellHost',
})
export class FieldShellHostDirective {
  readonly elementRef = inject(ElementRef<HTMLElement>);

  private readonly baseId = `field-${nextFieldShellHostId++}`;
  private readonly _containerEl = signal<HTMLElement | null>(null);
  private readonly _interactive = signal<FieldInteractiveRef | null>(null);
  private readonly _hasLabel = signal(false);

  readonly hasLabel = this._hasLabel.asReadonly();
  readonly hasInteractive = computed(() => !!this._interactive());

  idFor(suffix: string): string {
    return `${this.baseId}-${suffix}`;
  }

  setHasLabel(value: boolean): void {
    this._hasLabel.set(value);
  }

  registerContainerElement(el: HTMLElement): void {
    this._containerEl.set(el);
  }

  registerInteractive(ref: FieldInteractiveRef): void {
    this._interactive.set(ref);
  }

  referenceElement(): HTMLElement {
    return this._containerEl() ?? this.elementRef.nativeElement;
  }

  focusReturnTarget(): HTMLElement | null {
    return this._interactive()?.focusReturnTarget() ?? null;
  }

  activatePrimary(): void {
    this._interactive()?.activateFromShell();
  }
}
