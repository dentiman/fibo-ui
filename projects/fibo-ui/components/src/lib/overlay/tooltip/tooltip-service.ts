import { computed, Injectable, signal, TemplateRef } from '@angular/core';
import { Subject, takeUntil, timer } from 'rxjs';
import { Placement } from '@floating-ui/dom';
import { connectedPosition, createOverlay, type OverlayConfig, TOOLTIP_SHELL_TOKEN } from '@fibo-ui/cdk';

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

  private readonly overlayConfig = computed<OverlayConfig | null>(() => {
    const ref = this.tooltipRef();
    if (!ref) return null;
    return {
      content: ref.content,
      position: connectedPosition({ placement: ref.placement ?? 'top' }),
      shell: TOOLTIP_SHELL_TOKEN,
      closeOnScroll: true,
      closeOnEscape: false,
      referenceElement: ref.referenceElement,
    };
  });

  readonly overlayHandle = createOverlay(this.isOpen, this.overlayConfig, session => {
    session.afterClose(() => {
      if (!this.isOpen()) {
        this.tooltipRef.set(null);
      }
    });
  });

  open(content: string | TemplateRef<unknown>, referenceElement: HTMLElement, placement: Placement) {
    this._interactionRequest.next('open');

    if (this.isOpen() && this.tooltipRef()?.referenceElement !== referenceElement) {
      this.isOpen.set(false);
    }

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
