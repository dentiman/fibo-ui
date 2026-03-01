# Overlay TODO (Best Practices, осталось сделать)

Актуально на 2026-03-01.

## P1

- Обновить `projects/fibo-ui/components/README.md` под текущий API overlay:
  - убрать устаревшие примеры с `fiboPortalContent`;
  - оставить только текущий flow через `[content]` и единый `<fibo-overlay-outlet />`.

- Сделать `scroll-lock` в `projects/fibo-ui/cdk/src/lib/portal/overlay-outlet.ts` через отдельный lock-manager:
  - хранить и восстанавливать предыдущее значение `overflow`;
  - сделать stack-safe механику;
  - добавить SSR-safe guard.



## P2



- Добавить role-модель для `DataList`/`DataListItem`:
  - корректные `role` для сценариев listbox/menu;
  - согласовать с текущей клавиатурной навигацией.

- Добавить тесты для overlay-критичных сценариев:
  - `OverlayRegistry` (`register/unregister/closeTopmost/closeAllByCategory`);
  - `Notifier` timer cleanup и manual close;
  - keyboard dismiss (`Escape`) в `OverlayOutlet`.

