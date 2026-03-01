import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {OverlayOutletComponent} from '@fibo-ui/cdk';
import {TooltipContainer} from './tooltip/tooltip-container';
import {FiboConfirmation} from './confirmation/confirmation';
import {Notification} from './notification/notification';

@Component({
  selector: 'fibo-overlay-outlet',
  imports: [OverlayOutletComponent, TooltipContainer, FiboConfirmation, Notification],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <fibo-tooltip-container />
    <fibo-confirmation />
    <fibo-notification />
    <fibo-cdk-overlay-outlet />
  `,
})
export class OverlayOutlet {}
