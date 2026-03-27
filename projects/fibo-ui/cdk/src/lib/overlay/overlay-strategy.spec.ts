import { TemplateRef, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { connectedOverlay, menuOverlay, modalOverlay, tooltipOverlay } from './overlay-strategy';
import { createOverlay } from './overlay-stack';

describe('overlay strategies', () => {
  const templateRef = {} as TemplateRef<any>;

  it('creates a connected strategy preset', () => {
    const strategy = connectedOverlay({
      templateRef,
      referenceElement: document.createElement('button'),
      placement: 'bottom',
      matchWidth: true,
    });

    expect(strategy.kind).toBe('connected');
    expect(strategy.shell).toBe('connected');
    expect(strategy.category).toBe('popover');
    expect(strategy.config.templateRef).toBe(templateRef);
    expect(strategy.defaultBehaviors).toEqual([
      'closeOnOutsideClick',
      'closeOnFocusLeave',
      'restoreTriggerFocusOnClose',
    ]);
  });

  it('creates a modal strategy preset', () => {
    const strategy = modalOverlay({
      templateRef,
    });

    expect(strategy.kind).toBe('modal');
    expect(strategy.shell).toBe('modal');
    expect(strategy.category).toBe('dialog');
    expect(strategy.options.blockScroll).toBe(true);
    expect(strategy.defaultBehaviors).toEqual([
      'trapOverlayFocus',
      'restoreTriggerFocusOnClose',
    ]);
  });

  it('creates a menu strategy preset', () => {
    const strategy = menuOverlay({
      templateRef,
    });

    expect(strategy.kind).toBe('menu');
    expect(strategy.shell).toBe('menu');
    expect(strategy.category).toBe('menu');
  });

  it('creates a tooltip strategy preset', () => {
    const strategy = tooltipOverlay({
      templateRef,
    });

    expect(strategy.kind).toBe('tooltip');
    expect(strategy.shell).toBe('tooltip');
    expect(strategy.category).toBe('tooltip');
  });

  it('allows createOverlay to accept a strategy', () => {
    const isOpen = signal(false) as WritableSignal<boolean>;
    const strategy = connectedOverlay({
      templateRef,
      referenceElement: document.createElement('button'),
    });

    const overlay = TestBed.runInInjectionContext(() => createOverlay(isOpen, strategy));

    expect(overlay()).toBeNull();
  });
});
