import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fibo-side-menu-chain',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div  class="absolute top-0  left-0 flex w-6 justify-center h-full">
      <div class="w-px bg-gray-300 dark:bg-neutral-700 "></div>
    </div>
    <div class="relative flex size-6 flex-none items-center justify-center">
      @let showCollapseButton = collapsable() && isGroup();
      @if (showCollapseButton) {
        <div class="absolute z-3 top-50% left-50% text-xs text-neutral-500 "
             [class.cursor-pointer]="collapsable()">
          @if (collapsed()) {
            <span>&ndash;</span>
          } @else {
            <span>+</span>
          }
        </div>
      }

      <div [class]="{
           'cursor-pointer': collapsable(),
           'size-1.5':!showCollapseButton,
           'size-2':showCollapseButton,
           }"
           class="z-1  rounded-full  bg-background-secondary
               ring ring-border-primary
            group-aria-selected:ring-blue-500
              group-aria-selected:bg-blue-300
               dark:group-aria-selected:bg-blue-500
            "
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
