import { Component, OnInit, ViewChild } from '@angular/core';
import { TimeSheetEntry } from '../../../models/time-sheet-entry.model';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeSheetService } from '../../../services/time-sheet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeSheetEntryFormComponent } from '../../time-sheet/time-sheet-entry-form/time-sheet-entry-form.component';
import { Settings } from '../../../models/settings.model';
import { SettingsService } from '../../../services/settings.service';
import { Helpers } from '../../../common/helpers';
import { Break } from '../../../models/break.model';

@Component({
  selector: 'masch-create-entry-dialog',
  templateUrl: './create-entry-dialog.component.html',
  styleUrls: ['./create-entry-dialog.component.css'],
})
export class CreateEntryDialogComponent implements OnInit {
  @ViewChild('form', { static: true }) entryForm: TimeSheetEntryFormComponent;

  settings: Settings;

  constructor(
    private dialogRef: MatDialogRef<CreateEntryDialogComponent>,
    private timeSheetService: TimeSheetService,
    private snackbar: MatSnackBar,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe((x) => {
      setTimeout(() => {
        this.settings = x;
        this.entryForm.entry = new TimeSheetEntry({
          start: Helpers.setTimeFromString(new Date(), Helpers.getTimeStringFromHours(x.defaultStart)),
          end: Helpers.setTimeFromString(new Date(), Helpers.getTimeStringFromHours(x.defaultEnd)),
          breaks: !x.insertDefaultBreak
            ? []
            : [
                new Break({
                  start: Helpers.setTimeFromString(new Date(), Helpers.getTimeStringFromHours(x.defaultBreakStart)),
                  end: Helpers.setTimeFromString(new Date(), Helpers.getTimeStringFromHours(x.defaultBreakEnd)),
                }),
              ],
          targetHours: x.workDayHours,
        });
      }, 0);
    });
  }

  onSave(entry: TimeSheetEntry) {
    this.timeSheetService.addEntry(entry).subscribe(
      () => this.dialogRef.close(entry),
      (error: HttpErrorResponse) => {
        this.entryForm.errorMessage = error.error;
        this.snackbar.open('Saving entry failed', null, {
          panelClass: ['mat-warn'],
        });
      }
    );
  }
}
