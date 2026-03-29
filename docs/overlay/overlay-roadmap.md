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

---

## 4. Убрать `@switch` в outlet и перейти на registry для shell-компонентов

**Проблема.** Сейчас `overlay-stack-outlet.html` жёстко маршрутизирует shell по
`overlay.strategy.kind`:

```html
@switch (overlay.strategy.kind) {
  @case ('modal') { ... }
  @case ('connected' | 'menu' | 'tooltip') { ... }
}
```

Это плохо масштабируется: при добавлении нового типа/подтипа нужно трогать outlet,
а связь между runtime-типами и shell размазана по template + strategy factories.

**Предложение.** Ввести shell registry/resolver (вместо `@switch`), например:

```ts
type OverlayShellMatcher = {
  category?: OverlayCategory;
  strategyKind?: OverlayStrategyKind;
  subcategory?: string;
};

interface OverlayShellRegistration {
  match: OverlayShellMatcher;
  component: Type<any>;
  priority?: number;
}
```

Outlet должен вызывать `overlayShellResolver.resolve(handle)` и рендерить компонент
через `ngComponentOutlet`.

**Плюсы:**
- расширяемость без изменения outlet;
- можно поддержать custom shell для `tooltip`/`menu`/новых подтипов;
- проще вынести в feature-level провайдеры.

**Затрагивает:** `components/overlay/shell/overlay-stack-outlet.*`,
`cdk/src/lib/overlay/*` (новый resolver/token).

---

## 5. Ввести подкатегорию (subcategory) как extension point

**Проблема.** `category` сейчас решает сразу несколько задач (z-index, escape policy,
частично shell routing). Для кейса "добавить Tooltip со своим Show Component" этого
недостаточно: нужен дополнительный уровень семантики, который не ломает базовую
категорию (`tooltip`, `popover`, `dialog`, ...).

**Предложение.** Добавить `subcategory?: string` в `OverlayStrategy` (или отдельный
`variant?: string`) и использовать его в shell resolver/behavior policies.

Пример:

```ts
tooltipOverlay({
  templateRef,
  subcategory: 'toolkit',
});
```

Тогда можно зарегистрировать shell:

```ts
{ match: { category: 'tooltip', subcategory: 'toolkit' }, component: ToolkitTooltipShellComponent }
```

и fallback:

```ts
{ match: { category: 'tooltip' }, component: OverlayConnectedShellComponent }
```

**Важно:** `subcategory` не должен влиять на stack rules (z-index/escape) по
умолчанию — только на rendering/UX-политику, если явно не переопределено.

**Затрагивает:** `overlay-strategy.ts`, `overlay-handle.ts`, `overlay-stack.ts`,
`overlay-stack-outlet.ts`.

---

## 6. Tooltip: `ConnectedOverlay` vs отдельный Toolkit-подтип

Нужно поддержать гибкость без форка overlay runtime.

**Вариант A — оставить Tooltip как `connectedOverlay` + subcategory.**

- Технически самый простой путь.
- Позиционирование (`OverlayPosition`) и lifecycle уже готовы.
- Добавляется только подтип + custom shell registration.

Когда выбирать: если Tooltip отличается в основном UI/анимацией/поведением показа,
но не требует отдельной модели стека.

**Вариант B — отдельный preset `toolkitTooltipOverlay(...)`.**

- Явный API для продуктовой фичи.
- Можно зафиксировать default behaviors и спец.опции в одном месте.
- Внутри всё равно может использовать shell family `connected`.

Когда выбирать: если у Tooltip появляется собственный набор обязательных опций,
которые не хочется каждый раз собирать вручную.

**Рекомендация (порядок):**

1. Сначала сделать registry + `subcategory` (инфраструктура расширения).
2. Добавить custom Tooltip shell как PoC через subcategory.
3. Если API начинает повторяться в местах вызова — вынести в отдельный preset
   (`toolkitTooltipOverlay`).
