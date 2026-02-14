import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { SideMenuItem } from './side-menu-item';
import { DataList, Expandable, ExpandOnSelection } from '@fibo-ui/cdk';

@Component({
  selector: 'side-menu-group',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [DataList, Expandable, ExpandOnSelection],
  host: {
    class: 'block',
  },
  template: `
    @if (level() === 0) {
      <button
        (click)="toggle()"
        class="flex w-full items-center gap-x-2 px-2 py-1.5 mt-4  cursor-pointer "
      >
        <span class="text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">
          {{ label() }}
        </span>
        <lucide-icon
          name="chevron-down"
          size="14"
          class="shrink-0 text-foreground-tertiary transition-transform duration-200"
          [class.rotate-180]="!expanded()"
        />
      </button>
    } @else {
      <button
        (click)="toggle()"
        class="flex w-full items-center gap-x-3 rounded-md py-1 px-2 text-left text-sm

         text-foreground-secondary hover:bg-black/3 dark:hover:bg-white/4 cursor-pointer"
      >
        @if (icon()) {
          <lucide-icon
            [name]="icon()"
            class="size-4 shrink-0 text-foreground-tertiary"
          />
        }
        <span>{{ label() }}</span>
        <lucide-icon
          name="chevron-right"
          size="16"
          class="ml-auto size-4 shrink-0 text-foreground-tertiary transition-transform duration-200"
          [class.rotate-90]="expanded()"
        />
      </button>
    }
    @if (expanded()) {
      <div class="">
        <ng-content />
      </div>
    }
  `,
})
export class SideMenuGroup {
  label = input('');
  icon = input('');

  private expandable = inject(Expandable);
  private parentGroup = inject(SideMenuGroup, { optional: true, skipSelf: true });

  // Expose for template compatibility
  expanded = this.expandable.expanded;
  toggle = this.expandable.toggle;

  // Keep level logic — component-specific
  level = computed((): number => (this.parentGroup ? this.parentGroup.level() + 1 : 0));

  constructor() {
    // Override default expanded value to true
    this.expanded.set(true);
  }
}
