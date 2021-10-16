import { TimeSheetEntry } from './time-sheet-entry.model';

export interface ITimeSheetEntryGroup {
    date: Date;
    entries: Array<TimeSheetEntry>;
}
