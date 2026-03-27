import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, Injector, ViewEncapsulation, computed, inject } from '@angular/core';
import { OverlayHandle, OVERLAY_HANDLE } from './overlay-handle';
import { Popover } from '../popover/popover';

@Component({
  selector: 'fibo-overlay-connected-shell',
  imports: [CommonModule, NgTemplateOutlet, Popover],
  template: `
    <div
      fiboPopover
      class="overlay-connected-shell popover-container"
      [referenceElement]="referenceElement()"
      [placement]="placement()"
      [matchWidth]="matchWidth()"
      [offset]="offset()"
    >
      @if (handle.templateRef) {
        <ng-container *ngTemplateOutlet="handle.templateRef; injector: injector"></ng-container>
      }
    </div>
  `,
  host: {
    style: 'display: contents;',
  },
  encapsulation: ViewEncapsulation.None,
})
export class OverlayConnectedShellComponent {
  readonly handle = inject<OverlayHandle>(OVERLAY_HANDLE);
  readonly injector = inject(Injector);

  readonly referenceElement = computed(() => this.handle.referenceElement ?? undefined);
  readonly placement = computed(() =>
    this.handle.strategy.kind === 'connected' ? this.handle.strategy.options.placement ?? 'bottom' : 'bottom',
  );
  readonly matchWidth = computed(() =>
    this.handle.strategy.kind === 'connected' ? this.handle.strategy.options.matchWidth ?? false : false,
  );
  readonly offset = computed(() =>
    this.handle.strategy.kind === 'connected' ? this.handle.strategy.options.offset ?? 5 : 5,
  );
}
