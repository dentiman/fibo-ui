```html
<div class="space-y-4">
  <fibo-checkbox [formControl]="checkboxCtrl">
    I agree to the terms and conditions
  </fibo-checkbox>
  
  <div class="text-sm text-gray-600">
    Current value: {{ checkboxCtrl.value }}
  </div>
</div>
```
