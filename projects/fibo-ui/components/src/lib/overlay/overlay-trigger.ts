import {Directive, ElementRef, inject, Input, input, model, signal} from '@angular/core';
import {DataListItem} from '../data-list/data-list-item';
import {Popover} from './components/popover';


@Directive({
  selector: '[suiOverlayTrigger]',
  exportAs: 'OverlayTrigger',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown)': 'onKeydown($event)',
  }
})
export class OverlayTrigger  {
  isListItem = !!inject(DataListItem,{optional:true,self:true} );
  element = inject(ElementRef<HTMLElement>).nativeElement;
  isOpen = signal(false);

  //set  when popover is open
  popover = signal<Popover|null>(null)

  toggle  () {
    if(this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open  () {
    if(!this.isOpen()) {
      this.isOpen.set(true);
    //  console.log('OverlayTrigger open');
    }

  }
  close () {
    if(this.isOpen()) {
      this.isOpen.set(false);
   //   console.log('OverlayTrigger close');
    }
  }

  onKeydown(event: KeyboardEvent): void  {
    if(!this.isListItem) {
      this.popover()?.dataList?.onKeydown(event)
    }
  }
}

@Directive({
  selector: '[suiOverlayTriggerClick]',
  standalone: true,
  hostDirectives: [OverlayTrigger],
  host: {
    '(keydown.enter)': 'overlayTrigger.open()',
    '(keydown.escape)': 'overlayTrigger.close()',
    '(click)': "overlayTrigger.open()"
  }
})
export class OverlayTriggerClick  {
  overlayTrigger = inject(OverlayTrigger);
}

@Directive({
  selector: '[suiOverlayTriggerToggle]',
  standalone: true,
  hostDirectives: [OverlayTrigger],
  host: {
    '(keydown.escape)': 'overlayTrigger.close()',
    '(click)': "overlayTrigger.toggle()"
  }
})
export class OverlayTriggerToggle  {
  overlayTrigger = inject(OverlayTrigger);
}




