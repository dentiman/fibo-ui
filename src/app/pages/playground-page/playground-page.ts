import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [CommonModule],
  template: `




  `,
  styles: [`
    .grid-cols-34 {
      grid-template-columns: repeat(34, 1fr);
    }

    .grid-rows-21 {
      grid-template-rows: repeat(21, 1fr);
    }

    .w-18 {
      width: 4.5rem;
    }

    .h-18 {
      height: 4.5rem;
    }


  `]
})
export class PlaygroundPageComponent {
}
