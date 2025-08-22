import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-100">
      <ol >
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ol>
    </div>

  `,
  styles: [`
    ol {
      all: unset;
      display: grid;
      grid-template-columns: repeat(34, 1fr);
      grid-template-rows: repeat(21, 1fr);
      list-style: none;

      li {
        aspect-ratio: 1 / 1;
        background: var(--bg);
        grid-area: var(--ga);
        overflow: hidden;
        position: relative;

        &::after {
          aspect-ratio: 1 / 1;
          background-color: rgba(255, 255, 255, .3);
          border-radius: 50%;
          content: '';
          display: block;
          inset: 0;
          position: absolute;
          scale: 2;
          translate: var(--tl);
        }

        &:nth-of-type(1) {
          --bg: #e47a2c;
          --ga: 1 / 1 / 22 / 22;
          --tl: 50% 50%;
        }
        &:nth-of-type(2) {
          --bg: #baccc0 ;
          --ga: 1 / 22 / 23 / 35;
          --tl: -50% 50%;
        }
        &:nth-of-type(3) {
          --bg: #6c958f;
          --ga: 14 / 27 / 22 / 35;
          --tl: -50% -50%;
        }
        &:nth-of-type(4) {
          --bg: #40363f;
          --ga: 17 / 22 / 22 / 27;
          --tl: 50% -50%;
        }
        &:nth-of-type(5) {
          --bg: #d7a26c;
          --ga: 14 / 22 / 17 / 25;
          --tl: 50% 50%;
        }
        &:nth-of-type(6) {
          --bg: #ae4935;
          --ga: 14 / 25 / 17 / 27;
          --tl: -50% 50%;
        }
        &:nth-of-type(7) {
          --bg: #e47a2c;
          --ga: 16 / 26 / 17 / 27;
          --tl: -50% -50%;
        }
        &:nth-of-type(8) {
          --bg: #f7e6d4;
          --ga: 16 / 25 / 17 / 26;
          --tl: 50% -50%;
        }
      }
    }`]
})
export class PlaygroundPageComponent {
}
