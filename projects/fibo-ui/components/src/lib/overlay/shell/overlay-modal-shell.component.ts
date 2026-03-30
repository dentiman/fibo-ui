import { NgTemplateOutlet } from '@angular/common';
import { Component, Injector, TemplateRef, ViewEncapsulation, inject, input } from '@angular/core';
import { type OverlayHandle, OverlayContainer, OverlayPanel, OverlayShellHost } from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-overlay-modal-shell',
  imports: [NgTemplateOutlet],
  hostDirectives: [
    { directive: OverlayShellHost, inputs: ['handle'] },
    OverlayContainer,
    OverlayPanel,
  ],
  template: `
    @let content = handle().content;
    @if (content) {
      @if (isString(content)) {
        {{ content }}
      } @else {
        <ng-container *ngTemplateOutlet="$any(content); injector: injector"></ng-container>
      }
    }
  `,
  host: {
    'class':
      'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto w-[calc(100%-2rem)] overflow-hidden rounded-lg bg-background px-4 pt-5 pb-4 text-left shadow-xl sm:max-w-lg sm:p-6 dark:outline dark:-outline-offset-1 dark:outline-white/8',
    'animate.enter': 'overlay-modal-enter',
    'animate.leave': 'overlay-modal-leave',
  },
  styles: `
    .overlay-modal-enter {
      animation: overlay-modal-enter 160ms ease-out;
    }

    .overlay-modal-leave {
      animation: overlay-modal-leave 160ms ease-in forwards;
    }

    @keyframes overlay-modal-enter {
      from { opacity: 0; scale: 0.95; }
      to { opacity: 1; scale: 1; }
    }

    @keyframes overlay-modal-leave {
      from { opacity: 1; scale: 1; }
      to { opacity: 0; scale: 0.95; }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class OverlayModalShellComponent {
  readonly handle = input.required<OverlayHandle>();
  readonly injector = inject(Injector);

  protected isString(content: TemplateRef<any> | string): content is string {
    return typeof content === 'string';
  }
}
