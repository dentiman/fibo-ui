import { Component, ViewEncapsulation, input } from '@angular/core';
import { type OverlayHandle, OverlayContainer, OverlayShellHost } from '@fibo-ui/cdk';
import { OverlayContent } from './overlay-content.component';

@Component({
  selector: 'fibo-overlay-plain-shell',
  imports: [OverlayContent],
  hostDirectives: [
    {
      directive: OverlayShellHost,
      inputs: ['handle'],
    },
    OverlayContainer,
  ],
  template: `<fibo-overlay-content [handle]="handle()" />`,
  host: {
    'style': 'display: contents;',
  },
  encapsulation: ViewEncapsulation.None,
})
export class OverlayPlainShellComponent {
  readonly handle = input.required<OverlayHandle>();
}
