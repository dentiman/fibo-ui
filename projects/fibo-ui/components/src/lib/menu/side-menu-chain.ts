import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fibo-side-menu-chain',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class.-bottom-0]="index() === totalItems() - 1 && !isGroup()"
         [class.-bottom-6]="index() !== totalItems() - 1"
         class="absolute top-0  left-0 flex w-6 justify-center"
    >
      <div class="w-px bg-gray-200"></div>
    </div>
    <div class="relative flex size-6 flex-none items-center justify-center ">

      @let showCollapseButton = collapsable() && isGroup();
      @if (showCollapseButton) {
        <div class="absolute z-3 top-50% left-50% text-xs -mt-[2px] text-gray-400 "
             [class.cursor-pointer]="collapsable()">

          @if (collapsed()) {
            <span>-</span>
          } @else {
            <span>+</span>
          }
        </div>
      }

      <!--  hide chain line on top or bottom depend in item index    -->
      @if (index() === 0) {
        <div class="absolute top-0 left-0 w-full h-1/2 bg-white"></div>
      }
      @if (index() === totalItems() - 1) {
        <div class="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>
      }

      <div [class]="{
           'cursor-pointer': collapsable(),
           'size-1.5':!showCollapseButton,
           'size-2':showCollapseButton,
           'ring-gray-400': isActive()
           }"
           class="z-1  rounded-full bg-gray-100 ring ring-gray-300
            group-aria-selected:ring-primary-500
            group-aria-selected:bg-primary-300"
      >
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuChain {
  index = input<number>(0);
  isGroup = input<boolean>(false);

  /**   handle datalist item active state*/
  isActive = input<boolean>(false);
  collapsable = input<boolean>(false);
  collapsed = input<boolean>(false);
  totalItems = input<number>(0);
}
