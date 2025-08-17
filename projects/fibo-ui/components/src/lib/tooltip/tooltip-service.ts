import {ElementRef, Injectable, signal, TemplateRef} from '@angular/core';
import {Subject, takeUntil, timer} from 'rxjs';
import {Placement} from '@floating-ui/dom';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  tooltipRef = signal<{
    content:string | TemplateRef<unknown>,
    referenceElement:HTMLElement,
    placement:Placement
  }|null>(null)


  openDelay = signal<number>(100);
  closeDelay = signal<number>(100);

  private _interactionRequest = new Subject<'open' | 'close'>();

  open(content: string | TemplateRef<unknown>, referenceElement: HTMLElement, placement:Placement) {
    this._interactionRequest.next('open');
    timer(this.openDelay())
      .pipe(takeUntil(this._interactionRequest))
      .subscribe(() => {
        this.tooltipRef.set({
          content,
          referenceElement,
          placement
        })
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
        this.tooltipRef.set(null);
      });
  }

}
