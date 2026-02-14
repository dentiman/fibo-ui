import { Directive, inject } from '@angular/core';
import { Expandable, ExpandOnRoute, Option } from '@fibo-ui/cdk';

/**
 * Directive for collapsible submenu items in TreeMenu.
 *
 * Uses composable CDK directives:
 * - Expandable: Base expand/collapse state
 * - ExpandOnRoute: Auto-expand when child routes are active
 * - Option: Data list item behavior
 */
@Directive({
  selector: '[fiboCollapseSubmenuItem]',
  exportAs: 'fiboCollapseSubmenuItem',
  hostDirectives: [
    {
      directive: Option,
      inputs: ['disabled'],
    },
    Expandable,
    {
      directive: ExpandOnRoute,
      inputs: ['items'],
    },
  ],
})
export class CollapseSubmenuItem {
  expandable = inject(Expandable);

  // Expose for template binding compatibility
  expanded = this.expandable.expanded;
  toggle = this.expandable.toggle;
}
