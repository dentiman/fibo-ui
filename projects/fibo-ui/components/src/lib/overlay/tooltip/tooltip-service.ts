import { computed, Injectable, signal, TemplateRef } from '@angular/core';
import { Subject, takeUntil, timer } from 'rxjs';
import { Placement } from '@floating-ui/dom';
import { createConnectedOverlay, TOOLTIP_SHELL_TOKEN } from '@fibo-ui/cdk';

@Injectable({
  providedIn: 'root',
})
export class TooltipService {
  tooltipRef = signal<{
    content: string | TemplateRef<unknown>;
    referenceElement: HTMLElement;
    placement: Placement;
  } | null>(null);

  openDelay = signal<number>(100);
  closeDelay = signal<number>(100);

  private _interactionRequest = new Subject<'open' | 'close'>();
  private readonly isOpen = signal(false);

  private readonly content = computed(() => this.tooltipRef()?.content ?? null);

  readonly overlay = createConnectedOverlay(
    this.isOpen,
    () => ({
      referenceElement: this.tooltipRef()?.referenceElement ?? null,
      placement: this.tooltipRef()?.placement ?? 'top',
    }),
    this.content,
    {
    shell: TOOLTIP_SHELL_TOKEN,
    closeOnScroll: true,
    closeOnEscape: false,
    closeOnOutsideClick: false,
    closeOnFocusLeave: false,
    setup: session => {
      session.afterClose(() => {
        if (!this.isOpen()) {
          this.tooltipRef.set(null);
        }
      });
    },
  });

  open(content: string | TemplateRef<unknown>, referenceElement: HTMLElement, placement: Placement) {
    this._interactionRequest.next('open');

    timer(this.openDelay())
      .pipe(takeUntil(this._interactionRequest))
      .subscribe(() => {
        this.tooltipRef.set({ content, referenceElement, placement });
        this.isOpen.set(true);
      });
  }

  keepOpen() {
    this._interactionRequest.next('open');
  }

  close() {
    this._interactionRequest.next('close');
    timer(this.closeDelay())
      .pipe(takeUntil(this._interactionRequest))
      .subscribe(() => {
        this.isOpen.set(false);
      });
  }
}
