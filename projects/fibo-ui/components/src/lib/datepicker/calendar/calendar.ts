import { Component, computed, inject, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataList, Option, SELECTION_MODEL} from '@fibo-ui/cdk';
import {ActiveMonth} from './active-date.state';
import {parse} from 'date-fns';

@Component({
  selector: 'fibo-calendar',
  standalone: true,
  imports: [CommonModule,Option],
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
    <div class="max-w-xs flex-none">
      <div class="bg-radial-[at_50%_90%] from-white via-white to-gray-50 to-70% border-b border-gray-100 ">
        <div class="flex items-center text-center text-gray-900 space-x-2 p-1">
          <button type="button" (click)="state.setPreviousYear()"
                  class=" flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 py-2 px-2 hover:bg-gray-100 rounded-md">
            <span class="sr-only">Previous month</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"/>
            </svg>
          </button>
          <button type="button" (click)="state.setPreviousMonth()"
                  class=" flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 py-2 px-2 hover:bg-gray-100 rounded-md">
            <span class="sr-only">Previous month</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clip-rule="evenodd"/>
            </svg>
          </button>

          <div class="flex-auto text-sm font-semibold py-2 px-2 ">
            {{ state.monthName() }} {{ state.year() }}
          </div>

          <button type="button" (click)="state.setNextMonth()"
                  class=" flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 py-2 px-2 hover:bg-gray-100 rounded-md">
            <span class="sr-only">Next month</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd"/>
            </svg>
          </button>
          <button type="button" (click)="state.setNextYear()"
                  class=" flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 py-2 px-2 hover:bg-gray-100 rounded-md">
            <span class="sr-only">Next month</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"/>
            </svg>
          </button>
        </div>
        <div class=" grid grid-cols-7 text-center text-xs leading-6 text-gray-500 px-1 ">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
      </div>


      <div class="isolate mt-2 grid grid-cols-7 space-y-1  text-sm p-1 ">
        @for (week of state.weeks(); track $index) {
          @for (date of week; track date + $index) {
            <button [Option]="date"
                    class="calendar-cell"
                    [class.text-gray-300]="!state.hasTheSameMonthAs(date)"
                    [class.text-gray-600]="state.hasTheSameMonthAs(date)"
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
