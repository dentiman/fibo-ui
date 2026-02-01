```html
<form class="space-y-4">
  <div fiboFormField class="form-field-control flex items-center gap-2">
    <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
      <label class="form-field-label mt-1">Username</label>
      <input [formField]="userForm.username" type="text" placeholder="Enter username" class="text-field-input" />
    </div>
  </div>
</form>
```
