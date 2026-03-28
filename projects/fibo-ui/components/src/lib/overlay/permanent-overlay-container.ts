import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {OverlayStackOutlet} from './shell/overlay-stack-outlet';
import {TooltipOverlayContainer} from './tooltip/tooltip-overlay-container';
import {ConfirmationOverlayContainer} from './confirmation/confirmation-overlay-container';
import {NotificationOverlayContainer} from './notification/notification-overlay-container';

@Component({
  selector: 'fibo-permanent-overlay-container',
  imports: [
    OverlayStackOutlet,
    TooltipOverlayContainer,
    ConfirmationOverlayContainer,
    NotificationOverlayContainer,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <fibo-tooltip-overlay-container />
    <fibo-confirmation-overlay-container />
    <fibo-notification-overlay-container />
    <fibo-overlay-stack-outlet />
  `,
})
export class PermanentOverlayContainer {}
