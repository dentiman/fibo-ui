import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRegistry } from './portal-registry';

@Component({
  selector: 'fibo-portal-outlet',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './portal-outlet.component.html'
})
export class PortalOutletComponent {
  portalRegistry = inject(PortalRegistry);
}
