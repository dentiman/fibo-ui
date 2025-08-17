import {Directive, inject, OnDestroy, OnInit} from '@angular/core';
import {DataListItem, OverlayTrigger} from '@fibo-ui/components';
import {MenuPanel} from './menu-panel';

// @ts-ignore
@Directive({
  selector: '[suiSubmenuTrigger]',
  hostDirectives: [
    {
      directive: DataListItem,
      inputs: ['disabled']
    },
    OverlayTrigger,
  ],
  host: {
    '(keydown.enter)': 'overlayTrigger.open()',
    '(keydown.escape)': 'overlayTrigger.close()',

    '(keydown.arrowright)': 'overlayTrigger.popover()?.dataList?.navigateNext($event)',
    '(click)': 'overlayTrigger.open()'
  }
})
export class PopoverSubmenuTrigger implements OnInit, OnDestroy {

  overlayTrigger = inject(OverlayTrigger);
  dataListItem = inject(DataListItem);
  menuPanel = inject(MenuPanel);

  ngOnDestroy(): void {
    const currentItems = this.menuPanel.popoverSubmenuItems();
    this.menuPanel.popoverSubmenuItems.set(currentItems.filter(item => item !== this));
  }

  ngOnInit(): void {
    const currentItems = this.menuPanel.popoverSubmenuItems();
    if (!currentItems.includes(this)) {
      this.menuPanel.popoverSubmenuItems.set([...currentItems, this]);
    }
  }

}
