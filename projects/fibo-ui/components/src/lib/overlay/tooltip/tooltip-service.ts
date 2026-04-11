import { Injectable, signal, TemplateRef } from '@angular/core';
import { Subject, takeUntil, timer } from 'rxjs';
import { Placement } from '@floating-ui/dom';
import { createOverlay, TOOLTIP_SHELL_TOKEN } from '@fibo-ui/cdk';

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

  readonly overlay = createOverlay(() => ({
    state: this.isOpen,
    content: this.tooltipRef()?.content ?? null,
    position: {
      connectedTo: this.tooltipRef()?.referenceElement ?? null,
      placement: this.tooltipRef()?.placement ?? 'top',
    },
    shell: TOOLTIP_SHELL_TOKEN,
    focus: { trap: false },
    close: {
      outsideClick: false,
      escape: false,
      focusLeave: false,
      scroll: true,
    },
    lifecycle: {
      afterClose: [
        () => {
          if (!this.isOpen()) this.tooltipRef.set(null);
        },
      ],
    },
  }));

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
