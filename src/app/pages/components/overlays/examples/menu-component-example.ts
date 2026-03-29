import { ChangeDetectionStrategy, Component, computed, ElementRef, signal, TemplateRef, viewChild } from '@angular/core';
import { createOverlay } from '@fibo-ui/cdk';
import { menuConfig } from '@fibo-ui/components';
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

  readonly strategy = computed(() => {
    const templateRef = this.menuTemplate();
    const trigger = this.triggerBtn().nativeElement;
    if (!templateRef || !trigger) return null;
    return menuConfig({
      templateRef,
      referenceElement: trigger,
      focusReturnTarget: trigger,
    });
  });

  readonly overlayHandle = createOverlay(this.isOpen, this.strategy);

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
