import { ChangeDetectionStrategy, Component, ElementRef, signal, TemplateRef, viewChild } from '@angular/core';
import { createConnectedOverlay, connectedPosition, DialogTrigger } from '@fibo-ui/cdk';
import { Menu, type MenuItemType } from '@fibo-ui/components';

@Component({
  selector: 'app-playground-page',
  imports: [Menu, DialogTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 p-8">
      <section class="space-y-3">
        <h1 class="text-2xl font-semibold">Playground</h1>
        <p class="text-sm text-foreground-secondary">
          Debug page for overlay behavior. Scroll lock, outside click, keyboard navigation.
        </p>
      </section>

      <!-- Menu section -->
      <section class="space-y-4 rounded-xl border border-border-primary bg-background-secondary p-5 shadow-sm">
        <h2 class="text-lg font-medium text-foreground">Menu</h2>

        <div class="flex flex-wrap gap-3">
          <button
            #menuTriggerBtn
            type="button"
            class="btn btn-primary"
            (click)="toggleMenu()"
          >
            Open Menu
          </button>

          <button
            #altMenuTriggerBtn
            type="button"
            class="btn btn-secondary"
            (click)="toggleAltMenu()"
          >
            Open Quick Menu
          </button>
        </div>

        <ng-template #menuTpl let-overlay>
          <fibo-menu [overlay]="overlay" [items]="menuItems" (itemTriggered)="closeMenu()" />
        </ng-template>

        <ng-template #altMenuTpl let-overlay>
          <fibo-menu [overlay]="overlay" [items]="quickMenuItems" (itemTriggered)="closeAltMenu()" />
        </ng-template>
      </section>

      <!-- Spacer before dialog -->
      @for (i of spacerItemsTop; track i) {
        <section class="rounded-xl border border-border-primary bg-background-secondary p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-foreground">Section {{ i }}</h3>
              <p class="text-sm text-foreground-secondary">Scroll down to find the dialog triggers</p>
            </div>
            <div class="h-8 w-8 rounded-full bg-border-primary"></div>
          </div>
        </section>
      }

      <!-- Dialog section — in the middle -->
      <section class="space-y-4 rounded-xl border-2 border-blue-500 bg-background-secondary p-5 shadow-sm">
        <h2 class="text-lg font-medium text-foreground">Dialog (scroll lock test)</h2>
        <p class="text-sm text-foreground-secondary">
          Scroll here from top, open a dialog, verify scroll is locked. Close — scroll position restored.
        </p>

        <div class="flex flex-wrap gap-3">
          <button
            #dialogTrigger="DialogTrigger"
            class="btn btn-primary"
            fiboDialogTrigger
            [content]="dialogTpl"
          >
            Open Dialog
          </button>

          <button
            #nestedDialogTrigger="DialogTrigger"
            class="btn btn-secondary"
            fiboDialogTrigger
            [content]="nestedDialogTpl"
          >
            Nested Dialogs
          </button>
        </div>

        <ng-template #dialogTpl>
          <div class="p-6 w-96">
            <h2 class="text-lg font-semibold mb-2">Basic Dialog</h2>
            <p class="text-sm text-foreground-secondary mb-4">
              Body scroll should be locked while this dialog is open.
            </p>
            <div class="flex justify-end">
              <button class="btn" (click)="dialogTrigger.close()">Close</button>
            </div>
          </div>
        </ng-template>

        <ng-template #nestedDialogTpl>
          <div class="p-6 w-96">
            <h2 class="text-lg font-semibold mb-2">First Dialog</h2>
            <p class="text-sm text-foreground-secondary mb-4">
              Open a second dialog. Scroll lock uses ref counting — stays locked until all dialogs close.
            </p>

            <button
              #innerDialogTrigger="DialogTrigger"
              class="btn btn-secondary mb-4"
              fiboDialogTrigger
              [content]="innerDialogTpl"
            >
              Open Second Dialog
            </button>
            <ng-template #innerDialogTpl>
              <div class="p-6 w-80">
                <h2 class="text-lg font-semibold mb-2">Second Dialog</h2>
                <p class="text-sm text-foreground-secondary mb-4">Stacked on top. Scroll still locked.</p>
                <div class="flex justify-end">
                  <button class="btn" (click)="innerDialogTrigger.close()">Close</button>
                </div>
              </div>
            </ng-template>

            <div class="flex justify-end">
              <button class="btn" (click)="nestedDialogTrigger.close()">Close</button>
            </div>
          </div>
        </ng-template>
      </section>

      <!-- Spacer after dialog -->
      @for (i of spacerItemsBottom; track i) {
        <section class="rounded-xl border border-border-primary bg-background-secondary p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-foreground">Section {{ i }}</h3>
              <p class="text-sm text-foreground-secondary">More content below the dialog section</p>
            </div>
            <div class="h-8 w-8 rounded-full bg-border-primary"></div>
          </div>
        </section>
      }
    </div>
  `,
})
export class PlaygroundPageComponent {
  readonly spacerItemsTop = Array.from({ length: 8 }, (_, i) => i + 1);
  readonly spacerItemsBottom = Array.from({ length: 12 }, (_, i) => i + 1);

  // Menu state
  readonly menuTemplate = viewChild.required<TemplateRef<unknown>>('menuTpl');
  readonly altMenuTemplate = viewChild.required<TemplateRef<unknown>>('altMenuTpl');
  readonly menuTrigger = viewChild.required<ElementRef<HTMLButtonElement>>('menuTriggerBtn');
  readonly altMenuTrigger = viewChild.required<ElementRef<HTMLButtonElement>>('altMenuTriggerBtn');

  readonly isMenuOpen = signal(false);
  readonly isAltMenuOpen = signal(false);

  readonly menuOverlay = createConnectedOverlay(
    this.isMenuOpen,
    connectedPosition(() => ({ referenceElement: this.menuTrigger().nativeElement })),
    this.menuTemplate,
    { restoreFocusTo: () => this.menuTrigger().nativeElement },
  );

  readonly altMenuOverlay = createConnectedOverlay(
    this.isAltMenuOpen,
    connectedPosition(() => ({ referenceElement: this.altMenuTrigger().nativeElement })),
    this.altMenuTemplate,
    { restoreFocusTo: () => this.altMenuTrigger().nativeElement },
  );

  readonly menuItems: MenuItemType[] = [
    { label: 'My Profile', icon: 'user', url: '/' },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { label: 'Profile Settings', icon: 'user', url: '/' },
        {
          label: 'Notifications',
          icon: 'bell',
          children: [
            { label: 'Email Notifications', url: '/notifications' },
            { label: 'Push Notifications', url: '/notifications' },
            { label: 'SMS Notifications', url: '/notifications' },
          ],
        },
        { label: 'Appearance', icon: 'sun', url: '/theme-demo' },
      ],
    },
    {
      label: 'Account & Security',
      icon: 'shield-check',
      children: [
        { label: 'Edit Profile', icon: 'user', url: '/' },
        { label: 'Change Password', icon: 'lock', url: '/input' },
        {
          label: 'Two-Factor Auth',
          icon: 'shield-check',
          children: [
            { label: 'Authenticator App', url: '/switch' },
            { label: 'SMS Verification', url: '/switch' },
            { label: 'Recovery Codes', url: '/switch' },
          ],
        },
        { label: 'Active Sessions', icon: 'monitor', url: '/notifications' },
      ],
    },
    { label: 'Log Out', icon: 'log-out', callback: () => console.log('logout') },
  ];

  readonly quickMenuItems: MenuItemType[] = [
    { label: 'Single Select', icon: 'list', url: '/select-multiple' },
    { label: 'Multiple Select', icon: 'list-checks', url: '/select-multiple' },
    { label: 'Datepicker', icon: 'calendar', url: '/datepicker' },
  ];

  toggleMenu() {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleAltMenu() {
    this.isAltMenuOpen.update(open => !open);
  }

  closeAltMenu() {
    this.isAltMenuOpen.set(false);
  }
}
