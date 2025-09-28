import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShikiHighlighterService } from '../../common/shiki-highlighter.service';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

  `,

})
export class PlaygroundPageComponent {
}
