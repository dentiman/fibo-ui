# PasswordField — Design Spec

**Date:** 2026-05-21  
**Status:** Approved

---

## Goal

Add a `PasswordField` component (`fibo-password-field`) that wraps the existing `TextField` pattern and provides a toggle button (eye icon) to switch the input between `password` and `text` types.

---

## Architecture

### 1. Extend `FieldShell` — add `[fiboFieldEnd]` projection slot

**File:** `projects/fibo-ui/components/src/lib/form-controls/form/field-shell.ts`

Add a named `ng-content` slot immediately before the `@if (iconEnd())` block:

```html
<ng-content select="[fiboFieldEnd]"></ng-content>
```

This is a purely additive change. Existing consumers of `FieldShell` are unaffected — they project nothing with the `fiboFieldEnd` attribute.

The slot is general-purpose: any field component that needs interactive end-area content (e.g., numeric stepper buttons) can use it in the future.

---

### 2. `PasswordField` component

**File:** `projects/fibo-ui/components/src/lib/form-controls/fields/password-field.ts`  
**Selector:** `fibo-password-field`

Mirrors `TextField` with these differences:

| | `TextField` | `PasswordField` |
|---|---|---|
| `type` input | external, default `'text'` | no external input |
| input type | bound to `type()` | `computed(() => showPassword() ? 'text' : 'password')` |
| toggle button | — | projected via `[fiboFieldEnd]` |

**Internal signals:**
- `showPassword = signal(false)`
- `inputType = computed(() => this.showPassword() ? 'text' : 'password')`

**Template outline:**
```html
<fibo-field-shell [label] [hint] [iconStart] [canClear] (clearRequested)>
  <input fiboFieldInput class="fibo-field-input" [type]="inputType()" ... />
  <button
    fiboFieldEnd
    fiboFieldAuxiliary
    type="button"
    class="fibo-field-toggle"
    aria-label="Toggle password visibility"
    (pointerdown)="$event.preventDefault()"
    (click)="toggleVisibility()"
  >
    <lucide-icon [name]="showPassword() ? 'eye-off' : 'eye'" size="16" />
  </button>
</fibo-field-shell>
```

**Method:** `toggleVisibility()` — sets `showPassword.update(v => !v)`, no-op when disabled.

Implements `FormValueControl<string>` identical to `TextField`.

---

### 3. CSS

**File:** `projects/fibo-ui/components/src/styles/form-field.css`

Add `.fibo-field-toggle` class in the `/* ── Clear button ── */` section:

```css
.fibo-field-toggle {
  cursor: pointer;
  border-radius: 9999px;
  flex-shrink: 0;
  color: var(--foreground-tertiary);
  transition: color 200ms;
  &:hover { color: var(--foreground); }
}
.fibo-field-container[aria-disabled="true"] .fibo-field-toggle {
  cursor: not-allowed;
}
```

Unlike `.fibo-field-clear`, the toggle is **always visible** — no `display: none` default.

---

### 4. Exports & registration

| File | Change |
|---|---|
| `components/src/public-api.ts` | `export * from './lib/form-controls/fields/password-field'` |
| `src/app/app.config.ts` | Import `Eye, EyeOff` from `lucide-angular`; add both to `icons` object |
| `src/app/pages/components/examples/components-fields-form.ts` | Import `PasswordField`; add `<fibo-password-field>` in template with `label`, `placeholder`, `[formField]` |

---

## Scope

- No changes to CDK layer
- No new directives — uses existing `FieldAuxiliary` and `FieldShellHost`
- `PasswordField` ≤ 80 lines (blueprint target)
- No unit tests in scope for this iteration
