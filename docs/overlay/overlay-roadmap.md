# Overlay System — Roadmap

Planned improvements not yet implemented. Ordered by priority.

## 1. Singleton overlay pattern: Confirmation / Tooltip / Notification

**Проблема.** Три сервиса (`ConfirmationService`, `TooltipService`, `Notifier`) повторяют
один и тот же паттерн:

```ts
containerTemplateRef = signal<TemplateRef<any> | null>(null);
isOpen = signal(false);
strategy = computed(() => {
  const templateRef = this.containerTemplateRef();
  if (!templateRef) return null;
  return someOverlay({ templateRef, ... });
});
overlayHandle = createOverlay(this.isOpen, this.strategy, overlay => { ... });
```

Каждый сервис содержит ~15 строк boilerplate только для этого.

**Предложение.** Вынести в utility `createSingletonOverlay()` в CDK:

```ts
// Пример итогового API
const { isOpen, overlayHandle, setContainerRef } = createSingletonOverlay(
  () => modalOverlay({ templateRef: containerRef(), ... }),
  overlay => { trapOverlayFocus(overlay); },
);
```

**Затрагивает:** `components/overlay/confirmation/confirmation-service.ts`,
`components/overlay/tooltip/tooltip-service.ts`,
`components/overlay/notification/notifier.ts`.

---

## 2. Унификация типов: `OverlayCategory` / `OverlayStrategyKind` / `OverlayRuntimeCategory`

**Проблема.** Три похожих типа описывают "тип оверлея":

| Тип | Где используется | Значения |
|---|---|---|
| `OverlayStrategyKind` | strategy, shell routing | `connected \| modal \| menu \| tooltip \| notification` |
| `OverlayRuntimeCategory` | strategy.config | `popover \| menu \| dialog \| tooltip \| notification` |
| `OverlayCategory` | OverlayHandle | `popover \| menu \| dialog \| tooltip \| confirmation \| notification` |

Между `OverlayStrategyKind` и `OverlayRuntimeCategory` нет однозначного соответствия:
`connected` → `popover`, `modal` → `dialog`. `confirmation` существует только в category,
но не в kind.

**Предложение.** Объединить в один тип. `confirmation` сделать подкатегорией `dialog`
(у них одинаковый shell и поведение), убрать `OverlayRuntimeCategory` как отдельный тип.

**Затрагивает:** `overlay-strategy.ts`, `overlay-handle.ts`, `overlay-behaviors.ts`,
`overlay-stack.ts`.

---

## 3. Анимации `animate.enter` / `animate.leave`

**Проблема.** Shell компоненты используют нестандартный API в host metadata:

```ts
host: {
  'animate.enter': 'overlay-modal-enter',
  'animate.leave': 'overlay-modal-leave',
}
```

Это кастомный механизм, не часть Angular Animations API. Нет документации как это работает
и кто обрабатывает эти атрибуты.

**Предложение.** Задокументировать механизм в `docs/overlay/`. Если планируется переход на
Angular Animations или View Transitions API — зафиксировать решение.

**Затрагивает:** `overlay-modal-shell.component.ts`, `overlay-connected-shell.component.ts`.
