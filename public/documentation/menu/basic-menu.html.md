```html
<button class="btn mr-1" fiboPopoverTriggerToggle #menu="PopoverTrigger">Open Basic Menu</button>
@if (menu.isOpen()) {
  <fibo-menu [popoverTrigger]="menu">
    <a fiboMenuItem class="datalist-item py-1 px-2 rounded-md relative group text-sm" [routerLink]="'/select'"> Select</a>
    <a fiboMenuItem class="datalist-item py-1 px-2 rounded-md relative group text-sm" [routerLink]="'/select-multiple'"> Select Multiple</a>
  </fibo-menu>
}
```


