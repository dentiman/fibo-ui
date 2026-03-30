import {
  EnvironmentProviders,
  InjectionToken,
  Type,
  makeEnvironmentProviders,
} from '@angular/core';
import { CONNECTED_SHELL_TOKEN, MODAL_SHELL_TOKEN, NOTIFICATION_SHELL_TOKEN, TOOLTIP_SHELL_TOKEN } from '@fibo-ui/cdk';
import { OverlayConnectedShellComponent } from './shell/overlay-connected-shell.component';
import { OverlayModalShellComponent } from './shell/overlay-modal-shell.component';
import { OverlayPlainShellComponent } from './shell/overlay-plain-shell.component';
import { TooltipShellComponent } from './tooltip/tooltip-shell.component';

export interface OverlayFeature {
  readonly ɵproviders: readonly { provide: InjectionToken<Type<any>>; useValue: Type<any> }[];
}

export function withShell(token: InjectionToken<Type<any>>, component: Type<any>): OverlayFeature {
  return { ɵproviders: [{ provide: token, useValue: component }] };
}

export function provideOverlays(...features: OverlayFeature[]): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: MODAL_SHELL_TOKEN, useValue: OverlayModalShellComponent },
    { provide: CONNECTED_SHELL_TOKEN, useValue: OverlayConnectedShellComponent },
    { provide: NOTIFICATION_SHELL_TOKEN, useValue: OverlayPlainShellComponent },
    { provide: TOOLTIP_SHELL_TOKEN, useValue: TooltipShellComponent },
    features.map(f => f.ɵproviders),
  ]);
}
