import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimeSheetEntry } from '../../../models/time-sheet-entry.model';
import {
    NgForm,
    UntypedFormGroup,
    UntypedFormControl,
    Validators,
    UntypedFormArray
} from '@angular/forms';
import { Helpers } from '../../../common/helpers';
import { Break } from '../../../models/break.model';

@Component({
    selector: 'masch-time-sheet-entry-form',
    templateUrl: './time-sheet-entry-form.component.html',
    styleUrls: ['./time-sheet-entry-form.component.scss']
})
export class TimeSheetEntryFormComponent implements OnInit {
    private _entry: TimeSheetEntry;

    @Output() save = new EventEmitter<TimeSheetEntry>();
    @Output() delete = new EventEmitter();

    @Input()
    get entry(): TimeSheetEntry {
        return this._entry;
    }
    set entry(value: TimeSheetEntry) {
        this._entry = value;
        this.createForm(this._entry);
    }

    entryForm: UntypedFormGroup;
    errorMessage: string;

    constructor() {}

    ngOnInit() {
        this.createForm(this.entry);
    }

    onSubmit() {
        const entry = this.getCurrentEntry();
        if (entry) {
            this.entry = entry;
            this.save.emit(entry);
        }
    }

    onDelete() {
        this.delete.emit();
    }

    getBreakControls() {
        return (<UntypedFormArray>this.entryForm.get('breaks')).controls;
    }

    onRemoveBreak(index: number) {
        (<UntypedFormArray>this.entryForm.get('breaks')).removeAt(index);
    }

    onAddBreak() {
        (<UntypedFormArray>this.entryForm.get('breaks')).push(
            this.createBreakGroup(null)
        );
    }

    getCurrentEntry(): TimeSheetEntry {
        if (this.entryForm.invalid) {
            this.errorMessage =
                'Not all fields have been filled in correctly yet.';
            return null;
        }

        const date = new Date(this.entryForm.value.date);
        return new TimeSheetEntry({
            id: this.entryForm.value.id,
            start: Helpers.setTimeFromString(date, this.entryForm.value.start),
            end: this.entryForm.value.end
                ? Helpers.setTimeFromString(date, this.entryForm.value.end)
                : null,
            breaks: this.entryForm.value.breaks.map(
                b =>
                    new Break({
                        id: b.id,
                        start: Helpers.setTimeFromString(date, b.start),
                        end: b.end
                            ? Helpers.setTimeFromString(date, b.end)
                            : null
                    })
            ),
            targetHours: this.entryForm.value.targetHours
        });
    }

    reset() {
        this.createForm(this.entry);
    }

    private createForm(entry: TimeSheetEntry) {
        const breaks = new UntypedFormArray([]);
        if (entry) {
            entry.breaks.forEach(b => {
                breaks.push(this.createBreakGroup(b));
            });
        }

        this.entryForm = new UntypedFormGroup({
            id: new UntypedFormControl(entry ? entry.id : 0),
            date: new UntypedFormControl(
                entry ? Helpers.getDateString(entry.start) : null,
                Validators.required
            ),
            start: new UntypedFormControl(
                entry ? Helpers.getTimeString(entry.start) : null,
                Validators.required
            ),
            end: new UntypedFormControl(
                entry && entry.end ? Helpers.getTimeString(entry.end) : null
            ),
            breaks: breaks,
            targetHours: new UntypedFormControl(
                entry ? entry.targetHours : null,
                Validators.required
            )
        });
    }

    private createBreakGroup(b: Break): UntypedFormGroup {
        return new UntypedFormGroup({
            id: new UntypedFormControl(b ? b.id : 0),
            start: new UntypedFormControl(
                b ? Helpers.getTimeString(b.start) : null,
                Validators.required
            ),
            end: new UntypedFormControl(
                b && b.end ? Helpers.getTimeString(b.end) : null
            )
        });
    }
}
