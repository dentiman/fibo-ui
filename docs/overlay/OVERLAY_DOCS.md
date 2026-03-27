# Overlay System Documentation Index

Complete documentation for fibo-ui CDK overlay system.

---

## 📖 Main Documentation

### [overlay-system.md](./overlay-system.md)
**The authoritative guide** — comprehensive reference covering all aspects of the overlay system.

**Topics:**
- Architecture (createOverlay, OverlayStack, OverlayContainer, OverlayHandle, OverlaySession)
- Composable behaviors (closeOnOutsideClick, closeOnFocusLeave, trapOverlayFocus, closeOnScroll, etc.)
- ARIA and accessibility (OverlayPanel, OverlayTitle, OverlayDescription directives)
- Focus management (`trapOverlayFocus` + `restoreTriggerFocusOnClose`)
- Close guards (conditional closing)
- Escape handling (centralized)
- Lifecycle
- Nested overlays / branches
- Z-index strategy
- Usage examples
- Best practices

**Read this first for:** Complete understanding, implementation details, examples.

---

## 🚀 Quick Reference

### [overlays.md](./overlays.md)
Quick reference for common patterns.

**Topics:**
- Basic usage example
- Core contract
- Config structure
- Setup function API
- Behavior helpers overview
- Runtime architecture (short)
- Nested overlay branches
- Lifecycle overview

**Read this for:** Quick lookup, refresher on API signatures.

---

## 📊 Implementation Status

### [overlay-improvements-status.md](./overlay-improvements-status.md)
Status report of improvements made to the overlay system (with latest addendum from 2026-03-26).

**Topics:**
- Problems found vs. implemented ✅
- Focus management via `trapOverlayFocus` (autofocus + cyclic tab + branch-aware guard)
- Scroll strategies (blockScroll with reference counting, closeOnScroll)
- Escape handling (centralized through OverlayStack)
- canClose guards API
- ARIA system (OverlayPanel, OverlayTitle, OverlayDescription)
- Deferred solutions (inert, Shadow DOM support)
- Files changed
- Build status

**Read this for:** Understanding what's been done, what's deferred, migration path.

---

## 🧭 Strategy Migration

### [overlay-strategies.md](./overlay-strategies.md)
First-step migration note for typed overlay strategies and preset factories.

**Topics:**
- strategy kinds and presets
- connected/modal/menu/tooltip examples
- transitional runtime mapping
- migration order

---

## 📋 Code Review & Analysis

### [overlay-code-review.md](./overlay-code-review.md)
In-depth code review comparing fibo-ui overlay system with popular design systems.

**Analysis of:**
- Angular CDK
- Spartan/Brain
- Taiga-UI
- Zart

**Topics:**
- Architecture strengths and weaknesses
- Problems found (with priority scoring)
- Comparative table (capabilities vs. libraries)
- How overlays work in popular systems
- Key industry patterns
- Recommendations by priority

**Read this for:** Understanding trade-offs, architectural decisions, why certain patterns were chosen.
**Note:** This document is historical (pre-`trapOverlayFocus`) and should be read as background, not as current implementation spec.

---

## 🎯 Focus Management

### [focus-trap-proposal.md](./focus-trap-proposal.md)
Detailed historical analysis of focus-trap implementation approaches.

**Read this for:** Historical context and trade-off analysis before migration to behavior-based focus management.

---

## Navigation

```
Overlay System
├─ Complete Guide
│  └─ overlay-system.md ⭐ START HERE
│
├─ Quick Lookup
│  └─ overlays.md
│
├─ Implementation Details
│  ├─ overlay-improvements-status.md
│  ├─ overlay-code-review.md
│  └─ focus-trap-proposal.md (historical)
│
└─ Related
   ├─ data-list.md (for list-based overlays like menu, select)
   └─ composition.md (composition patterns)
```

---

## Key Files in Code

### CDK
- `projects/fibo-ui/cdk/src/lib/overlay/` — Core overlay system
  - `overlay-stack.ts` — Runtime coordinator
  - `overlay-handle.ts` — Runtime object interface
  - `overlay-container.ts` — Rendering surface
  - `overlay-behaviors.ts` — Composable behavior policies (`trapOverlayFocus`, close policies, scroll lock)
  - `overlay-panel.ts` — **NEW** ARIA directives
  - `overlay-session.ts` — Lifecycle API
### Components
- `projects/fibo-ui/components/src/lib/overlay/` — Dialog, Drawer, Confirmation
- `projects/fibo-ui/components/src/lib/form-controls/fields/datepicker-field.ts` — Popover example

---

## Quick Snippets

### Basic Popover
```typescript
const overlayHandle = createOverlay(
  this.isOpen,
  computed(() => ({
    templateRef: this.contentTpl,
    referenceElement: this.triggerEl.nativeElement,
    category: 'popover',
  })),
  overlay => {
    closeOnFocusLeave(overlay);
    closeOnOutsideClick(overlay);
    restoreTriggerFocusOnClose(overlay);
  }
);
```

### Modal Dialog with ARIA
```typescript
createOverlay(isOpen, config, overlay => {
  closeOnBackdropClick(overlay);
  blockScroll(overlay);
  trapOverlayFocus(overlay);
  restoreTriggerFocusOnClose(overlay);
});
```

### With Close Guards
```typescript
overlay.canClose((reason, event) => {
  if (reason === 'escape' && this.hasUnsavedChanges()) {
    return false;  // Don't close
  }
  return true;
});
```

---

## Versions & History

| Date | Version | Changes |
|---|---|---|
| 2026-03-26 | v1.x | Replaced template `fiboFocusTrap` usage with behavior-based `trapOverlayFocus`; removed focus-trap directive from CDK API |
| 2026-03-18 | v1.x | Complete overlay-system.md, improvements-status.md, removed duplicate popover.md |
| 2026-03-18 | v1.x | Directive-based FocusTrap improvements (historical), blockScroll, canClose guards, ARIA system, centralized Escape |
| Earlier | v1.0 | Initial overlay system, basic behaviors |

---

## Related Topics

- **Focus Management (historical):** [focus-trap-proposal.md](./focus-trap-proposal.md)
- **Data Lists & Selection:** [data-list.md](./data-list.md)
- **Composition Patterns:** [composition.md](./composition.md)
- **Form System:** See components library docs
- **Popover Positioning:** Uses `@floating-ui/dom` + `@angular/cdk` PositionStrategy

---

*Last updated: 2026-03-26*
*CDK overlay system, comprehensive documentation in Russian and English*
