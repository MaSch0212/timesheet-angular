import { Break } from './break.model';
import { List } from 'linqts';
import { Helpers } from '../common/helpers';

export class TimeSheetEntry {
    constructor(init?: Partial<TimeSheetEntry>) {
        Object.assign(this, init);
    }

    get workTime(): number {
        if (this.start != null && this.end != null) {
            const result =
                (this.end.getTime() - this.start.getTime()) / 1000 / 60 / 60;
            return result - this.breakTime;
        } else {
            return 0;
        }
    }

    get breakTime(): number {
        let result = 0;
        this.breaks.forEach(element => {
            result += element.duration;
        });
        return result;
    }

    id: number = 0;
    start: Date = null;
    end: Date = null;
    breaks: Array<Break> = new Array<Break>();
    targetHours: number = 0;

    static fromJSON(json: any): TimeSheetEntry {
        return new TimeSheetEntry({
            id: json.id,
            start: json.start ? new Date(json.start) : null,
            end: json.end ? new Date(json.end) : null,
            breaks: json.breaks
                ? json.breaks.map((x: any) => Break.fromJSON(x))
                : [],
            targetHours: json.targetHours
        });
    }

    setDate(date: string): void {
        const dt = new Date(Date.parse(date));
        this.setDateInternal(dt);
    }

    setStartTime(time: string): void {
        this.start = Helpers.setTimeFromString(this.start, time);
    }

    setEndTime(time: string): void {
        if (this.end == null) {
            this.end = Helpers.setDateFromDate(this.end, this.start);
        }
        this.end = Helpers.setTimeFromString(this.end, time);
    }

    ensureCorrectDates(): void {
        this.setDateInternal(this.start);
    }

    private setDateInternal(date: Date): void {
        this.start = Helpers.setDateFromDate(this.start, date);
        if (this.end) {
            this.end = Helpers.setDateFromDate(this.end, date);
        }
        this.breaks.forEach(element => element.setDate(date));
    }
}
