# Overlay System — Implementation Status

Статус реализованных улучшений и рекомендаций из кода-ревью от 2026-03-18, с обновлением архитектуры фокуса от 2026-03-26.

---

## Обнаруженные проблемы (из анализа)

| № | Проблема | Статус | Реализация |
|---|---|---|---|
| 1 | Нет системы стратегий скролла | ✅ РЕШЕНО | `blockScroll()` + `closeOnScroll()` behaviors |
| 2 | Нет захвата фокуса в overlay-ветке | ✅ РЕШЕНО | `trapOverlayFocus()` (autofocus + cyclic Tab + branch-aware guard) |
| 3 | Нет управления ARIA-атрибутами | ✅ РЕШЕНО | `OverlayPanel`, `OverlayTitle`, `OverlayDescription` |
| 4 | Нет `inert` на фоновом контенте | ⏳ ОТЛОЖЕНО | Рассмотрено, оставлено для будущего |
| 5 | Единый глобальный обработчик Escape | ✅ РЕШЕНО | Централизовано через `OverlayStack.closeTopmost('escape')` |
| 6 | Нет поддержки Shadow DOM | ⏳ ОТЛОЖЕНО | Низкий приоритет, не требуется на текущем этапе |
| 7 | Нет сохранения позиции скролла | ✅ РЕШЕНО | `blockScroll()` сохраняет `scrollX/Y` и смещает на `top/left` |
| 8 | `*ngTemplateOutlet` вместо нативного потока | ✅ РЕШЕНО | Использование в специфичных местах оправдано |

---

## Реализованные улучшения

### 1. Focus Management — Behavior-first модель (`trapOverlayFocus`)

#### До
- Фокус-логика была распределена между template-директивой и overlay-behaviors.
- На практике `fiboFocusTrap` в overlay-потребителях был сконфигурирован с `guardFocus=false`.
- Вложенные overlay-сценарии требовали отдельной координации.

#### После
**Файл:** `projects/fibo-ui/cdk/src/lib/overlay/overlay-behaviors.ts`

```typescript
trapOverlayFocus(overlay, options?)
```

`trapOverlayFocus` объединяет focus-политику в одном behavior для текущего overlay-контейнера:
- `afterOpened` initial focus (`[fiboFocusInitial]` -> first tabbable -> panel root),
- циклический `Tab/Shift+Tab` внутри текущего `data-overlay-container-id`,
- `focusin` guard с branch-проверкой через `overlay.isInOverlayBranch(...)`.

**Автоматическое правило guard:**
- `dialog`/`confirmation` -> `guard=true`,
- `popover`/`menu`/`tooltip`/`notification` -> `guard=false`.

**Интеграция в потребителях:**
```typescript
createOverlay(isOpen, config, overlay => {
  trapOverlayFocus(overlay);
  restoreTriggerFocusOnClose(overlay);
});
```

**Результат:**
- template-директива `fiboFocusTrap` удалена из потребителей и из CDK API,
- фокус и вложенность управляются на уровне overlay behaviors.

---

### 2. Scroll Strategies — Управление скроллом

#### До
- Только `overflow: hidden` для диалогов
- Видимый скачок при открытии (не сохранена позиция)
- Нет закрытия при скролле

#### После
**Файл:** `projects/fibo-ui/cdk/src/lib/overlay/overlay-behaviors.ts`

#### 2a. `blockScroll(overlay)` — Блокировка скролла

```typescript
let scrollLockCount = 0;
let scrollLockSavedY = 0;
let scrollLockSavedX = 0;

function acquireScrollLock(): void {
  scrollLockCount++;
  if (scrollLockCount > 1) return;  // Уже заблокирован

  scrollLockSavedY = window.scrollY;
  scrollLockSavedX = window.scrollX;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  const html = document.documentElement;
  html.style.position = 'fixed';
  html.style.top = `-${scrollLockSavedY}px`;      // Смещение для предотвращения сдвига
  html.style.left = `-${scrollLockSavedX}px`;
  html.style.width = '100%';
  html.style.overflow = 'hidden';
  html.style.overscrollBehavior = 'none';          // iOS: предотвращение overscroll
  document.body.style.touchAction = 'none';        // iOS: disable touch scroll
  if (scrollbarWidth > 0) {
    html.style.paddingRight = `${scrollbarWidth}px`;  // Компенсация ширины скроллбара
  }
}

function releaseScrollLock(): void {
  if (scrollLockCount === 0) return;
  scrollLockCount--;
  if (scrollLockCount > 0) return;  // Ещё есть другие блокировки

  // Восстановить...
  window.scrollTo(scrollLockSavedX, scrollLockSavedY);
}

export function blockScroll(overlay: OverlaySession): void {
  let acquired = false;
  overlay.afterOpened(() => {
    acquireScrollLock();
    acquired = true;
  });

  const release = () => {
    if (acquired) {
      releaseScrollLock();
      acquired = false;
    }
  };

  overlay.beforeClose(release);
  overlay.onCleanup(release);
}
```

