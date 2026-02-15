# Select

Select

## Basic Usage

<docs-example name="select-basic"></docs-example>

```html {example="select-basic"}
<button type="button" fiboFormFieldTrigger [formField]="userForm.role"
        class="w-full form-field-control flex items-center gap-2 text-left">
  <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
    <label class="form-field-label mt-1">User Role</label>
    @let role = user().role;
    <div class="text-sm" [class.from-field-placeholder]="!role">
      {{ role || 'Select Role' }}
    </div>
  </div>
  <lucide-icon name="chevron-down" size="16"
               class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>

  <div *fiboPortalContent="let trigger"
       fiboPopover [trigger]="trigger" [matchWidth]="true"
       fiboDataList (optionTriggered)="trigger.close()"
       fiboSelectOne [(value)]="userForm.role().value"
       class="popover-container">
    @for (role of userRoles; track role) {
      <a fiboOption [value]="role" class="datalist-item">
        <span class="block truncate font-normal">{{ role }}</span>
      </a>
    }
  </div>
</button>
```

```ts {example="select-basic"}
@Component({
  selector: 'select-basic-example',
  imports: [
    FormField, FormFieldTrigger, DataList,
    Popover, PortalContent, SelectOne,
    Option, LucideAngularModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class SelectBasicExample {
  readonly user = signal<UserModel>({ role: '' });
  readonly userForm = form(this.user);
  readonly userRoles = ['admin', 'user', 'guest'];
}
```

## API

