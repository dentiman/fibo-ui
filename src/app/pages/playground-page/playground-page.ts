import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-15">
      <ol class="grid grid-cols-34 grid-rows-21  list-none m-0 p-0">
        <li class="aspect-square overflow-hidden relative border-r-2  border-r-transparent" style="grid-area: 1 / 1 / 22 / 22;">
          <div class="absolute inset-0  rounded-full border-3  border-gray-400 bg-gray-300   scale-[2]  translate-x-1/2 translate-y-1/2 overflow-hidden">

          </div>
        </li>
        <li class="aspect-square overflow-hidden relative border-b-1 border-b-transparent" style="grid-area: 1 / 22 / 23 / 35;">
          <div class="absolute inset-0 rounded-full  border-3  border-gray-300 bg-gray-400 scale-[2] -translate-x-1/2 translate-y-1/2">

          </div>
        </li>
        <li class="aspect-square overflow-hidden relative border-l-1 border-l-transparent" style="grid-area: 14 / 27 / 22 / 35;">
          <div class="absolute inset-0 rounded-full border-3  border-gray-400 bg-gray-300 scale-[2] -translate-x-1/2 -translate-y-1/2"></div>
        </li>
        <li class="aspect-square overflow-hidden relative border-t-1 border-t-transparent" style="grid-area: 17 / 22 / 22 / 27;">
          <div class="absolute inset-0 rounded-full border-3  border-gray-300 bg-gray-400 scale-[2] translate-x-1/2 -translate-y-1/2"></div>
        </li>
        <li class="aspect-square overflow-hidden relative " style="grid-area: 14 / 22 / 17 / 25;">
          <div class="absolute inset-0 rounded-full border-3 border-gray-400 bg-gray-300 scale-[2] translate-x-1/2 translate-y-1/2"></div>
        </li>
        <li class="aspect-square overflow-hidden relative " style="grid-area: 14 / 25 / 17 / 27;">
          <div class="absolute inset-0 rounded-full border-3 border-gray-400 bg-gray-300 scale-[2] -translate-x-1/2 translate-y-1/2"></div>
        </li>
        <li class="aspect-square overflow-hidden relative " style="grid-area: 16 / 26 / 17 / 27;">
          <div class="absolute inset-0 rounded-full border-3 border-gray-400 bg-gray-300 scale-[2] -translate-x-1/2 -translate-y-1/2"></div>
        </li>
        <li class="aspect-square overflow-hidden relative " style="grid-area: 16 / 25 / 17 / 26;">
          <div class="absolute inset-0 rounded-full border-3 border-gray-400 bg-gray-300 scale-[2] translate-x-1/2 -translate-y-1/2"></div>
        </li>
      </ol>
    </div>


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
