import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PopoverTrigger } from '@fibo-ui/cdk';
import { Menu, MenuItem, Button } from '@fibo-ui/components';

@Component({
  selector: 'menu-component-example',
  imports: [Menu, MenuItem, PopoverTrigger, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-80 p-8">
      <button
        type="button"
        fiboButton fiboAppearance="primary"
        fiboPopoverTrigger
        [content]="menuTpl"
      >
        Menu
      </button>
    </div>

    <ng-template #menuTpl let-overlay>
      <fibo-menu [overlay]="overlay">
        <button type="button" fiboMenuItem>My Profile</button>
        <button type="button" fiboMenuItem>Settings</button>
        <button type="button" fiboMenuItem>Log Out</button>
      </fibo-menu>
    </ng-template>
  `,
})
export class MenuComponentExample {}
