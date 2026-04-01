import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverlayStackOutlet } from '@fibo-ui/cdk';
import { ConfirmationOverlayContainer, NotificationOverlayContainer } from '@fibo-ui/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmationOverlayContainer, NotificationOverlayContainer, OverlayStackOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
