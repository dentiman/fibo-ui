```html
<button type="button" fiboFormFieldTrigger [field]="userForm.skills" class="w-full group fibo-form-field px-3 py-1 relative block text-left">
  <label class="block text-xs fibo-form-field-label">Skills</label>
  <span class="w-full flex flex-wrap gap-x-1 gap-y-1">
    @for (value of user().skills; track value) {
      <div class="flex items-center gap-1 btn btn-sm">
        <span class="truncate flex-1 text-xs font-medium">{{ value }}</span>
        <button type="button"
          class="rounded-full cursor-pointer flex-shrink-0 btn-text"
          (click)="removeSkill(value); $event.stopPropagation()"
          (keydown)="$event.stopPropagation()">
          <lucide-icon name="x" size="14"></lucide-icon>
        </button>
      </div>
    }
    @if (user().skills.length === 0) {
      <div class="from-field-placeholder text-sm">Select Skills</div>
    }
  </span>
  <div *fiboPortalContent="let trigger"
       fiboPopover [trigger]="trigger" [matchWidth]="true"
       fiboDataList (optionTriggered)="trigger.close()"
       fiboSelectMulti [(value)]="userForm.skills().value"
       class="fibo-popover py-1 px-1 rounded-md">
    <div class="max-h-70 overflow-y-auto">
      @if (skills.length === 0) {
        <div class="w-full text-gray-400 text-sm px-3 py-2">No items found</div>
      }
      @for (skill of skills; track skill) {
        <a fiboOption [value]="skill" #option="Option"
           class="datalist-item py-1 px-2 rounded-md relative group text-sm items-center">
          <fibo-checkbox
            [checked]="option.isSelected()">{{ skill }}
          </fibo-checkbox>
        </a>
      }
    </div>
  </div>
  <div class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2">
    <lucide-icon name="chevron-down" size="16" class="text-foreground-tertiary"></lucide-icon>
  </div>
</button>
```
