import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tooltip, Button } from '@fibo-ui/components';

@Component({
  standalone: true,
  imports: [CommonModule, Tooltip, Button],
  template: `
<div class="p-8">
  <h2 class="text-xl font-semibold mb-6 text-center">Tooltip Placement Demo</h2>

  <!-- Basic Placements -->
  <div class="mb-12">
    <h3 class="text-lg font-semibold mb-4 text-center">Basic Placements</h3>
    <div class="flex justify-center gap-8">
      <button fiboButton fiboAppearance="primary" [fiboTooltip]="'top'" [placement]="'top'">top</button>
      <button fiboButton fiboAppearance="primary" [fiboTooltip]="'left'" [placement]="'left'">left</button>
      <button fiboButton fiboAppearance="primary" [fiboTooltip]="'right'" [placement]="'right'">right</button>
      <button fiboButton fiboAppearance="primary" [fiboTooltip]="'bottom'" [placement]="'bottom'">bottom</button>
    </div>
  </div>

  <!-- Aligned Placements Grid -->
  <div class="mb-8">
    <h3 class="text-lg font-semibold mb-4 text-center">Aligned Placements</h3>
    <div class="grid grid-cols-2 grid-rows-4 gap-8 max-w-4xl mx-auto">
      <!-- Row 1 -->
      <div class="fibo-card w-full h-32 flex items-center justify-center cursor-pointer" [fiboTooltip]="'top-start'" [placement]="'top-start'">
        top-start
      </div>
      <div class="fibo-card w-full h-32 flex items-center justify-center cursor-pointer" [fiboTooltip]="'top-end top-end'" [placement]="'top-end'">
        top-end
      </div>

      <!-- Row 2 -->
      <div class="fibo-card w-full h-32 flex items-center justify-center cursor-pointer" [fiboTooltip]="'left-start'" [placement]="'left-start'">
        left-start
      </div>
      <div class="fibo-card w-full h-32 flex items-center justify-center cursor-pointer" [fiboTooltip]="'left-end'" [placement]="'left-end'">
        left-end
      </div>

      <!-- Row 3 -->
      <div class="fibo-card w-full h-32 flex items-center justify-center cursor-pointer" [fiboTooltip]="rightStart" [placement]="'right-start'">
        right-start
      </div>
      <div class="fibo-card w-full h-32 flex items-center justify-center cursor-pointer" [fiboTooltip]="'right-end'" [placement]="'right-end'">
        right-end
      </div>

      <!-- Row 4 -->
      <div class="fibo-card w-full h-32 flex items-center justify-center cursor-pointer" [fiboTooltip]="'bottom-start'" [placement]="'bottom-start'">
        bottom-start
      </div>
      <div class="fibo-card w-full h-32 flex items-center justify-center cursor-pointer" [fiboTooltip]="'bottom-end'" [placement]="'bottom-end'">
        bottom-end
      </div>
    </div>
  </div>
</div>

<ng-template #rightStart>
  <p>right-start</p>
  <p>right-start</p>
  <p>right-start</p>
  <p>right-start</p>
</ng-template>
  `,
})
export class TooltipPageComponent {}
