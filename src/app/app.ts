import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Notification, FiboConfirmation, FiboDialog, FiboDrawer, TooltipContainer} from '@fibo-ui/components';
import {PortalOutletComponent} from '@fibo-ui/cdk';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TooltipContainer, FiboDialog, FiboDrawer, FiboConfirmation, Notification, PortalOutletComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
