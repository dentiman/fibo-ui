import {Component} from '@angular/core';
import {DialogTrigger} from '@fibo-ui/components';
import {FormExamplePageComponent} from '../form-example-page/form-example-page';

@Component({
  imports: [
    DialogTrigger,
    FormExamplePageComponent
  ],
  templateUrl: './dialog-page.html',
})
export class DialogPageComponent {}
