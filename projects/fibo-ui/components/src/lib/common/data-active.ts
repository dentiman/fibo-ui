import {Directive, input, model} from '@angular/core';
import {outputFromObservable, toObservable} from "@angular/core/rxjs-interop";
import {filter} from "rxjs";

@Directive({
  selector: '[suiDataActive],[suiDataActiveModel]',
  exportAs: 'DataActive',
  standalone: true,
  host: {
    '[attr.data-active]': 'active() || null',
  }
})
export class DataActive {
  active = model(false,{alias: 'suiDataActive'});
  toggle = () => this.active.set(!this.active());

  activate = () => this.active.set(true);

  activeChange = outputFromObservable(toObservable(this.active).pipe(filter(active => active )));
}
