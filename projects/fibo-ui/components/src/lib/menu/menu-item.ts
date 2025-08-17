import {Directive, inject, input} from '@angular/core';
import {PopoverMenu} from './popover-menu';
import {DataListItem} from '../data-list/data-list-item';


@Directive({
  selector: '[fiboMenuItem]',
  standalone: true,
  hostDirectives: [{
    directive: DataListItem,
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
