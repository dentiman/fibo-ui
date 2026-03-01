import {inject, Injectable, signal, TemplateRef} from '@angular/core';
import {Subject, takeUntil, timer} from 'rxjs';
import {Placement} from '@floating-ui/dom';
import {OverlayRegistry} from '@fibo-ui/cdk';

@Injectable({
  providedIn: 'root',
})
export class TooltipService {
  private registry = inject(OverlayRegistry);

  containerTemplateRef = signal<TemplateRef<any> | null>(null);

  tooltipRef = signal<{
    content: string | TemplateRef<unknown>;
    referenceElement: HTMLElement;
    placement: Placement;
  } | null>(null);

  openDelay = signal<number>(100);
  closeDelay = signal<number>(100);

  private _interactionRequest = new Subject<'open' | 'close'>();

  open(content: string | TemplateRef<unknown>, referenceElement: HTMLElement, placement: Placement) {
    this._interactionRequest.next('open');
    timer(this.openDelay())
      .pipe(takeUntil(this._interactionRequest))
      .subscribe(() => {
        this.tooltipRef.set({ content, referenceElement, placement });
        const tpl = this.containerTemplateRef();
        if (tpl) {
          this.registry.register('tooltip', tpl, undefined, 'tooltip');
        }
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
        this.registry.unregister('tooltip');
      });
  }
}
