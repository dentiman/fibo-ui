import {computed, Injectable, signal, TemplateRef} from '@angular/core';
import {Subject, takeUntil, timer} from 'rxjs';
import {Placement} from '@floating-ui/dom';
import {createOverlay} from '@fibo-ui/cdk';

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
  private content = computed(() => this.containerTemplateRef() ?? undefined);

  overlayRef = createOverlay({
    isOpen: this.isOpen,
    content: this.content,
    category: 'tooltip',
  });

  open(
    content: string | TemplateRef<unknown>,
    referenceElement: HTMLElement,
    placement: Placement,
    tooltipId: string
  ) {
    this._interactionRequest.next('open');
    timer(this.openDelay())
      .pipe(takeUntil(this._interactionRequest))
      .subscribe(() => {
        this.tooltipRef.set({content, referenceElement, placement, tooltipId});
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
        // Don't clear tooltipRef — data must stay valid during the outlet's
        // animate.leave="overlay-leave" fade. It gets overwritten on next open().
        this.isOpen.set(false);
      });
  }
}
