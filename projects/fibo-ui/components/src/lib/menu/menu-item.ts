import {Directive, inject, input} from '@angular/core';
import {PopoverMenu} from './popover-menu';
import {ListItem} from '@fibo-ui/cdk';


@Directive({
  selector: '[fiboMenuItem]',
  standalone: true,
  hostDirectives: [{
    directive: ListItem,
    inputs: ['disabled'],
    outputs: ['itemTrigger']
  }],
  host: {
    'class': 'menu-item',
    '(itemTrigger)': 'menu.closeMenuWithParent()'
  }
})
export class MenuItem {
  menu = inject(PopoverMenu)
}
