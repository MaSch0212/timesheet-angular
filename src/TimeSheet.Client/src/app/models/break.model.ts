import { Helpers } from '../common/helpers';

export class Break {
    constructor(init?: Partial<Break>) {
        Object.assign(this, init);
    }

    get duration(): number {
        if (this.start != null && this.end != null) {
            return (this.end.getTime() - this.start.getTime()) / 1000 / 60 / 60;
        } else {
            return 0;
        }
    }

    id: number = 0;
    start: Date = null;
    end: Date = null;

    static fromJSON(json: any): Break {
        return new Break({
            id: json.id,
            start: json.start ? new Date(json.start) : null,
            end: json.end ? new Date(json.end) : null
        });
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

    setDate(date: Date): void {
        this.start = Helpers.setDateFromDate(this.start, date);
        if (this.end) {
            this.end = Helpers.setDateFromDate(this.end, date);
        }
    }
}
