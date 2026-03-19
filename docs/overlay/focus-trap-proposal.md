# Предложение: Улучшение Focus Trap

Анализ текущей реализации `FocusTrap` в fibo-ui CDK, сравнение с подходами популярных библиотек и план улучшений.

---

## Текущая реализация

### Директива `FocusTrap` (`cdk/src/lib/a11y/focus-trap.ts`)

**Подход:** Перехват клавиши Tab + пересчёт фокусируемых элементов на каждое нажатие.

**Возможности:**
- `enabled` — включить/выключить ловушку
- `autoFocus` — автофокус на первый фокусируемый элемент при инициализации
- `restoreFocus` — восстановить фокус на предыдущий элемент при уничтожении
- Определение фокусируемых элементов через CSS-селектор (`a[href]`, `button`, `input`, `select`, `textarea`, `[tabindex]`)
- Фильтрация: исключаются `disabled`, `tabindex="-1"`, невидимые (`offsetParent === null`)

**Использование в компонентах:**
- `FiboDialog` — на обёртке контента (`div fiboFocusTrap`)
- `FiboDrawer` — на панели (`div fiboFocusTrap data-dialog-panel`)
- `ConfirmationOverlayContainer` — на карточке подтверждения
- `DatepickerField` — на выпадающем календаре

### Сильные стороны

- Простая, понятная реализация без внешних зависимостей
- Сигнал-ориентированные input'ы (`input()` вместо декораторов)
- Динамический пересчёт фокусируемых элементов на каждый Tab (обрабатывает динамический контент)
- `afterNextRender` для SSR-совместимости
- `preventScroll: true` при автофокусе

### Обнаруженные проблемы

#### 1. Фокус может уйти за пределы ловушки без Tab

Текущая реализация перехватывает только нажатие `Tab`. Но фокус может покинуть ловушку через:
- Клик мышью на элемент за пределами ловушки
- Программную установку фокуса (`element.focus()`)
- Скринридер может перемещать фокус виртуальным курсором

**Angular CDK** решает это через `EventListenerFocusTrapInertStrategy` — глобальный слушатель `focus` в фазе захвата на `document`, который возвращает фокус обратно в ловушку.

**Taiga-UI** решает через `(window:focusin)` — при фокусе вне ловушки находит ближайший фокусируемый элемент и переводит фокус.

#### 2. Нет поддержки вложенных ловушек

Когда диалог открывает другой диалог (подтверждение поверх формы), обе ловушки активны одновременно. Нет менеджера стека, который бы деактивировал внешнюю ловушку при открытии внутренней.

**Angular CDK** имеет `FocusTrapManager` — стек ловушек, где только верхняя активна:
```
register(trap) → отключить предыдущую → добавить в стек → включить новую
deregister(trap) → отключить → убрать из стека → включить предыдущую
```

#### 3. Нет `inert` на фоновом контенте

Когда модальный диалог открыт, фоновый контент остаётся интерактивным для скринридеров. WCAG требует, чтобы модальные диалоги делали фоновый контент инертным.

**Angular CDK** использует `EventListenerFocusTrapInertStrategy` — перехват фокуса вне ловушки через глобальный слушатель.

Современный подход — атрибут `inert` на фоновых элементах (поддержка браузеров > 95%).

#### 4. Нет маркера начального фокуса

Первый фокусируемый элемент не всегда лучший выбор. Например, в форме подтверждения удаления лучше сфокусировать кнопку «Отмена», а не «Удалить».

**Angular CDK** имеет атрибут `[cdkFocusInitial]` для указания конкретного элемента.

#### 5. Нет Shadow DOM поддержки

`document.activeElement` не пронизывает Shadow DOM. Если компоненты используются внутри Shadow DOM, определение активного элемента будет некорректным.

**Angular CDK** использует `_getFocusedElementPierceShadowDom()`.
**Taiga-UI** использует `tuiGetFocused()` с обходом `shadowRoot.activeElement`.

#### 6. Восстановление фокуса дублируется с overlay-системой

`FocusTrap` восстанавливает фокус в `ngOnDestroy`, а `restoreTriggerFocusOnClose` в overlay-behaviors тоже восстанавливает фокус. При использовании вместе может быть двойное восстановление или конфликт.

---

## Подходы популярных библиотек

### Angular CDK — Sentinel-подход

```
[start-anchor tabindex=0] → [trap-element] → [end-anchor tabindex=0]
       ↓ onFocus                                    ↓ onFocus
   focusLast()                                  focusFirst()
```

