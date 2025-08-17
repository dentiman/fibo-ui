import {Directive, input, model} from '@angular/core';
import {outputFromObservable, toObservable} from "@angular/core/rxjs-interop";
import {filter} from "rxjs";

@Directive({
  selector: '[fiboDataActive],[fiboDataActiveModel]',
  exportAs: 'DataActive',
  standalone: true,
  host: {
    '[attr.data-active]': 'active() || null',
  }
})
export class DataActive {
  active = model(false,{alias: 'fiboDataActive'});
  toggle = () => this.active.set(!this.active());

  activate = () => this.active.set(true);

  activeChange = outputFromObservable(toObservable(this.active).pipe(filter(active => active )));
}
