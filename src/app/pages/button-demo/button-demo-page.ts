import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-demo-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-demo-page.html',
})
export class ButtonDemoPageComponent {
  
  onButtonClick(type: string) {
    console.log(`${type} button clicked`);
  }
}
