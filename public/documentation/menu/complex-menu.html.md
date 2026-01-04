```html
<button class="btn btn-primary" fiboPopoverTriggerToggle #menu3="PopoverTrigger">Open Complex Menu</button>
@if (menu3.isOpen()) {
  <fibo-menu [trigger]="menu3" placement="bottom-start" [items]="items">
  </fibo-menu>
}
```


