import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createOverlay } from './public-overlay';
import { CONNECTED_SHELL_TOKEN, MODAL_SHELL_TOKEN } from './overlay-shell-tokens';
import type { ConnectedPosition } from './overlay-config';

describe('createOverlay', () => {
  // ─── Test 1: initial state ───────────────────────────────

  it('returns null signal when state is false', () => {
    const state = signal(false);
    const overlay = TestBed.runInInjectionContext(() =>
      createOverlay(() => ({ state, content: 'test' })),
    );
    expect(overlay()).toBeNull();
  });

  // ─── Tests 2-4: Family detection ────────────────────────

  it('detects global family (no position) and applies MODAL_SHELL_TOKEN', () => {
    const state = signal(false);
    const overlay = TestBed.runInInjectionContext(() =>
      createOverlay(() => ({ state, content: 'test' })),
    );
    state.set(true);
    TestBed.flushEffects();

    expect(overlay()).not.toBeNull();
    expect(overlay()!.behavior.shell).toBe(MODAL_SHELL_TOKEN);
    expect(overlay()!.behavior.needsBackdrop).toBe(true);
    expect(overlay()!.behavior.blockScroll).toBe(true);
  });

  it('detects connected family and applies CONNECTED_SHELL_TOKEN', () => {
    const state = signal(false);
    const el = document.createElement('button');
    const overlay = TestBed.runInInjectionContext(() =>
      createOverlay(() => ({
        state,
        content: 'test',
        position: { connectedTo: el },
      })),
    );
    state.set(true);
    TestBed.flushEffects();

    expect(overlay()).not.toBeNull();
    expect(overlay()!.behavior.shell).toBe(CONNECTED_SHELL_TOKEN);
    expect(overlay()!.behavior.needsBackdrop).toBeFalsy();
  });

  it('detects coordinate family and applies CONNECTED_SHELL_TOKEN', () => {
    const state = signal(false);
    const overlay = TestBed.runInInjectionContext(() =>
      createOverlay(() => ({
        state,
        content: 'test',
        position: { x: 10, y: 20 },
      })),
    );
    state.set(true);
    TestBed.flushEffects();

    expect(overlay()).not.toBeNull();
    expect(overlay()!.behavior.shell).toBe(CONNECTED_SHELL_TOKEN);
  });

  // ─── Test 5: Explicit shell override ────────────────────

  it('respects explicit shell token override for global family', () => {
    const state = signal(false);
    const overlay = TestBed.runInInjectionContext(() =>
      createOverlay(() => ({
        state,
        content: 'test',
        shell: CONNECTED_SHELL_TOKEN,
      })),
    );
    state.set(true);
    TestBed.flushEffects();

    expect(overlay()!.behavior.shell).toBe(CONNECTED_SHELL_TOKEN);
  });

  // ─── Test 6: Dynamic content ─────────────────────────────

  it('updates content reactively without closing the overlay', () => {
    const state = signal(false);
    const contentValue = signal<string>('content-a');
    const overlay = TestBed.runInInjectionContext(() =>
      createOverlay(() => ({
        state,
        content: contentValue(),
      })),
    );
    state.set(true);
    TestBed.flushEffects();

    const handleBefore = overlay();
    expect(handleBefore).not.toBeNull();
    expect(handleBefore!.content()).toBe('content-a');

    contentValue.set('content-b');
    TestBed.flushEffects();

    expect(overlay()).toBe(handleBefore); // same handle — overlay not closed
    expect(overlay()!.content()).toBe('content-b');
  });

  // ─── Test 7: Dynamic position values ────────────────────

  it('updates connected position referenceElement reactively', () => {
    const state = signal(false);
    const el1 = document.createElement('button');
    const el2 = document.createElement('button');
    const refEl = signal<HTMLElement>(el1);

    const overlay = TestBed.runInInjectionContext(() =>
      createOverlay(() => ({
        state,
        content: 'test',
        position: { connectedTo: refEl() },
      })),
    );
    state.set(true);
    TestBed.flushEffects();

    refEl.set(el2);
    TestBed.flushEffects();

    const pos = overlay()!.position() as ConnectedPosition;
    expect(pos.type).toBe('connected');
    expect(pos.referenceElement).toBe(el2);
  });

  // ─── Test 9: canClose blocks closing ────────────────────

  it('canClose returning false prevents close', () => {
    const state = signal(false);
    const overlay = TestBed.runInInjectionContext(() =>
      createOverlay(() => ({
        state,
        content: 'test',
        lifecycle: { canClose: [() => false] },
      })),
    );
    state.set(true);
    TestBed.flushEffects();

    overlay()!.close();
    TestBed.flushEffects();

    expect(state()).toBe(true);
    expect(overlay()).not.toBeNull();
  });

  // ─── Test 10: beforeClose runs before state flip ────────

  it('beforeClose handler executes while state is still true', () => {
    const state = signal(false);
    const capturedStates: boolean[] = [];

    const overlay = TestBed.runInInjectionContext(() =>
      createOverlay(() => ({
        state,
        content: 'test',
        lifecycle: {
          beforeClose: [() => capturedStates.push(state())],
        },
      })),
    );
    state.set(true);
    TestBed.flushEffects();

    overlay()!.close();
    TestBed.flushEffects();

    expect(capturedStates.length).toBe(1);
    expect(capturedStates[0]).toBe(true);
    expect(state()).toBe(false);
    expect(overlay()).toBeNull();
  });
});
