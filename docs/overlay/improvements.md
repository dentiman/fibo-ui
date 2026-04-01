# Overlay System — Architecture Improvements

Internal tracking doc. Накапливаем концепции для будущего рефакторинга.

---

## 1. `viewChildren(OverlayContainer)` в OverlayStackOutlet

### Идея

`OverlayContainer` применяется как `hostDirective` на хост-элементе каждого shell-компонента.
`NgComponentOutlet` вставляет хост-элемент в view outlet'а — не в child component view.
Поэтому `viewChildren(OverlayContainer)` в outlet'е **найдёт их** через границу `NgComponentOutlet`.

```ts
// OverlayStackOutlet
readonly containers = viewChildren(OverlayContainer);
// → Signal<readonly OverlayContainer[]>, обновляется при открытии/закрытии
```

### Что это даёт

- Диспатчер outside-click итерирует `containers()` напрямую — есть и handle, и `elementRef.nativeElement`
- Убираем `setOverlayHandleInteractionRootInternal` / `getOverlayHandleInteractionRootInternal` из handle
- `OverlayStack` становится чистым реестром (open/close lifecycle), не держит DOM-знания
- `OverlayContainer` не нужно ничего регистрировать в `ngOnInit` — outlet сам наблюдает

### Что нужно проверить

- Порядок элементов в `viewChildren` совпадает с порядком в `openOverlayList()` (открытие в порядке вставки)
- Работает ли `viewChildren` при анимации leave (контейнер ещё в DOM, overlay уже закрылся)

---

## 2. Инжекция родительского `OverlayContainer` для parent-child цепочки

### Идея

`OverlayContainer` предоставляет себя через `InjectionToken` (`provide` в `providers`).
Когда `createOverlay()` вызывается из компонента, рендерящегося внутри контента overlay A, injection context этого компонента включает overlay A's `OverlayContainer`.
Таким образом — при создании overlay B можно инжектить родительский `OverlayContainer`:

```ts
// В createOverlay() или OverlayStack.addOverlay():
const parentContainer = inject(OVERLAY_CONTAINER_TOKEN, { optional: true });
// parentContainer — это OverlayContainer overlay A, если B создан внутри A
```

### Почему это лучше текущего `overlayParentIds` Map

Сейчас: определяем родителя через `document.activeElement` в момент `addOverlay()` — хрупко.

С инжекцией:
- Parent-child relationship строится через Angular's DI tree — надёжно и нативно
- Не нужен `overlayParentIds` Map вообще
- `isOverlayInBranch` строится через цепочку `parentContainer.handle` вместо Map lookup

### Как реализовать

```ts
// overlay-container.ts
@Directive({
  providers: [{ provide: OVERLAY_CONTAINER_TOKEN, useExisting: OverlayContainer }],
})
export class OverlayContainer { ... }

// overlay-stack.ts — в addOverlay():
const parentContainer = inject(OVERLAY_CONTAINER_TOKEN, { optional: true, skipSelf: false });
const parentOverlayId = parentContainer?.shellHost.handle().id ?? null;
```

### Ограничение

Работает только если `createOverlay()` вызывается в injection context компонента внутри overlay.
Для сервисов (ConfirmationService) — нет injection context overlay, parentOverlayId = null. Это нормально.

---

## 3. OverlayStack как чистый реестр

### Текущее состояние

`OverlayStack` содержит:
- Реестр открытых оверлеев (`openOverlays` signal)
- `overlayParentIds` Map
- Централизованный outside-click dispatcher
- Lifecycle management (create/teardown cycle)
- `closeAllByTag`, `completeAfterClose`

### Целевое состояние

Разгрузить `OverlayStack`:

| Что | Куда |
|---|---|
| Outside-click dispatcher | `OverlayStackOutlet` (через `viewChildren`) |
| Parent-child IDs | Убрать, заменить DI-инжекцией (концепт #2) |
| `interactionRoot` на handle | Убрать, брать из `OverlayContainer` напрямую |

`OverlayStack` держит только:
- `openOverlayList` — ordered array
- `pendingAfterClose` — lifecycle completion
- `closeAllByTag` — cross-overlay coordination
- `completeAfterClose` — shell callback

---

## 4. Больше Angular-паттернов, меньше эффектов

### Текущие эффекты в createOverlay

- `effect(() => { if (!isOpen()) teardown(); else openOverlay(); })` — основной lifecycle

### Идея: перейти на `linkedSignal` или `resource`

Angular 19+ предоставляет `linkedSignal` для derived writable state.
Возможно, lifecycle overlay можно выразить через `linkedSignal` без явного `effect`.

Пока не проработано — зафиксировать как направление.

---

## Приоритет

1. **#2 (DI parent injection)** — убирает `overlayParentIds` и хрупкий `document.activeElement` хак
2. **#1 (viewChildren)** — убирает `interactionRoot` из handle, упрощает dispatcher
3. **#3 (чистый реестр)** — итог после #1 и #2
4. **#4 (linkedSignal)** — дальний горизонт
