import { inject, Injectable, InjectionToken } from '@angular/core';
import { format, isAfter, isBefore, isEqual, parse } from 'date-fns';

export interface DateAdapter {
  parse(value: string, dateFormat: string, referenceDate: Date): Date;
  format(date: Date, dateFormat: string): string;
  isEqual(left: Date, right: Date): boolean;
  isAfter(left: Date, right: Date): boolean;
  isBefore(left: Date, right: Date): boolean;
  now(): Date;
}

@Injectable({ providedIn: 'root' })
export class DateFnsDateAdapter implements DateAdapter {
  parse(value: string, dateFormat: string, referenceDate: Date): Date {
    return parse(value, dateFormat, referenceDate);
  }

  format(date: Date, dateFormat: string): string {
    return format(date, dateFormat);
  }

  isEqual(left: Date, right: Date): boolean {
    return isEqual(left, right);
  }

  isAfter(left: Date, right: Date): boolean {
    return isAfter(left, right);
  }

  isBefore(left: Date, right: Date): boolean {
    return isBefore(left, right);
  }

  now(): Date {
    return new Date();
  }
}

export const DATE_ADAPTER = new InjectionToken<DateAdapter>('DATE_ADAPTER', {
  providedIn: 'root',
  factory: () => inject(DateFnsDateAdapter),
});
