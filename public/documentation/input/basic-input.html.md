```html
<div class="space-y-4">
  <fibo-input
    [formControl]="inputCtrl"
    [placeholder]="'Enter your name'">
  </fibo-input>
  
  <div class="text-sm text-gray-600">
    Current value: {{ inputCtrl.value }}
  </div>
</div>
```
