import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {OverlayContainerComponent} from '@fibo-ui/cdk';
import {TooltipOverlayContainer} from './tooltip/tooltip-overlay-container';
import {ConfirmationOverlayContainer} from './confirmation/confirmation-overlay-container';
import {NotificationOverlayContainer} from './notification/notification-overlay-container';

@Component({
  selector: 'fibo-permanent-overlay-container',
  imports: [
    OverlayContainerComponent,
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
    <fibo-cdk-overlay-container />
  `,
})
export class PermanentOverlayContainer {}