**Принцип:** Два невидимых элемента-якоря (`div.cdk-visually-hidden`) размещаются до и после контента ловушки. При получении фокуса якорем — фокус перенаправляется на последний/первый элемент внутри ловушки.

**Компоненты:**
- `FocusTrap` — базовый класс с логикой якорей
- `ConfigurableFocusTrap` — расширение с inert-стратегией
- `FocusTrapManager` — стек для вложенных ловушек
- `EventListenerFocusTrapInertStrategy` — глобальный `focus`-слушатель для предотвращения выхода фокуса
- `InteractivityChecker` — определение фокусируемости элементов
- `CdkTrapFocus` — директива для пользователей

**Начальный фокус:**
1. Элемент с атрибутом `[cdkFocusInitial]`
2. Если не фокусируемый — первый фокусируемый потомок
3. Иначе — первый tabbable-элемент

**Особенности:**
- `runOutsideAngular()` для слушателей
- `DoCheck` для переприкрепления якорей при динамическом контенте
- Исключение overlay-панелей CDK из перехвата (`div.cdk-overlay-pane`)
- Пронизывание Shadow DOM

### Taiga-UI — Element-подход

```
[trap-element tabindex=0]
     ↓ window:focusin
  onFocusIn(target) → если target вне ловушки → focusFirst()
```

**Принцип:** Элемент ловушки получает `tabindex="0"` и сам становится фокусируемым. Глобальный слушатель `focusin` на `window` перехватывает фокус за пределами ловушки.

**Компоненты:**
- `TuiFocusTrap` — единственная директива
- `tuiGetClosestFocusable()` — поиск через `TreeWalker`
- `tuiIsFocusable()` — проверка фокусируемости
- `tuiGetFocused()` — пронизывание Shadow DOM
- `TuiAutoFocus` — отдельная директива автофокуса с задержкой и конфигурацией

**Начальный фокус:**
1. Сам элемент ловушки (через `this.el.focus()`)
2. Первый фокусируемый потомок через `TreeWalker`

**Особенности:**
- `(window:focusin.zoneless)` — вне зоны Angular
- Микрозадержка (`Promise.resolve()`) для предотвращения `ExpressionChanged`
- Удаление `tabindex` при `pointerdown` чтобы Tab не попадал на элемент ловушки
- Фильтрация SVG-элементов через `svgNodeFilter`

### Fibo-UI — Tab-handler-подход (текущий)

```
[trap-element]
     ↓ keydown (Tab / Shift+Tab)
  getTabbableElements() → вычислить обёртку → preventDefault + focus
```

**Принцип:** Перехват клавиши Tab, вычисление первого/последнего фокусируемого, циклическая навигация.

**Минимален и эффективен**, но не перехватывает другие способы перемещения фокуса.

---

## Сравнительная таблица

| Аспект | Angular CDK | Taiga-UI | fibo-ui (текущий) |
|---|---|---|---|
| **Механизм** | Якоря-сентинели + глобальный focus | `tabindex=0` + window:focusin | Перехват Tab |
| **Предотвращение выхода фокуса** | Глобальный focus-слушатель | Глобальный focusin-слушатель | Только Tab |
| **Вложенные ловушки** | `FocusTrapManager` (стек) | Порядок микрозадач | Нет |
| **Начальный фокус** | `[cdkFocusInitial]` / первый | Сам элемент / первый | Первый / сам элемент |
| **Восстановление фокуса** | `autoCapture` + `ngOnDestroy` | Constructor + `ngOnDestroy` | `afterNextRender` + `ngOnDestroy` |
| **Shadow DOM** | Да | Да | Нет |
| **Мутация DOM** | 2 якоря | Атрибут tabindex | Нет |
| **Размер кода** | Большой (~5 файлов) | Средний (~3 файла) | Маленький (1 файл) |
| **Производительность** | Средняя | Низкая нагрузка | Минимальная |

---

## Предложение по улучшению

### Вариант A: Минимальное улучшение (рекомендуется)

Сохранить текущий подход Tab-handler, но добавить критически важные возможности.

#### A1. Глобальный focusin-слушатель

Добавить глобальный `focusin`-слушатель (как в Taiga-UI) для предотвращения выхода фокуса кликом мыши или программно:

```typescript
// В FocusTrap:
private focusinListener = (event: FocusEvent) => {
  if (!this.enabled()) return;
  const target = event.target as HTMLElement;
  if (!this.elementRef.nativeElement.contains(target)) {
    const focusable = getTabbableElements(this.elementRef.nativeElement);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }
};

constructor() {
  afterNextRender(() => {
    document.addEventListener('focusin', this.focusinListener, true);
    // ... существующая логика автофокуса
  });
}

ngOnDestroy(): void {
  document.removeEventListener('focusin', this.focusinListener, true);
  // ... существующая логика восстановления
}
```

