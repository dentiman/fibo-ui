import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'fibo-side-menu-chain',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="absolute top-0 left-0 flex w-6 justify-center h-full"
         style="transform: translateX(var(--fibo-chain-offset, 0px));">
      <div class="w-px bg-gray-300 dark:bg-neutral-700/50 "></div>
    </div>
    <div class="relative flex size-6 flex-none items-center justify-center"
         style="transform: translateX(var(--fibo-chain-offset, 0px));">
      @let showCollapseButton = collapsable() && isGroup();
      @if (showCollapseButton) {
        <div class="absolute top-50% left-50% text-xs text-neutral-500 "
             [class.cursor-pointer]="collapsable()">
          @if (collapsed()) {
            <lucide-icon name="chevron-down" size="14" ></lucide-icon>
          } @else {
            <lucide-icon name="chevron-right"  size="14" ></lucide-icon>
          }
        </div>
      }

      <div [class]="{
           'cursor-pointer': collapsable(),
           'size-1.5':!showCollapseButton,
           'size-3':showCollapseButton,
           }"

           class="rounded-full  dark:bg-background  bg-gray-100
              group-aria-selected:ring-blue-500
              group-aria-selected:bg-blue-300
              dark:group-aria-selected:bg-blue-500
            "
           [class.ring]="!showCollapseButton"
           [class.ring-border-primary]="!showCollapseButton"
      >
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuChain {

  index = input<number>(0);
  isGroup = input<boolean>(false);

  isActive = input<boolean>(false);

  collapsable = input<boolean>(false);
  collapsed = input<boolean>(false);
  totalItems = input<number>(0);
}
