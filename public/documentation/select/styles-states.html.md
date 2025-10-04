```html
<div class="grid grid-cols-2 gap-8">
  <!-- Column 1: Default style -->
  <div class="space-y-6">
    <fibo-select [items]="items" label="Floating Label"></fibo-select>
    <fibo-select [items]="items" fixedLabel="Fixed Label" placeholder="Select option"></fibo-select>
    <fibo-select [items]="items" label="Disabled Select" placeholder="This is disabled" [disabled]="true"></fibo-select>
    <fibo-select [items]="items" label="Select with Error" placeholder="Required field"></fibo-select>
  </div>

  <!-- Column 2: Card style -->
  <div class="fibo-card p-6 space-y-6">
    <fibo-select [items]="items" label="Floating Label" [appearance]="'secondary'"></fibo-select>
    <fibo-select [items]="items" fixedLabel="Fixed Label" placeholder="Select option" [appearance]="'secondary'"></fibo-select>
    <fibo-select [items]="items" label="Disabled Select" placeholder="This is disabled" [disabled]="true" [appearance]="'secondary'"></fibo-select>
    <fibo-select [items]="items" label="Select with Error" placeholder="Required field" [appearance]="'secondary'"></fibo-select>
  </div>
</div>
```
