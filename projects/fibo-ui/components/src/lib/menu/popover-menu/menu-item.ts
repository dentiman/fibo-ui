import {Directive, inject, input} from '@angular/core';
import {Menu} from './menu';
import {Option} from '@fibo-ui/cdk';


@Directive({
  selector: '[fiboMenuItem]',
  standalone: true,
  hostDirectives: [{
    directive: Option,
    inputs: ['disabled'],
    outputs: ['itemTrigger']
  }],
  host: {
    'class': 'menu-item',
    '(itemTrigger)': 'menu.menuPanel.closeMenuWithParent()'
  }
})
export class MenuItem {
  menu = inject(Menu)
}
