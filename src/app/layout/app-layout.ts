import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RootNavComponent } from './root-nav';
import { ThemeToggleComponent } from '../common/theme-toggle';
import { TableOfContents } from './table-of-contents';
import { TocService } from '../common/toc.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RootNavComponent, ThemeToggleComponent, NgOptimizedImage, TableOfContents],
  templateUrl: './app-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {
  readonly tocService = inject(TocService);
}
