```html
<div class="grid grid-cols-2 gap-8">
  <!-- Column 1: Default style -->
  <div class="space-y-6">
    <fibo-multiple-select [items]="items" label="Floating Label"></fibo-multiple-select>
    <fibo-multiple-select [items]="items" fixedLabel="Fixed Label" placeholder="Select options"></fibo-multiple-select>
    <fibo-multiple-select [items]="items" label="Disabled Multiple Select" placeholder="This is disabled" [disabled]="true"></fibo-multiple-select>
    <fibo-multiple-select [items]="items" label="Multiple Select with Error" placeholder="Required field"></fibo-multiple-select>
  </div>

  <!-- Column 2: Card style -->
  <div class="fibo-card p-6 space-y-6">
    <fibo-multiple-select [items]="items" label="Floating Label" [appearance]="'secondary'"></fibo-multiple-select>
    <fibo-multiple-select [items]="items" fixedLabel="Fixed Label" placeholder="Select options" [appearance]="'secondary'"></fibo-multiple-select>
    <fibo-multiple-select [items]="items" label="Disabled Multiple Select" placeholder="This is disabled" [disabled]="true" [appearance]="'secondary'"></fibo-multiple-select>
    <fibo-multiple-select [items]="items" label="Multiple Select with Error" placeholder="Required field" [appearance]="'secondary'"></fibo-multiple-select>
  </div>
</div>
```


