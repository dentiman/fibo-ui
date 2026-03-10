import {Directive, inject, input} from '@angular/core';
import {Menu} from './menu';
import {DataListItem} from '@fibo-ui/cdk';


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
    'role': 'menuitem',
    '(itemTrigger)': 'menu.menuPanel.closeAll()',
  }
})
export class MenuItem {
  menu = inject(Menu)
}
