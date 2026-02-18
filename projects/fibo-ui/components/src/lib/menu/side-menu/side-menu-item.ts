import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SideMenuGroup } from './side-menu-group';
import { DataListItem } from '@fibo-ui/cdk';

@Component({
  selector: 'side-menu-item',
  imports: [RouterLink, LucideAngularModule, DataListItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <a
      fiboDataListItem
      [value]="url()"
      [routerLink]="url()"
      #opt="DataListItem"
      [attr.aria-selected]="opt.isSelected() || null"
      [class.relative]="isNested()"
      class="group flex items-center gap-x-3 rounded-md py-1 px-2 text-sm cursor-pointer
        text-foreground-secondary hover:bg-black/3 dark:hover:bg-white/4 hover:text-foreground
        aria-selected:bg-black/6 dark:aria-selected:bg-white/8 aria-selected:text-foreground"
    >
      @if (isNested()) {
        <div class="absolute top-0 left-2 flex w-4 justify-center h-full">
          <div
            class="w-px bg-gray-300 dark:bg-neutral-700/60 "
            [class.bg-blue-500]="opt.isSelected()"
          ></div>
        </div>
        <div class="relative flex size-4 flex-none items-center justify-center">
          <div
            class="size-1.5  rounded-full ring ring-neutral-700/60
              bg-gray-100 dark:bg-background
              group-aria-selected:ring-blue-500 group-aria-selected:bg-blue-300
              dark:group-aria-selected:bg-blue-500"
          ></div>
        </div>
      }
      @if (icon()) {
        <lucide-icon [name]="icon()" class="size-4 shrink-0  text-foreground-tertiary
         group-aria-selected:text-foreground" />
      }
      <span class="flex-auto">
        <ng-content />
      </span>
    </a>
  `,
})
export class SideMenuItem {
  icon = input('');
  url = input('');

  private parentGroup = inject(SideMenuGroup, { optional: true });

  private level = computed(() => (this.parentGroup ? this.parentGroup.level() : 0));
  isNested = computed(() => this.level() > 0);
}
