связку Option + SelectionModel + DataList мы внедрили 
теперь нужно подумать как сделать Поведенческие директивы (composition) которые ты прелагал как отдельный слой в CDK

cdk/menu/
├── dropdown-trigger.ts     — оборачивает PopoverTrigger для menu-контекста
├── submenu-trigger.ts      — рекурсивное подменю (popover)
├── collapse-trigger.ts     — expand/collapse для tree-nodes

Эти директивы composable через hostDirectives и определяют как открываются подменю:
- DropdownTrigger = PopoverTrigger + MenuGroup (как есть)
- CollapseTrigger = MenuItem + expanded state (как CollapseSubmenuItem)
- SubmenuTrigger = MenuItem + PopoverTrigger + вложенный MenuGroup

а также общий MenuGroup с   expanded = model(true) чтобы забрать логику из SideMenuGroup (компонента)

 и CollapseSubmenuItem 
