import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Notification, SuiConfirmation, SuiDialog, TooltipContainer} from '@fibo-ui/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TooltipContainer, SuiDialog, SuiConfirmation, Notification],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
