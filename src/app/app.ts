import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Notification, FiboConfirmation, FiboDialog, TooltipContainer} from '@fibo-ui/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TooltipContainer, FiboDialog, FiboConfirmation, Notification],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