#### A2. Маркер начального фокуса

Добавить поддержку атрибута `[fiboFocusInitial]`:

```typescript
constructor() {
  afterNextRender(() => {
    if (this.autoFocus()) {
      this.previouslyFocused = document.activeElement as HTMLElement;
      const initial = this.elementRef.nativeElement.querySelector<HTMLElement>('[fiboFocusInitial]');
      if (initial) {
        initial.focus({ preventScroll: true });
      } else {
        const focusable = getTabbableElements(this.elementRef.nativeElement);
        focusable.length > 0
          ? focusable[0].focus({ preventScroll: true })
          : this.elementRef.nativeElement.focus({ preventScroll: true });
      }
    }
  });
}
```

#### A3. Интеграция с overlay-системой через `inert`

Добавить управление атрибутом `inert` в `OverlayContainerComponent` или `OverlayStack` для модальных категорий:

```typescript
// В overlay-container.ts или overlay-stack.ts:
private manageInert = effect(() => {
  const hasModals = this.overlayStack.hasOpenDialogs();
  const appRoot = document.querySelector('app-root'); // или configurable selector
  if (appRoot) {
    hasModals
      ? appRoot.setAttribute('inert', '')
      : appRoot.removeAttribute('inert');
  }
});
```

Это системно решает проблему доступности фона без дублирования логики в FocusTrap.

#### A4. Координация восстановления фокуса

Отключить `restoreFocus` по умолчанию в `FocusTrap` для overlay-контекста, чтобы `restoreTriggerFocusOnClose` из overlay-behaviors управлял восстановлением единолично:

```html
<!-- В dialog.ts / drawer.ts -->
<div fiboFocusTrap [restoreFocus]="false">
```

Overlay-система уже имеет `restoreTriggerFocusOnClose`, который знает контекст (какой элемент-триггер, какая ветка оверлеев). FocusTrap не должен конкурировать.

---

### Вариант B: Менеджер стека (для вложенных модалов)

Если вложенные диалоги — частый сценарий, добавить `FocusTrapStack`:

```typescript
@Injectable({ providedIn: 'root' })
export class FocusTrapStack {
  private stack = signal<FocusTrap[]>([]);

  register(trap: FocusTrap): void {
    this.stack.update(s => {
      const prev = s[s.length - 1];
      if (prev) prev.enabled = false; // деактивировать предыдущую
      return [...s, trap];
    });
  }

  deregister(trap: FocusTrap): void {
    this.stack.update(s => {
      const filtered = s.filter(t => t !== trap);
      const top = filtered[filtered.length - 1];
      if (top) top.enabled = true; // реактивировать верхнюю
      return filtered;
    });
  }
}
```

Это паттерн Angular CDK `FocusTrapManager`, но через сигналы.

---

### Вариант C: Полная переработка (не рекомендуется)

Переход на sentinel-подход как в Angular CDK. **Не рекомендуется** — это значительная сложность при минимальном выигрыше. Tab-handler + focusin-слушатель покрывает 99% сценариев.

---

## Приоритеты реализации

| Изменение | Приоритет | Сложность | Влияние |
|---|---|---|---|
| A1. Глобальный focusin-слушатель | Высокий | Низкая | Закрывает основную a11y-проблему |
| A3. `inert` через overlay-систему | Высокий | Низкая | Системное решение доступности фона |
| A4. Координация восстановления фокуса | Высокий | Минимальная | Устраняет конфликт двух систем |
| A2. `[fiboFocusInitial]` маркер | Средний | Низкая | UX-улучшение для confirmation-диалогов |
| B. FocusTrapStack | Средний | Средняя | Нужен только при вложенных модалах |
| Shadow DOM поддержка | Низкий | Низкая | Актуально только при использовании Shadow DOM |

---

## Итог

Текущая реализация FocusTrap в fibo-ui — **чистая и минималистичная**. Она следует философии проекта: простота, сигналы, минимум DOM-мутаций. Основные пробелы — это **перехват фокуса вне Tab** и **координация с overlay-системой**. Рекомендуется **Вариант A** (минимальные улучшения), который закрывает критические a11y-проблемы без переусложнения архитектуры.

---

*Дата анализа: 2026-03-18*
*Сравнивались: Angular CDK, Taiga-UI, Spartan/Brain*
