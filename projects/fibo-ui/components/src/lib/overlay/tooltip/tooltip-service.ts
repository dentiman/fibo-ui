import { Injectable, signal, TemplateRef } from '@angular/core';
import { Subject, takeUntil, timer } from 'rxjs';
import { Placement } from '@floating-ui/dom';
import { createSingletonOverlay } from '@fibo-ui/cdk';
import { tooltipConfig } from '../overlay-presets';

@Injectable({
  providedIn: 'root',
})
export class TooltipService {
  tooltipRef = signal<{
    content: string | TemplateRef<unknown>;
    referenceElement: HTMLElement;
    placement: Placement;
    tooltipId: string;
  } | null>(null);

  openDelay = signal<number>(100);
  closeDelay = signal<number>(100);

  private _interactionRequest = new Subject<'open' | 'close'>();

  readonly overlay = createSingletonOverlay(
    templateRef => {
      const ref = this.tooltipRef();
      if (!ref) return null;
      return tooltipConfig({
        templateRef,
        referenceElement: ref.referenceElement,
        placement: ref.placement,
      });
    },
    session => {
      session.afterClose(() => {
        if (!this.overlay.isOpen()) {
          this.tooltipRef.set(null);
        }
      });
    },
  );

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
        this.overlay.isOpen.set(true);
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
        this.overlay.isOpen.set(false);
      });
  }
}