**Reference counting:** Несколько диалогов могут быть открыты одновременно. Только первый блокирует скролл, только последний восстанавливает.

**Использование:**
```typescript
createOverlay(isOpen, config, overlay => {
  blockScroll(overlay);  // Для модальных диалогов
  closeOnBackdropClick(overlay);
  restoreTriggerFocusOnClose(overlay);
});
```

#### 2b. `closeOnScroll(overlay)` — Закрытие при скролле

Закрывает поповер/тултип если пользователь скроллит вне оверлея. Полезна для контекстного контента.

```typescript
export function closeOnScroll(overlay: OverlaySession): void {
  const effectRef = overlay.effect(onCleanup => {
    const handleScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && isElementInsideOverlayContainer(target, overlay.handle.id)) {
        return;  // Скролл внутри оверлея — игнорируем
      }
      overlay.requestClose('blur', event);
    };

    document.addEventListener('scroll', handleScroll, true);  // Фаза захвата
    onCleanup(() => document.removeEventListener('scroll', handleScroll, true));
  });

  overlay.onCleanup(() => effectRef.destroy());
}
```

---

### 3. Escape Handling — Централизованная обработка

#### До
- Обработчики на каждом триггере: `(keydown.escape)="close()"`
- Консьюмеры могли вызывать `isOpen.set(false)` напрямую
- Несогласованное закрытие, bypass guards

#### После
**Файлы:** `projects/fibo-ui/cdk/src/lib/overlay/overlay-stack.ts`

```typescript
// Глобальный слушатель в OverlayStack
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    this.overlayStack.closeTopmost('escape');  // Централизовано!
  }
}, true);

// closeTopmost находит верхний оверлей и вызывает:
overlay.requestClose('escape');
// Которая проходит через все canClose guards перед закрытием
```

**Изменения в консьюмерах:**

Удалены все `(keydown.escape)` обработчики:
- `popover-trigger.ts`
- `dialog-trigger.ts`
- `submenu-trigger.ts`
- `form-field-trigger.ts`

**Преимущества:**
- Единая точка управления
- Гарантированный порядок (вложенные закрываются сначала)
- Все guards применяются ко всем методам закрытия

---

### 4. canClose Guards — Условное закрытие

#### До
- Нет способа запретить закрытие при определённых условиях
- Нельзя было блокировать Escape если есть несохранённые данные

#### После
**Файл:** `projects/fibo-ui/cdk/src/lib/overlay/overlay-session.ts`

```typescript
export type OverlayCloseGuard = (reason: OverlayCloseReason, event?: Event) => boolean | void;

export interface OverlaySession {
  canClose(guard: OverlayCloseGuard): void;
}

// В overlay-stack.ts
const closeGuards: OverlayCloseGuard[] = [];

const requestClose = (handle, reason, event?) => {
  // ... проверить guards...
  for (const guard of closeGuards) {
    if (guard(reason, event) === false) {
      return;  // Не закрываем
    }
  }
  // ... закрыть...
};

overlay.canClose((reason, event) => {
  // reason: 'escape' | 'focusout' | 'outside-click' | 'backdrop' | 'blur' | 'programmatic'
  return true;  // или false для блокировки
});
```

**Использование:**

```typescript
createOverlay(isOpen, config, overlay => {
  overlay.canClose((reason, event) => {
    if (reason === 'escape' && this.hasUnsavedChanges()) {
      console.warn('Cannot close while form has unsaved changes');
      return false;  // Заблокировать закрытие
    }
    return true;
  });
});
```

---

### 5. ARIA Management — Система маркировки

#### До
- Ручная установка `data-dialog-panel`, `role="dialog"`, `aria-modal="true"`
- `aria-labelledby` требовали ручной ID
- Дублирование в разных компонентах

#### После
**Файл:** `projects/fibo-ui/cdk/src/lib/overlay/overlay-panel.ts`

