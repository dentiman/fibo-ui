import {Component, OnInit} from '@angular/core';
import {PopoverTrigger,  Popover} from '@fibo-ui/cdk';
import { FiboDialog,  DialogTrigger} from '@fibo-ui/components';
import {RouterLink} from '@angular/router';
import {SelectPageComponent} from '../select/select-page';
import {JsonPipe} from '@angular/common';
import {FormExamplePageComponent} from '../form-example-page/form-example-page';

@Component({
  imports: [
    DialogTrigger,
    FormExamplePageComponent
  ],
  templateUrl: './dialog-page.html',

})
export class DialogPageComponent {




}
