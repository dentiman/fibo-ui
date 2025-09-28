```html
<fibo-multiple-select
  [items]="users"
  [formControl]="usersCtrl"
  [label]="'Select Users'"
  [placeholder]="'Choose users'"
  [valueProp]="'id'"
  [labelProp]="'name'"
  [itemTemplate]="userTemplate"
  [selectedItemTemplate]="selectedUserTemplate">
</fibo-multiple-select>

<ng-template #userTemplate let-user let-isSelected="isSelected">
  <div class="flex items-center gap-3">
    <img
      [src]="user.avatar"
      [alt]="user.name"
      class="w-8 h-8 rounded-full object-cover"
    />
    <div class="flex flex-col min-w-0">
      <span class="text-sm font-medium truncate"
            [class.text-white]="isSelected"
            [class.text-gray-900]="!isSelected"
            [class.dark:text-gray-100]="!isSelected">{{ user.name }}</span>
      <span class="text-xs truncate"
            [class.text-primary-50]="isSelected"
            [class.text-gray-500]="!isSelected"
            [class.dark:text-gray-400]="!isSelected">
        {{ user.email }}
      </span>
    </div>
  </div>
</ng-template>

<ng-template #selectedUserTemplate let-user>
  <div class="flex items-center gap-1">
    <img
      [src]="user.avatar"
      [alt]="user.name"
      class="size-5 rounded-full object-cover"
    />
    <span class="text-xs font-medium text-foreground">{{ user.name }}</span>
  </div>
</ng-template>
```
