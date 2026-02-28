import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Notification, FiboConfirmation, TooltipContainer} from '@fibo-ui/components';
import {OverlayOutletComponent} from '@fibo-ui/cdk';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TooltipContainer, FiboConfirmation, Notification, OverlayOutletComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
