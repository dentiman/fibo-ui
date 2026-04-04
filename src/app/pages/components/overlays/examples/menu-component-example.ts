import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PopoverTrigger } from '@fibo-ui/cdk';
import { Menu, MenuItem } from '@fibo-ui/components';

@Component({
  selector: 'menu-component-example',
  imports: [Menu, MenuItem, PopoverTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-80 p-8">
      <button
        type="button"
        class="btn btn-primary"
        fiboPopoverTrigger
        [content]="menuTpl"
      >
        Menu
      </button>
    </div>

    <ng-template #menuTpl>
      <fibo-menu>
        <button type="button" fiboMenuItem>My Profile</button>
        <button type="button" fiboMenuItem>Settings</button>
        <button type="button" fiboMenuItem>Log Out</button>
      </fibo-menu>
    </ng-template>
  `,
})
export class MenuComponentExample {}
