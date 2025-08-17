import {Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'sui-loading-spin',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'min-w-4 min-h-4',
  },
  styles: `

    .spinner {
      animation: rotate 2s linear infinite;

      & .path {
        stroke-linecap: round;
        animation: dash 1.5s ease-in-out infinite;
      }

    }

    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
      }
    }

  `,
  template: `
    <svg class="spinner"  viewBox="0 0 50 50">
      <circle class="path" cx="25" cy="25" r="20" stroke="currentColor"  fill="none"  [attr.stroke-width]="strokeWidth()"></circle>
    </svg>
  `
})
export class LoadingSpin  {
  strokeWidth = input(4)
}