```typescript
export const OVERLAY_PANEL = new InjectionToken<OverlayPanel>('OverlayPanel');

@Directive({
  selector: '[fiboOverlayPanel]',
  providers: [{ provide: OVERLAY_PANEL, useExisting: OverlayPanel }],
  host: {
    'data-dialog-panel': '',  // Для closeOnBackdropClick
    '[attr.role]': 'role()',
    '[attr.aria-modal]': 'modal() || null',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
  },
})
export class OverlayPanel {
  role = input<string>('dialog');
  modal = input(true);
  titleId = signal<string | null>(null);
  descriptionId = signal<string | null>(null);
}

@Directive({ selector: '[fiboOverlayTitle]' })
export class OverlayTitle {
  private handle = inject(OVERLAY_HANDLE);
  private panel = inject(OVERLAY_PANEL, { optional: true });
  id = `${this.handle.id}-title`;

  constructor() {
    this.panel?.titleId.set(this.id);
  }
}

@Directive({ selector: '[fiboOverlayDescription]' })
export class OverlayDescription {
  private handle = inject(OVERLAY_HANDLE);
  private panel = inject(OVERLAY_PANEL, { optional: true });
  id = `${this.handle.id}-desc`;

  constructor() {
    this.panel?.descriptionId.set(this.id);
  }
}
```

**Использование:**

```html
<div fiboOverlayPanel>
  <h2 fiboOverlayTitle>Delete File</h2>
  <p fiboOverlayDescription>Are you sure? This cannot be undone.</p>
  <!-- aria-labelledby и aria-describedby автоматически вычислены и установлены -->
</div>
```

**Миграция:**

| До | После |
|---|---|
| `data-dialog-panel role="dialog" aria-modal="true"` | `fiboOverlayPanel` |
| `id="modal-title"` + `aria-labelledby="modal-title"` | `fiboOverlayTitle` (auto-wired) |
| `id="modal-description"` | `fiboOverlayDescription` (auto-wired) |

---

## Отложенные решения

### `inert` на фоновом контенте

**Статус:** ⏳ Отложено (может быть добавлено в будущем)

**Причина:** Текущее решение с `trapOverlayFocus + blockScroll` покрывает основные a11y-требования. Атрибут `inert` был бы дополнением.

**Как добавить:**
```typescript
// В OverlayStack
effect(() => {
  const hasModals = this.overlays.some(o => o.category === 'dialog');
  const appRoot = document.querySelector('app-root');
  if (appRoot) {
    hasModals
      ? appRoot.setAttribute('inert', '')
      : appRoot.removeAttribute('inert');
  }
});
```

### Shadow DOM поддержка

**Статус:** ⏳ Отложено (низкий приоритет)

**Актуально:** Только если компоненты используются внутри Shadow DOM.

**Как добавить:** Использовать `_getFocusedElementPierceShadowDom()` подобно Angular CDK.

---

## Файлы, изменённые в реализации

### CDK

- ✅ `projects/fibo-ui/cdk/src/lib/overlay/overlay-behaviors.ts` — blockScroll + closeOnScroll + trapOverlayFocus
- ✅ `projects/fibo-ui/cdk/src/lib/overlay/overlay-session.ts` — canClose guard API
- ✅ `projects/fibo-ui/cdk/src/lib/overlay/overlay-stack.ts` — Centralized Escape + guards check
- ✅ `projects/fibo-ui/cdk/src/lib/overlay/overlay-handle.ts` — close(reason?) signature
- ✅ `projects/fibo-ui/cdk/src/lib/overlay/overlay-handle-internal.ts` — close impl
- ✅ `projects/fibo-ui/cdk/src/lib/overlay/overlay-panel.ts` — NEW ARIA directives
- ✅ `projects/fibo-ui/cdk/src/public-api.ts` — Export OverlayPanel, OverlayTitle, OverlayDescription (FocusTrap export removed)

### Components

- ✅ `projects/fibo-ui/components/src/lib/overlay/dialog/dialog.ts` — Use fiboOverlayPanel
- ✅ `projects/fibo-ui/components/src/lib/overlay/dialog/drawer.ts` — Use fiboOverlayPanel
- ✅ `projects/fibo-ui/components/src/lib/overlay/confirmation/confirmation-overlay-container.html` — Fixed HTML bug + fiboOverlayPanel + fiboOverlayTitle
- ✅ `projects/fibo-ui/components/src/lib/overlay/confirmation/confirmation-overlay-container.ts` — Import ARIA directives
- ✅ `projects/fibo-ui/components/src/lib/form-controls/fields/datepicker-field.ts` — Use fiboOverlayPanel [modal]="false" + trapOverlayFocus behavior

---

## Build Status

- ✅ CDK builds clean
- ✅ Components build clean
- ✅ No TypeScript errors in updated files

---

*Дата реализации: 2026-03-18*
*Последнее обновление: 2026-03-26 (migration to trapOverlayFocus)*
