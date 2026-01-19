import { Component, computed, inject, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataList, Option, SELECTION_MODEL} from '@fibo-ui/cdk';
import {ActiveMonth} from './active-date.state';
import {parse} from 'date-fns';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'fibo-calendar',
  standalone: true,
  imports: [CommonModule, Option, LucideAngularModule],
  hostDirectives: [
    {
      directive: DataList,
      outputs: ['optionTriggered']
    }
  ],
  styles: `
    button[aria-selected="true"] {
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
    }
    button[aria-selected="true"] ~ button[aria-selected="true"] {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    button[aria-selected="true"]:not(:has(~ button[aria-selected="true"])) {
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }

  `,
  template: `
    <div class=" w-70 flex-none">
      <div class="border-b border-border-primary ">
        <div class="flex items-center text-center text-foreground-secondary space-x-2 p-1">
          <button type="button" (click)="state.setPreviousYear()"
                  class=" flex flex-none items-center justify-center btn btn-text   py-1 px-2  rounded-md">
            <span class="sr-only">Previous year</span>
            <lucide-icon name="chevrons-left" class="size-4"></lucide-icon>
          </button>
          <button type="button" (click)="state.setPreviousMonth()"
                  class=" flex flex-none items-center justify-center btn btn-text   py-1 px-2  rounded-md">
            <span class="sr-only">Previous month</span>
            <lucide-icon name="chevron-left" class="size-4"></lucide-icon>
          </button>

          <div class="flex-auto text-sm font-semibold py-1  whitespace-nowrap ">
            {{ state.monthName() }} {{ state.year() }}
          </div>

          <button type="button" (click)="state.setNextMonth()"
                  class=" flex flex-none items-center justify-center btn btn-text py-1 px-2 rounded-md">
            <span class="sr-only">Next month</span>
            <lucide-icon name="chevron-right" class="size-4"></lucide-icon>
          </button>
          <button type="button" (click)="state.setNextYear()"
                  class=" flex flex-none items-center justify-center btn btn-text py-1 px-2 rounded-md">
            <span class="sr-only">Next year</span>
            <lucide-icon name="chevrons-right" class="size-4"></lucide-icon>
          </button>
        </div>
        <div class=" grid grid-cols-7 text-center text-xs text-foreground-tertiary leading-6 px-1 ">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
      </div>

      <div class="mt-2 grid grid-cols-7 space-y-1 space-x-0 text-sm p-1 ">
        @for (week of state.weeks(); track $index) {
          @for (date of week; track date + $index) {
            <button fiboOption [value]="date" #option="Option"
                    class="datalist-item p-1 justify-center items-center"
                    [class.text-foreground-tertiary]="!state.hasTheSameMonthAs(date)"
            >
              {{ dayLabel(date) }}
            </button>
          }
        }
      </div>
    </div>
  `
})
export class Calendar {
  private readonly dateFormat = 'yyyy-MM-dd'
  minDate = input<string|null>(null)
  maxDate = input<string|null>(null)

  selectionModel = inject(SELECTION_MODEL,{self:true});

  state = new ActiveMonth(this.selectionModel.lastSelection);

  dayLabel(date: string) {
    return parse(date, this.dateFormat, new Date()).getDate();
  }
}
