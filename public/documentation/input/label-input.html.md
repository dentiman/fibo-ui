```html
<div class="grid grid-cols-2 gap-8">
  <!-- Column 1: Default style -->
  <div class="space-y-6">
    <fibo-input
      [formControl]="floatingLabelCtrl"
      [label]="'Floating Label'"
      [placeholder]="'Enter your email'">
    </fibo-input>
    
    <fibo-input
      [formControl]="fixedLabelCtrl"
      [label]="'Fixed Label'"
      [placeholder]="'Enter your phone'"
      [fixedLabel]="true">
    </fibo-input>
    
    <fibo-input
      [formControl]="disabledCtrl"
      [label]="'Disabled Input'"
      [placeholder]="'This is disabled'"
      [disabled]="true">
    </fibo-input>
    
    <fibo-input
      [formControl]="errorCtrl"
      [label]="'Input with Error'"
      [placeholder]="'Enter required field'">
    </fibo-input>
  </div>
  
  <!-- Column 2: Card style -->
  <div class="fibo-card p-6 space-y-6">
    <fibo-input
      [formControl]="floatingLabelCtrl2"
      [label]="'Floating Label'"
      [placeholder]="'Enter your email'">
    </fibo-input>
    
    <fibo-input
      [formControl]="fixedLabelCtrl2"
      [label]="'Fixed Label'"
      [placeholder]="'Enter your phone'"
      [fixedLabel]="true">
    </fibo-input>
    
    <fibo-input
      [formControl]="disabledCtrl2"
      [label]="'Disabled Input'"
      [placeholder]="'This is disabled'"
      [disabled]="true">
    </fibo-input>
    
    <fibo-input
      [formControl]="errorCtrl2"
      [label]="'Input with Error'"
      [placeholder]="'Enter required field'">
    </fibo-input>
  </div>
</div>
```
