# DataList Navigation Strategy Refactor

## Goal

Replace the DI-based navigation strategy override (`InjectionToken` + `provideDataListNavigationStrategy`) with a simple boolean input `useActiveDescendant` on `DataList`. This follows the Angular CDK Listbox pattern and encapsulates strategy selection inside DataList.

## Motivation

- Only one consumer (Combobox) overrides the default strategy via `viewProviders`
- The `InjectionToken` + provider function adds indirection for a simple two-option choice
- Angular CDK uses `useActiveDescendant: boolean` input on CdkListbox — proven pattern

## Changes

### 1. `data-list-navigation-strategy.ts` (CDK)

**Make internal:** Remove all public exports. The file becomes a private implementation detail.

- `DataListNavigationStrategy` interface — private
- `DataListContext` interface — private
- `FOCUS_ACTIVE_DATA_LIST_NAVIGATION_STRATEGY` — private (not exported)
- `ACTIVE_DESCENDANT_DATA_LIST_NAVIGATION_STRATEGY` — private (not exported)
- `focusActiveItem()`, `scrollActiveItemIntoView()` — private helpers (already were)

**Delete:**
- `DATA_LIST_NAVIGATION_STRATEGY` InjectionToken
- `provideDataListNavigationStrategy()` function

### 2. `data-list.ts` (CDK)

**Remove:**
- `inject(DATA_LIST_NAVIGATION_STRATEGY)` — no more DI injection
- `navigationStrategy` input — replaced by `useActiveDescendant`

**Add:**
```typescript
useActiveDescendant = input(false);

private readonly navigationStrategy = computed(() =>
  this.useActiveDescendant()
    ? ACTIVE_DESCENDANT_DATA_LIST_NAVIGATION_STRATEGY
    : FOCUS_ACTIVE_DATA_LIST_NAVIGATION_STRATEGY
);
```

Navigation methods (`navigateNext`, `navigatePrev`, `navigateFirst`, `navigateLast`) continue calling `this.navigationStrategy().applyKeyboardNavigation(this, event)` — no changes needed since `computed` returns the same interface shape as the previous `input`.

### 3. `public-api.ts` (CDK)

Remove the line:
```typescript
export * from './lib/data-list/data-list-navigation-strategy';
```

The navigation strategy is no longer part of the public API.

### 4. `combobox.ts` (Components)

**Remove from imports:**
- `ACTIVE_DESCENDANT_DATA_LIST_NAVIGATION_STRATEGY`
- `provideDataListNavigationStrategy`

**Remove `viewProviders` array** (it only contained the strategy override).

**Update template** — add `[useActiveDescendant]="true"` to the `fiboDataList` element:
```html
<div
  fiboComboboxList
  [keyboardSourceElement]="inputElement"
  fiboDataList
  [useActiveDescendant]="true"
  [autoActivateFirst]="true"
  (itemTriggered)="expanded.set(false)"
  fiboSelectOne
  [(value)]="value"
>
```

### 5. Documentation — `public/documentation/cdk/data-list.md`

Update the "Navigation Strategy" section:
- Remove references to `DATA_LIST_NAVIGATION_STRATEGY`, `provideDataListNavigationStrategy`, `viewProviders` pattern
- Document `[useActiveDescendant]="true"` as the way to switch to active-descendant mode
- Update API Snapshot: remove token/provider, add `DataList.useActiveDescendant`

## Files Affected

| File | Action |
|------|--------|
| `projects/fibo-ui/cdk/src/lib/data-list/data-list-navigation-strategy.ts` | Remove public exports, delete token & provider |
| `projects/fibo-ui/cdk/src/lib/data-list/data-list.ts` | Replace DI + input with `useActiveDescendant` + computed |
| `projects/fibo-ui/cdk/src/public-api.ts` | Remove strategy re-export |
| `projects/fibo-ui/components/src/lib/form-controls/combobox/combobox.ts` | Remove viewProviders, use input in template |
| `public/documentation/cdk/data-list.md` | Update examples and API snapshot |
