import {
  Component,
  ElementRef,
  InjectionToken,
  TemplateRef,
  Type,
  ViewEncapsulation,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Placement } from '@floating-ui/dom';
import { OverlayContainer } from './overlay-container';
import type { ConnectedPosition } from './overlay-config';
import { OverlayContent } from './overlay-content';
import type { OverlayHandle, OverlayShell } from './overlay-handle';
import { OverlayPanel } from './overlay-panel';
import { OverlayPosition } from './overlay-position';
import type { TrapOverlayFocusOptions } from './overlay-behaviors';
import { createOverlay } from './public-overlay';
import { CONNECTED_SHELL_TOKEN, MODAL_SHELL_TOKEN, OVERLAY_BACKDROP_SHELL } from './overlay-shell-tokens';
import { OverlayStackOutlet } from './overlay-stack-outlet';

type TestOverlayFamily = 'global' | 'connected' | 'coordinate';

@Component({
  selector: 'fibo-test-modal-shell',
  standalone: true,
  imports: [OverlayContent, OverlayPanel],
  hostDirectives: [{ directive: OverlayContainer, inputs: ['overlay'] }],
  template: `
    <div fiboOverlayPanel>
      <fibo-overlay-content [overlay]="overlay()" />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
class TestModalShellComponent implements OverlayShell {
  readonly overlay = input.required<OverlayHandle>();
}

@Component({
  selector: 'fibo-test-connected-shell',
  standalone: true,
  imports: [OverlayContent],
  hostDirectives: [
    { directive: OverlayContainer, inputs: ['overlay'] },
    { directive: OverlayPosition, inputs: ['overlay'] },
  ],
  template: `
    <div class="connected-shell">
      <fibo-overlay-content [overlay]="overlay()" />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
class TestConnectedShellComponent implements OverlayShell {
  readonly overlay = input.required<OverlayHandle>();
}

@Component({
  selector: 'fibo-test-backdrop-shell',
  standalone: true,
  template: '',
  host: {
    '[attr.data-overlay-backdrop-id]': 'overlay().id',
  },
})
class TestBackdropShellComponent {
  readonly overlay = input.required<OverlayHandle>();
}

@Component({
  standalone: true,
  imports: [OverlayStackOutlet],
  template: `
    <button #trigger id="trigger" type="button">Trigger</button>
    <button #altTrigger id="alt-trigger" type="button">Alt trigger</button>
    <button #outside id="outside" type="button">Outside</button>

    <ng-template #tpl let-overlay>
      <button id="overlay-primary" fiboFocusInitial type="button" (click)="overlay.close()">
        Close
      </button>
      <button id="overlay-secondary" type="button">Secondary</button>
    </ng-template>

    <fibo-overlay-stack-outlet />
  `,
})
class OverlayRuntimeHostComponent {
  readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  readonly altTrigger = viewChild.required<ElementRef<HTMLButtonElement>>('altTrigger');
  readonly outside = viewChild.required<ElementRef<HTMLButtonElement>>('outside');
  readonly tpl = viewChild.required<TemplateRef<unknown>>('tpl');

  readonly state = signal(false);
  readonly family = signal<TestOverlayFamily>('global');
  readonly contentMode = signal<'template' | 'string' | 'null'>('template');
  readonly textContent = signal('overlay-a');
  readonly referenceElement = signal<HTMLElement | null>(null);
  readonly coordinates = signal({ x: 10, y: 20 });
  readonly placement = signal<Placement | undefined>(undefined);
  readonly matchWidth = signal<boolean | undefined>(undefined);
  readonly offset = signal<number | undefined>(undefined);

  readonly shell = signal<InjectionToken<Type<any>> | undefined>(undefined);
  readonly backdrop = signal<boolean | undefined>(undefined);
  readonly blockScroll = signal<boolean | undefined>(undefined);

  readonly trap = signal<boolean | TrapOverlayFocusOptions | undefined>(undefined);
  readonly restoreTarget = signal<HTMLElement | null>(null);

  readonly closeOutsideClick = signal<boolean | undefined>(undefined);
  readonly closeEscape = signal<boolean | undefined>(undefined);
  readonly closeFocusLeave = signal<boolean | undefined>(undefined);
  readonly closeScroll = signal<boolean | undefined>(undefined);

  readonly canCloseDecision = signal<boolean | undefined>(undefined);

  readonly setupSpy = jasmine.createSpy('setup');
  readonly afterOpenedSpy = jasmine.createSpy('afterOpened');
  readonly beforeCloseSpy = jasmine.createSpy('beforeClose');
  readonly afterCloseSpy = jasmine.createSpy('afterClose');
  readonly canCloseSpy = jasmine.createSpy('canClose');

  readonly overlay = createOverlay(() => ({
    state: this.state,
    content: this.resolveContent(),
    position: this.resolvePosition(),
    shell: this.shell(),
    backdrop: this.backdrop(),
    blockScroll: this.blockScroll(),
    focus: {
      trap: this.trap(),
      restoreTo: () => this.restoreTarget() ?? this.trigger().nativeElement,
    },
    close: {
      outsideClick: this.closeOutsideClick(),
      escape: this.closeEscape(),
      focusLeave: this.closeFocusLeave(),
      scroll: this.closeScroll(),
    },
    lifecycle: {
      afterOpened: [
        overlay =>
          this.afterOpenedSpy({
            overlay,
            hostElement: overlay.hostElement(),
            container: document.querySelector(`[data-overlay-container-id="${overlay.id}"]`),
          }),
      ],
      beforeClose: [
        (ctx, overlay, reason) =>
          this.beforeCloseSpy({
            ctx,
            overlay,
            reason,
            state: this.state(),
          }),
      ],
      afterClose: [
        (overlay, reason) =>
          this.afterCloseSpy({
            overlay,
            reason,
            container: document.querySelector(`[data-overlay-container-id="${overlay.id}"]`),
          }),
      ],
      canClose: [
        (reason, event) => {
          this.canCloseSpy({ reason, event });
          return this.canCloseDecision();
        },
      ],
    },
    setup: session => this.setupSpy(session),
  }));

  private resolveContent(): TemplateRef<unknown> | string | null {
    if (this.contentMode() === 'null') {
      return null;
    }

    if (this.contentMode() === 'string') {
      return this.textContent();
    }

    return this.tpl();
  }

  private resolvePosition() {
    if (this.family() === 'global') {
      return undefined;
    }

    if (this.family() === 'connected') {
      return {
        connectedTo: this.referenceElement() ?? this.trigger().nativeElement,
        placement: this.placement(),
        matchWidth: this.matchWidth(),
        offset: this.offset(),
      };
    }

    return {
      x: this.coordinates().x,
      y: this.coordinates().y,
      placement: this.placement(),
    };
  }
}

@Component({
  selector: 'fibo-test-required-input-consumer',
  standalone: true,
  template: '',
})
class RequiredInputOverlayConsumerComponent {
  readonly content = input.required<TemplateRef<unknown>>();
  readonly state = signal(false);

  readonly overlay = createOverlay(() => ({
    state: this.state,
    content: this.content(),
  }));
}

@Component({
  standalone: true,
  imports: [RequiredInputOverlayConsumerComponent, OverlayStackOutlet],
  template: `
    <ng-template #tpl>Required input content</ng-template>
    <fibo-test-required-input-consumer [content]="tpl" />
    <fibo-overlay-stack-outlet />
  `,
})
class RequiredInputOverlayHostComponent {
  readonly consumer = viewChild.required(RequiredInputOverlayConsumerComponent);
}

@Component({
  standalone: true,
  imports: [OverlayStackOutlet],
  template: `
    <ng-template #tpl>ViewChild required content</ng-template>
    <fibo-overlay-stack-outlet />
  `,
})
class ViewChildRequiredOverlayHostComponent {
  readonly tpl = viewChild.required<TemplateRef<unknown>>('tpl');
  readonly state = signal(false);

  readonly overlay = createOverlay(() => ({
    state: this.state,
    content: this.tpl(),
  }));
}

function createOverlayInContext(factory: Parameters<typeof createOverlay>[0]) {
  return TestBed.runInInjectionContext(() => createOverlay(factory));
}

async function stabilize(fixture?: ComponentFixture<unknown>): Promise<void> {
  TestBed.flushEffects();
  if (fixture) {
    await fixture.whenStable();
  }
  TestBed.flushEffects();
}

describe('createOverlay', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OverlayRuntimeHostComponent,
        RequiredInputOverlayHostComponent,
        ViewChildRequiredOverlayHostComponent,
      ],
      providers: [
        { provide: MODAL_SHELL_TOKEN, useValue: TestModalShellComponent },
        { provide: CONNECTED_SHELL_TOKEN, useValue: TestConnectedShellComponent },
        { provide: OVERLAY_BACKDROP_SHELL, useValue: TestBackdropShellComponent },
      ],
    }).compileComponents();
  });

  it('does not read the config factory eagerly', () => {
    const state = signal(false);
    let callCount = 0;

    const overlay = createOverlayInContext(() => {
      callCount += 1;
      return { state, content: 'test' };
    });

    expect(callCount).toBe(0);
    expect(overlay()).toBeNull();
  });

  it('supports input.required() values inside the overlay config', async () => {
    const fixture = TestBed.createComponent(RequiredInputOverlayHostComponent);
    await stabilize(fixture);

    const consumer = fixture.componentInstance.consumer();
    consumer.state.set(true);
    await stabilize(fixture);

    expect(consumer.overlay()).not.toBeNull();
  });

  it('supports viewChild.required() values inside the overlay config', async () => {
    const fixture = TestBed.createComponent(ViewChildRequiredOverlayHostComponent);
    await stabilize(fixture);

    fixture.componentInstance.state.set(true);
    await stabilize(fixture);

    expect(fixture.componentInstance.overlay()).not.toBeNull();
  });

  it('applies global-family defaults', async () => {
    const state = signal(false);
    const overlay = createOverlayInContext(() => ({ state, content: 'test' }));

    state.set(true);
    await stabilize();

    expect(overlay()).not.toBeNull();
    expect(overlay()!.behavior.shell).toBe(MODAL_SHELL_TOKEN);
    expect(overlay()!.behavior.needsBackdrop).toBe(true);
    expect(overlay()!.behavior.blockScroll).toBe(true);
    expect(overlay()!.behavior.closeOnOutsideClick).toBe(true);
    expect(overlay()!.behavior.closeOnEscape).toBe(true);
    expect(overlay()!.behavior.closeOnFocusLeave).toBe(false);
    expect(overlay()!.behavior.closeOnScroll).toBe(false);
  });

  it('applies connected-family defaults', async () => {
    const state = signal(false);
    const anchor = document.createElement('button');
    const overlay = createOverlayInContext(() => ({
      state,
      content: 'test',
      position: { connectedTo: anchor },
    }));

    state.set(true);
    await stabilize();

    expect(overlay()!.behavior.shell).toBe(CONNECTED_SHELL_TOKEN);
    expect(overlay()!.behavior.needsBackdrop).toBe(false);
    expect(overlay()!.behavior.blockScroll).toBe(false);
    expect(overlay()!.behavior.closeOnFocusLeave).toBe(true);
  });

  it('applies coordinate-family defaults', async () => {
    const state = signal(false);
    const overlay = createOverlayInContext(() => ({
      state,
      content: 'test',
      position: { x: 10, y: 20 },
    }));

    state.set(true);
    await stabilize();

    expect(overlay()!.behavior.shell).toBe(CONNECTED_SHELL_TOKEN);
    expect(overlay()!.behavior.needsBackdrop).toBe(false);
    expect(overlay()!.behavior.blockScroll).toBe(false);
    expect(overlay()!.behavior.closeOnFocusLeave).toBe(false);
  });

  it('respects explicit behavior overrides', async () => {
    const state = signal(false);
    const overlay = createOverlayInContext(() => ({
      state,
      content: 'test',
      position: { connectedTo: document.createElement('button') },
      shell: MODAL_SHELL_TOKEN,
      backdrop: true,
      blockScroll: true,
      close: {
        outsideClick: false,
        escape: false,
        focusLeave: false,
        scroll: true,
      },
    }));

    state.set(true);
    await stabilize();

    expect(overlay()!.behavior.shell).toBe(MODAL_SHELL_TOKEN);
    expect(overlay()!.behavior.needsBackdrop).toBe(true);
    expect(overlay()!.behavior.blockScroll).toBe(true);
    expect(overlay()!.behavior.closeOnOutsideClick).toBe(false);
    expect(overlay()!.behavior.closeOnEscape).toBe(false);
    expect(overlay()!.behavior.closeOnFocusLeave).toBe(false);
    expect(overlay()!.behavior.closeOnScroll).toBe(true);
  });

  it('updates string content reactively without reopening the overlay', async () => {
    const state = signal(false);
    const contentValue = signal('content-a');
    const overlay = createOverlayInContext(() => ({
      state,
      content: contentValue(),
    }));

    state.set(true);
    await stabilize();

    const initialHandle = overlay();
    expect(initialHandle).not.toBeNull();
    expect(initialHandle!.content()).toBe('content-a');

    contentValue.set('content-b');
    await stabilize();

    expect(overlay()).toBe(initialHandle);
    expect(overlay()!.content()).toBe('content-b');
  });

  it('updates connected position values reactively without reopening the overlay', async () => {
    const state = signal(false);
    const el1 = document.createElement('button');
    const el2 = document.createElement('button');
    const refEl = signal<HTMLElement>(el1);
    const placement = signal<Placement>('bottom');
    const overlay = createOverlayInContext(() => ({
      state,
      content: 'test',
      position: {
        connectedTo: refEl(),
        placement: placement(),
      },
    }));

    state.set(true);
    await stabilize();

    const initialHandle = overlay();
    refEl.set(el2);
    placement.set('top');
    await stabilize();

    const position = overlay()!.position() as ConnectedPosition;
    expect(overlay()).toBe(initialHandle);
    expect(position.referenceElement).toBe(el2);
    expect(position.placement).toBe('top');
  });

  it('waits for non-null content before opening when state is already true', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    host.contentMode.set('null');
    host.state.set(true);

    await stabilize(fixture);
    expect(host.overlay()).toBeNull();

    host.contentMode.set('string');
    await stabilize(fixture);

    expect(host.overlay()).not.toBeNull();
    expect(host.overlay()!.content()).toBe('overlay-a');
  });

  it('throws when the position family changes during an open session', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    await stabilize(fixture);

    host.state.set(true);
    await stabilize(fixture);

    host.family.set('connected');

    expect(() => TestBed.flushEffects()).toThrowError(
      /position family cannot change within a session/i,
    );
  });

  it('treats close policy flags as open-cycle snapshots', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    await stabilize(fixture);

    host.closeOutsideClick.set(false);
    host.state.set(true);
    await stabilize(fixture);

    host.closeOutsideClick.set(true);
    host.outside().nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await stabilize(fixture);

    expect(host.state()).toBe(true);
    expect(host.overlay()).not.toBeNull();

    host.state.set(false);
    await stabilize(fixture);

    host.state.set(true);
    await stabilize(fixture);

    host.outside().nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await stabilize(fixture);

    expect(host.state()).toBe(false);
    expect(host.overlay()).toBeNull();
  });

  it('runs setup once per open cycle and not on live content updates', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    host.contentMode.set('string');
    await stabilize(fixture);

    host.state.set(true);
    await stabilize(fixture);

    expect(host.setupSpy).toHaveBeenCalledTimes(1);

    host.textContent.set('overlay-b');
    await stabilize(fixture);

    expect(host.setupSpy).toHaveBeenCalledTimes(1);

    host.state.set(false);
    await stabilize(fixture);
    host.state.set(true);
    await stabilize(fixture);

    expect(host.setupSpy).toHaveBeenCalledTimes(2);
  });

  it('blocks closing when a canClose guard returns false', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    await stabilize(fixture);

    host.canCloseDecision.set(false);
    host.state.set(true);
    await stabilize(fixture);

    host.overlay()!.close();
    await stabilize(fixture);

    expect(host.canCloseSpy).toHaveBeenCalled();
    expect(host.state()).toBe(true);
    expect(host.overlay()).not.toBeNull();
  });

  it('passes the programmatic reason to beforeClose while state is still true', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    await stabilize(fixture);

    host.state.set(true);
    await stabilize(fixture);

    host.overlay()!.close();
    await stabilize(fixture);

    expect(host.beforeCloseSpy).toHaveBeenCalledTimes(1);
    const event = host.beforeCloseSpy.calls.mostRecent().args[0];
    expect(event.reason).toBe('programmatic');
    expect(event.state).toBe(true);
    expect(host.state()).toBe(false);
  });

  it('runs afterOpened after the shell is rendered and hostElement is assigned', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    await stabilize(fixture);

    host.state.set(true);
    await stabilize(fixture);

    expect(host.afterOpenedSpy).toHaveBeenCalledTimes(1);
    const event = host.afterOpenedSpy.calls.mostRecent().args[0];
    expect(event.hostElement).toBeTruthy();
    expect(event.container).toBeTruthy();
  });

  it('runs afterClose only after the shell container has been destroyed', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    await stabilize(fixture);

    host.state.set(true);
    await stabilize(fixture);

    host.overlay()!.close();
    await stabilize(fixture);

    expect(host.afterCloseSpy).toHaveBeenCalledTimes(1);
    const event = host.afterCloseSpy.calls.mostRecent().args[0];
    expect(event.reason).toBe('programmatic');
    expect(event.container).toBeNull();
  });

  it('restores focus using the latest restoreTo target on close', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    await stabilize(fixture);

    host.restoreTarget.set(host.altTrigger().nativeElement);
    host.state.set(true);
    await stabilize(fixture);

    const overlayPrimary = fixture.nativeElement.querySelector('#overlay-primary') as
      | HTMLButtonElement
      | null;
    overlayPrimary!.focus();
    host.overlay()!.close();
    await stabilize(fixture);

    expect(document.activeElement).toBe(host.altTrigger().nativeElement);
  });

  it('closes on outside click when enabled', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    await stabilize(fixture);

    host.state.set(true);
    await stabilize(fixture);

    host.outside().nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await stabilize(fixture);

    expect(host.state()).toBe(false);
    expect(host.overlay()).toBeNull();
    expect(host.beforeCloseSpy.calls.mostRecent().args[0].reason).toBe('outside-click');
  });

  it('closes connected overlays on focus leave by default', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    host.family.set('connected');
    await stabilize(fixture);

    host.state.set(true);
    await stabilize(fixture);

    const outsideButton = host.outside().nativeElement;
    outsideButton.focus();
    outsideButton.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await stabilize(fixture);

    expect(host.state()).toBe(false);
    expect(host.overlay()).toBeNull();
    expect(host.beforeCloseSpy.calls.mostRecent().args[0].reason).toBe('focusout');
  });

  it('closes on scroll when enabled', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    host.closeScroll.set(true);
    await stabilize(fixture);

    host.state.set(true);
    await stabilize(fixture);

    document.body.dispatchEvent(new Event('scroll', { bubbles: true }));
    await stabilize(fixture);

    expect(host.state()).toBe(false);
    expect(host.overlay()).toBeNull();
    expect(host.beforeCloseSpy.calls.mostRecent().args[0].reason).toBe('blur');
  });

  it('closes on Escape when enabled', async () => {
    const fixture = TestBed.createComponent(OverlayRuntimeHostComponent);
    const host = fixture.componentInstance;
    await stabilize(fixture);

    host.state.set(true);
    await stabilize(fixture);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await stabilize(fixture);

    expect(host.state()).toBe(false);
    expect(host.overlay()).toBeNull();
    expect(host.beforeCloseSpy.calls.mostRecent().args[0].reason).toBe('escape');
  });
});
