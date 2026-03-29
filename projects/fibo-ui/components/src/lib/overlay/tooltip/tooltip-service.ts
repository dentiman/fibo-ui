import { computed, Injectable, signal, TemplateRef } from '@angular/core';
import { Subject, takeUntil, timer } from 'rxjs';
import { Placement } from '@floating-ui/dom';
import { createOverlay } from '@fibo-ui/cdk';
import { tooltipConfig } from '../overlay-presets';

@Injectable({
  providedIn: 'root',
})
export class TooltipService {
  containerTemplateRef = signal<TemplateRef<any> | null>(null);

  tooltipRef = signal<{
    content: string | TemplateRef<unknown>;
    referenceElement: HTMLElement;
    placement: Placement;
    tooltipId: string;
  } | null>(null);

  openDelay = signal<number>(100);
  closeDelay = signal<number>(100);

  private _interactionRequest = new Subject<'open' | 'close'>();
  private isOpen = signal(false);

  overlayConfig = computed(() => {
    const templateRef = this.containerTemplateRef();
    const ref = this.tooltipRef();
    if (!templateRef || !ref) return null;

    return tooltipConfig({
      templateRef,
      referenceElement: ref.referenceElement,
      placement: ref.placement,
    });
  });

  overlayHandle = createOverlay(this.isOpen, this.overlayConfig, overlay => {
    overlay.afterClose(() => {
      if (!this.isOpen()) {
        this.tooltipRef.set(null);
      }
    });
  });

  open(
    content: string | TemplateRef<unknown>,
    referenceElement: HTMLElement,
    placement: Placement,
    tooltipId: string,
  ) {
    this._interactionRequest.next('open');
    timer(this.openDelay())
      .pipe(takeUntil(this._interactionRequest))
      .subscribe(() => {
        this.tooltipRef.set({ content, referenceElement, placement, tooltipId });
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
