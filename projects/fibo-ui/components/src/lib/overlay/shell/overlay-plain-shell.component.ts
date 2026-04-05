import { Component, ViewEncapsulation, input } from '@angular/core';
import { type OverlayHandle, type OverlayShell, OverlayContainer, OverlayContent } from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-overlay-plain-shell',
  imports: [OverlayContent],
  hostDirectives: [
    { directive: OverlayContainer, inputs: ['overlay'] },
  ],
  template: `<fibo-overlay-content [overlay]="overlay()" />`,
  host: {
    'style': 'display: contents;',
  },
  encapsulation: ViewEncapsulation.None,
})
export class OverlayPlainShellComponent implements OverlayShell {
  readonly overlay = input.required<OverlayHandle>();
}
