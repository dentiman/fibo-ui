import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-100">
      <ol >
        <li class="bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700" ></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ol>
    </div>

    <div is="circle" class="size-18 rounded-full bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90%"></div>


  `,
  styles: [`
    ol {
      all: unset;
      display: grid;
      grid-template-columns: repeat(34, 1fr);
      grid-template-rows: repeat(21, 1fr);
      list-style: none;
      background: transparent;

      li {
        aspect-ratio: 1 / 1;
        background: var(--bg);
        grid-area: var(--ga);
        overflow: hidden;
        position: relative;

        &::after {
          aspect-ratio: 1 / 1;

          border-radius: 50%;
          content: '';
          display: block;
          inset: 0;
          position: absolute;
          scale: 2;
          translate: var(--tl);
        }

        &:nth-of-type(1) {
          --ga: 1 / 1 / 22 / 22;
          --tl: 50% 50%;

          &::after {
            background-image: linear-gradient(to right top, #f70606, #fa4c00, #fc6f00, #fc8d00, #fba700);
          }
        }
        &:nth-of-type(2) {
          --ga: 1 / 22 / 23 / 35;
          --tl: -50% 50%;

          &::after {
            background-image: linear-gradient(to right bottom, #fc6f00, #ff9300, #ffb600, #ffd900, #f7fb00);
          }

        }
        &:nth-of-type(3) {
          --ga: 14 / 27 / 22 / 35;
          --tl: -50% -50%;

          &::after {
            background-image: linear-gradient(to bottom, #ff9300, #e0a600, #b7b600, #82c400, #11cf03);
          }

        }
        &:nth-of-type(4) {
          --ga: 17 / 22 / 22 / 27;
          --tl: 50% -50%;

          &::after {
            background-image: linear-gradient(to left, #11cf03, #00d560, #00d892, #00dab8, #01d9d2);
          }


        }
        &:nth-of-type(5) {
          --ga: 14 / 22 / 17 / 25;
          --tl: 50% 50%;

          &::after {
            background-image: linear-gradient(to right top, #f70606, #fa4c00, #fc6f00, #fc8d00, #fba700);
          }
        }
        &:nth-of-type(6) {
          --ga: 14 / 25 / 17 / 27;
          --tl: -50% 50%;

          &::after {
            background-image: linear-gradient(to right top, #f70606, #fa4c00, #fc6f00, #fc8d00, #fba700);
          }
        }
        &:nth-of-type(7) {
          --ga: 16 / 26 / 17 / 27;
          --tl: -50% -50%;

          &::after {
            background-image: linear-gradient(to right top, #f70606, #fa4c00, #fc6f00, #fc8d00, #fba700);
          }
        }
        &:nth-of-type(8) {
          --ga: 16 / 25 / 17 / 26;
          --tl: 50% -50%;

          &::after {
            background-image: linear-gradient(to right top, #f70606, #fa4c00, #fc6f00, #fc8d00, #fba700);
          }
        }
      }
    }`]
})
export class PlaygroundPageComponent {
}
