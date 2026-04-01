import { TemplateRef, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createOverlay } from './overlay-stack';
import { connectedPosition, coordinatePosition, globalPosition } from './overlay-config';
import { CONNECTED_SHELL_TOKEN, MODAL_SHELL_TOKEN } from './overlay-shell-tokens';

describe('overlay config', () => {
  it('creates a global position', () => {
    const pos = globalPosition();
    expect(pos.type).toBe('global');
  });

  it('creates a connected position with defaults', () => {
    const pos = connectedPosition();
    expect(pos.type).toBe('connected');
    expect(pos.placement).toBeUndefined();
    expect(pos.offset).toBeUndefined();
  });

  it('creates a connected position with options', () => {
    const ref = document.createElement('button');
    const pos = connectedPosition({ referenceElement: ref, placement: 'bottom', matchWidth: true, offset: 8 });
    expect(pos.type).toBe('connected');
    expect(pos.referenceElement).toBe(ref);
    expect(pos.placement).toBe('bottom');
    expect(pos.matchWidth).toBe(true);
    expect(pos.offset).toBe(8);
  });

  it('creates a coordinate position', () => {
    const pos = coordinatePosition(100, 200);
    expect(pos.type).toBe('coordinate');
    expect(pos.x).toBe(100);
    expect(pos.y).toBe(200);
  });

  it('creates a coordinate position with placement', () => {
    const pos = coordinatePosition(100, 200, { placement: 'right-start' });
    expect(pos.type).toBe('coordinate');
    expect(pos.placement).toBe('right-start');
  });

  it('allows createOverlay with connected behavior', () => {
    const isOpen = signal(false) as WritableSignal<boolean>;
    const behavior = { shell: CONNECTED_SHELL_TOKEN, closeOnOutsideClick: true };
    const position = signal(connectedPosition());
    const content = signal<TemplateRef<any> | string | null>(null);

    const overlay = TestBed.runInInjectionContext(() =>
      createOverlay(isOpen, behavior, position, content),
    );
    expect(overlay()).toBeNull();
  });

  it('allows createOverlay with modal behavior', () => {
    const isOpen = signal(false) as WritableSignal<boolean>;
    const behavior = {
      shell: MODAL_SHELL_TOKEN,
      needsBackdrop: true,
      blockScroll: true,
      closeOnOutsideClick: true,
    };
    const position = signal(globalPosition());
    const content = signal<TemplateRef<any> | string | null>(null);

    const overlay = TestBed.runInInjectionContext(() =>
      createOverlay(isOpen, behavior, position, content),
    );
    expect(overlay()).toBeNull();
  });
});
