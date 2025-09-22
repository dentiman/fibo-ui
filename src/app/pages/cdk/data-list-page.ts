import {Component, ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-cdk-data-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>CDK: Data List</h1>
      <p>В разработке.</p>
    </div>
  `,
})
export class CdkDataListPageComponent {}


