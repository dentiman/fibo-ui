import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PermanentOverlayContainer } from '@fibo-ui/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PermanentOverlayContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
