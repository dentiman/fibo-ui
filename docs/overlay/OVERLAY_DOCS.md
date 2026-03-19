# Overlay System Documentation Index

Complete documentation for fibo-ui CDK overlay system.

---

## 📖 Main Documentation

### [overlay-system.md](./overlay-system.md)
**The authoritative guide** — comprehensive reference covering all aspects of the overlay system.

**Topics:**
- Architecture (createOverlay, OverlayStack, OverlayContainer, OverlayHandle, OverlaySession)
- Composable behaviors (closeOnOutsideClick, closeOnFocusLeave, blockScroll, closeOnScroll, etc.)
- ARIA and accessibility (OverlayPanel, OverlayTitle, OverlayDescription directives)
- Focus management (FocusTrap + FocusTrapStack mechanism)
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
Status report of all improvements made to the overlay system as of 2026-03-18.

**Topics:**
- Problems found vs. implemented ✅
- FocusTrap improvements (FocusTrapStack, focusin listener, guardFocus)
- Scroll strategies (blockScroll with reference counting, closeOnScroll)
- Escape handling (centralized through OverlayStack)
- canClose guards API
- ARIA system (OverlayPanel, OverlayTitle, OverlayDescription)
- Deferred solutions (inert, Shadow DOM support)
- Files changed
- Build status

**Read this for:** Understanding what's been done, what's deferred, migration path.

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

---

## 🎯 Focus Management

### [focus-trap-proposal.md](./focus-trap-proposal.md)
Detailed analysis of FocusTrap implementation approaches.

**Topics:**
- Current implementation in fibo-ui
- Problems identified
- How focus trap works in:
  - Angular CDK (sentinel approach)
  - Taiga-UI (element + focusin listener approach)
  - fibo-ui (tab-handler approach)
- Comparative table
- Improvement proposals (Variant A recommended = what was implemented)
- Priority breakdown

**Read this for:** Understanding focus management decisions, why certain trade-offs were made.

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
│  └─ focus-trap-proposal.md
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
  - `overlay-behaviors.ts` — Composable behavior policies
  - `overlay-panel.ts` — **NEW** ARIA directives
  - `overlay-session.ts` — Lifecycle API
- `projects/fibo-ui/cdk/src/lib/a11y/focus-trap.ts` — Focus management with FocusTrapStack

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
```html
<div fiboFocusTrap [restoreFocus]="false">
  <div fiboOverlayPanel>
    <h2 fiboOverlayTitle>Title</h2>
    <p fiboOverlayDescription>Description</p>
    <!-- content -->
  </div>
</div>
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
| 2026-03-18 | v1.x | Complete overlay-system.md, improvements-status.md, removed duplicate popover.md |
| 2026-03-18 | v1.x | FocusTrap improvements, blockScroll, canClose guards, ARIA system, centralized Escape |
| Earlier | v1.0 | Initial overlay system, basic behaviors |

---

## Related Topics

- **Focus Management:** [focus-trap-proposal.md](./focus-trap-proposal.md)
- **Data Lists & Selection:** [data-list.md](./data-list.md)
- **Composition Patterns:** [composition.md](./composition.md)
- **Form System:** See components library docs
- **Popover Positioning:** Uses `@floating-ui/dom` + `@angular/cdk` PositionStrategy

---

*Last updated: 2026-03-18*
*CDK overlay system, comprehensive documentation in Russian and English*
