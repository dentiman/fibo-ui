import { ChangeDetectionStrategy, Component, ElementRef, signal, TemplateRef, viewChild } from '@angular/core';
import { createOverlay, connectedPosition, restoreTriggerFocusOnClose } from '@fibo-ui/cdk';
import { menuBehavior } from '@fibo-ui/components';
import { Menu, type MenuItemType } from '@fibo-ui/components';

@Component({
  selector: 'menu-component-example',
  imports: [Menu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-80 p-8">
      <button
        #triggerBtn
        type="button"
        class="btn btn-primary"
        (click)="toggle()"
      >
        Menu
      </button>
    </div>

    <ng-template #menuTpl>
      <fibo-menu [items]="menuItems"></fibo-menu>
    </ng-template>
  `,
})
export class MenuComponentExample {
  private readonly menuTemplate = viewChild.required<TemplateRef<unknown>>('menuTpl');
  private readonly triggerBtn = viewChild.required<ElementRef<HTMLButtonElement>>('triggerBtn');

  readonly isOpen = signal(false);

  readonly overlayHandle = createOverlay(
    this.isOpen,
    menuBehavior(),
    connectedPosition(() => ({ referenceElement: this.triggerBtn().nativeElement })),
    this.menuTemplate,
    session => { restoreTriggerFocusOnClose(session, () => this.triggerBtn().nativeElement); },
  );

  readonly menuItems: MenuItemType[] = [
    { label: 'My Profile', icon: 'user', url: '/' },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { label: 'Profile Settings', icon: 'user', url: '/' },
        { label: 'Notifications', icon: 'bell', url: '/notifications' },
      ],
    },
    { label: 'Log Out', icon: 'log-out', url: '/menu' },
  ];

  toggle() {
    this.isOpen.update(open => !open);
  }
}
