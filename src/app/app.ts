import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverlayOutlet } from '@fibo-ui/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, OverlayOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
