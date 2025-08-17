import { computed, Signal, signal, WritableSignal, effect, linkedSignal } from "@angular/core";
import { parse, isValid, isEqual, format, addMonths, subMonths, addYears, subYears, getYear, getMonth, startOfMonth, endOfMonth, startOfWeek, addDays } from "date-fns";

export class ActiveMonth {
    private readonly dateFormat = 'yyyy-MM-dd';

    constructor(private _changes: Signal<string|null>) {}

    year = linkedSignal(() => {
        const changes = this._changes();
        if (!changes) return getYear(new Date());

        const parsedDate = parse(changes, this.dateFormat, new Date());
        return isValid(parsedDate) ? getYear(parsedDate) : getYear(new Date());
    });

    month = linkedSignal(() => {
        const changes = this._changes();
        if (!changes) return getMonth(new Date()) + 1;

        const parsedDate = parse(changes, this.dateFormat, new Date());
        return isValid(parsedDate) ? getMonth(parsedDate) + 1 : getMonth(new Date()) + 1;
    });

    monthName = computed(() => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = this.month() - 1;
        return monthNames[monthIndex];
    });

    weeks: Signal<string[][]> = computed(() => {
        const year = this.year();
        const month = this.month();
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = endOfMonth(firstDayOfMonth);

        const weeks: string[][] = [];
        let currentWeek: string[] = [];

        const currentDate = startOfWeek(firstDayOfMonth);

        while (currentDate <= lastDayOfMonth || currentDate.getDay() !== 0) {
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }

            currentWeek.push(format(currentDate, this.dateFormat));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return weeks;
    });

    setFromDate(date: string): void {
        if (typeof date === 'string' && isValid(parse(date, this.dateFormat, new Date()))) {
            const parsedDate = parse(date, this.dateFormat, new Date());
            this.year.set(getYear(parsedDate));
            this.month.set(getMonth(parsedDate) + 1);
        }
    }

    setMonth(month: number): void {
        this.month.set(month);
    }

    setNextMonth(): void {
        const currentMonth = this.month();
        const currentYear = this.year();
        const newDate = addMonths(new Date(currentYear, currentMonth - 1, 1), 1);
        this.year.set(getYear(newDate));
        this.month.set(getMonth(newDate) + 1);
    }

    setPreviousMonth(): void {
        const currentMonth = this.month();
        const currentYear = this.year();
        const newDate = subMonths(new Date(currentYear, currentMonth - 1, 1), 1);
        this.year.set(getYear(newDate));
        this.month.set(getMonth(newDate) + 1);
    }

    setYear(fullYear: number): void {
        this.year.set(fullYear);
    }

    setNextYear(): void {
        const currentMonth = this.month();
        const currentYear = this.year();
        const newDate = addYears(new Date(currentYear, currentMonth - 1, 1), 1);
        this.year.set(getYear(newDate));
        this.month.set(getMonth(newDate) + 1);
    }

    setPreviousYear(): void {
        const currentMonth = this.month();
        const currentYear = this.year();
        const newDate = subYears(new Date(currentYear, currentMonth - 1, 1), 1);
        this.year.set(getYear(newDate));
        this.month.set(getMonth(newDate) + 1);
    }

    hasTheSameMonthAs(date: string): boolean {
        const compareDate = parse(date, this.dateFormat, new Date());
        return this.month() === getMonth(compareDate) + 1 && this.year() === getYear(compareDate);
    }
}

