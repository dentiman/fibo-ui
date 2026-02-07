import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SideMenuGroup } from './side-menu-group';

@Component({
  selector: 'side-menu-item',
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <a
      [routerLink]="url()"
      [attr.aria-selected]="active() || null"
      [class.relative]="isNested()"
      class="group flex items-center gap-x-3 rounded-md py-1 px-2 text-sm cursor-pointer
        text-foreground-secondary hover:bg-black/3 dark:hover:bg-white/4 hover:text-foreground
        aria-selected:bg-black/6 dark:aria-selected:bg-white/8 aria-selected:text-foreground"
    >
      @if (isNested()) {
        <div class="absolute top-0 left-2 flex w-4 justify-center h-full">
          <div
            class="w-px bg-gray-300 dark:bg-neutral-700/60 "
            [class.bg-blue-500]="active()"
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
export class SideMenuItem implements OnInit {
  icon = input('');
  url = input('');

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private parentGroup = inject(SideMenuGroup, { optional: true });

  active = signal(false);

  private level = computed(() => (this.parentGroup ? this.parentGroup.level() : 0));
  isNested = computed(() => this.level() > 0);

  ngOnInit() {
    this.updateActive();
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActive();
      }
    });
  }

  private updateActive() {
    const url = this.url();
    if (!url) {
      this.active.set(false);
      return;
    }
    this.active.set(
      this.router.isActive(url, {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      })
    );
  }
}
