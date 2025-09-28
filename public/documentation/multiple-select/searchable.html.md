```html
<fibo-multiple-select 
  [items]="filteredItems()" 
  [label]="'Users'" 
  [formControl]="usersCtrl">
  <input 
    type="text" 
    fiboMultipleSelectInput  
    [placeholder]="'Search users...'" 
    (valueChange)="onValueChange($event)">
</fibo-multiple-select>
```
