# Overlay TODO

Актуально на 2026-03-29.

## P1

- Добавить role-модель для `DataList`/`DataListItem`:
  - корректные `role` для сценариев listbox/menu;
  - согласовать с текущей клавиатурной навигацией.

- Задокументировать `animate.enter` / `animate.leave` host binding паттерн:
  - кто читает эти атрибуты;
  - как работает переход leave → `completeAfterClose`.

## P2

- Добавить тесты для overlay-критичных сценариев:
  - `OverlayStack` (`createOverlay`, `closeTopmost`, `closeAllByTag`);
  - keyboard dismiss (`Escape`) в `OverlayStackOutlet`.

- Рассмотреть `createSingletonOverlay()` utility для сокращения boilerplate
  в `ConfirmationService`, `TooltipService`, `Notifier`.
