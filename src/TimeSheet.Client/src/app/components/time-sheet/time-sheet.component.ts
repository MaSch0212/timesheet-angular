import { Component, OnInit, OnDestroy, LOCALE_ID, Inject } from '@angular/core';
import { ITimeSheetEntryGroup } from '../../models/time-sheet-entry-group.model';
import { TimeSheetService } from '../../services/time-sheet.service';
import { TimeSheetEntry } from '../../models/time-sheet-entry.model';
import { Helpers } from '../../common/helpers';
import { List } from 'linqts';
import { MenuService } from '../../services/menu.service';
import { first, catchError, map } from 'rxjs/operators';
import { Observable, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteWarningDialogComponent, DeleteWarningDialogData } from '../dialogs/delete-warning-dialog/delete-warning-dialog.component';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeSheetEntryRowComponent } from './time-sheet-entry-row/time-sheet-entry-row.component';
import { CreateEntryDialogComponent } from '../dialogs/create-entry-dialog/create-entry-dialog.component';
import { BaseComponent } from '@masch212/angular-common';
import { Icons } from '../..//icons';

@Component({
  selector: 'masch-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
})
export class TimeSheetComponent extends BaseComponent implements OnInit, OnDestroy {
  private entriesPerCall: number = 50;
  private loadedEntries: number = 0;

  public Icons = Icons;

  scrollElementSelector$: Observable<string> = this.menuService.currentScrollContainer$;
  hasReachedEnd: boolean = false;
  entries: Array<ITimeSheetEntryGroup> = new Array<ITimeSheetEntryGroup>();
  overtime: number = 0;
  isLoading: boolean = false;
  isReloading: boolean = false;

  constructor(
    private _timeSheetService: TimeSheetService,
    private menuService: MenuService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    @Inject(LOCALE_ID) private currentLocale: string
  ) {
    super();
    this.menuService.setRefreshButtonVisibility(true);
    this.subscriptionManager.add(this.menuService.refreshRequested$.subscribe(() => this.reloadData()));
    this.subscriptionManager.add(
      fromEvent(document, 'visibilitychange').subscribe(() => {
        if (document.visibilityState === 'visible') {
          this.loadNextEntries(true, true);
          this.updateOvertime();
          this.snackbar.open('Welcome back!');
        }
      })
    );
  }

  ngOnInit() {
    this.updateOvertime();
    this.loadNextEntries();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.menuService.setRefreshButtonVisibility(false);
  }

  onScroll() {
    this.loadNextEntries();
  }

  onEntryAdded(entry: TimeSheetEntry): void {
    this.addEntry(entry);
    this.updateOvertime();
  }

  onSave(old: TimeSheetEntry, current: TimeSheetEntry, row: TimeSheetEntryRowComponent): void {
    if (current == null) {
      return;
    }
    this._timeSheetService.editEntry(old, current).subscribe(
      () => {
        row.panel.afterCollapse.pipe(first()).subscribe(() => {
          this.removeEntry(old);
          this.addEntry(current);
          this.updateOvertime();
        });
        row.panel.close();
        this.snackbar.open('Entry has been saved');
      },
      (error: HttpErrorResponse) => {
        row.form.errorMessage = error.error;
        this.snackbar.open('Saving entry failed', null, {
          panelClass: ['mat-warn'],
        });
      }
    );
  }

  onDelete(entry: TimeSheetEntry): void {
    const dialogRef = this.dialog.open(DeleteWarningDialogComponent, {
      data: <DeleteWarningDialogData>{
        title: 'Delete entry',
        message: `Do you really want to delete the entry starting on ${formatDate(entry.start, 'short', this.currentLocale)}?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this._timeSheetService.deleteEntry(entry).subscribe(
          () => {
            this.removeEntry(entry);
            this.updateOvertime();
            this.snackbar.open('Entry has been deleted');
          },
          (error) => {
            this.snackbar.open('Deleting entry failed', null, {
              panelClass: ['mat-warn'],
            });
          }
        );
      }
    });
  }

  reloadData(): void {
    this.loadNextEntries(true);
    this.updateOvertime();
    this.scrollElementSelector$.pipe(first()).subscribe((x) => document.querySelector(x).scrollTo(0, 0));
    this.snackbar.open('Data has been reloaded');
  }

  addSpaceBetween(entry1: TimeSheetEntry, entry2: TimeSheetEntry): boolean {
    return (
      (entry1.start.getDay() + 1) % 7 < (entry2.start.getDay() + 1) % 7 ||
      new Date(entry1.start.valueOf()).setHours(0, 0, 0, 0) - new Date(entry2.start.valueOf()).setHours(0, 0, 0, 0) >=
        7 * 24 * 60 * 60 * 1000
    );
  }

  onCreateEntry() {
    const dialogRef = this.dialog.open(CreateEntryDialogComponent, {});
    dialogRef.afterClosed().subscribe((result: TimeSheetEntry) => {
      if (result) {
        this.addEntry(result);
        this.overtime += result.workTime - result.targetHours;
      }
    });
  }

  private addEntry(entry: TimeSheetEntry): void {
    const group = this.addGroup(entry.start.getFullYear(), entry.start.getMonth());
    Helpers.insertIntoArray(group.entries, entry, (x) => x.start.getTime() < entry.start.getTime());
  }

  private addGroup(year: number, month: number) {
    let result: ITimeSheetEntryGroup = new List<ITimeSheetEntryGroup>(this.entries).SingleOrDefault(
      (x) => x.date.getFullYear() === year && x.date.getMonth() === month
    );
    if (result == null) {
      result = <ITimeSheetEntryGroup>{
        date: new Date(year, month, 1),
        entries: [],
      };
      Helpers.insertIntoArray(this.entries, result, (x) => x.date.getTime() < result.date.getTime());
    }
    return result;
  }

  private removeEntry(entry: TimeSheetEntry): void {
    const group = new List<ITimeSheetEntryGroup>(this.entries).SingleOrDefault(
      (x) => x.date.getFullYear() === entry.start.getFullYear() && x.date.getMonth() === entry.start.getMonth()
    );
    if (group != null) {
      const index = group.entries.indexOf(entry);
      if (index > -1) {
        group.entries.splice(index, 1);
      }
      if (group.entries.length === 0) {
        this.entries.splice(this.entries.indexOf(group), 1);
      }
    }
  }

  private loadNextEntries(isReload: boolean = false, keepScroll: boolean = false): void {
    if ((this.hasReachedEnd && !isReload) || (this.isLoading && !isReload) || this.isReloading) {
      return;
    }
    this.isLoading = true;
    if (isReload) {
      this.isReloading = true;
    }
    try {
      this._timeSheetService
        .getEntries(isReload ? 0 : this.loadedEntries, isReload && keepScroll ? this.loadedEntries : this.entriesPerCall)
        .pipe(
          map((newEntries) => {
            if (isReload) {
              if (!keepScroll) {
                this.hasReachedEnd = false;
              }
              this.loadedEntries = 0;
              this.entries = [];
            } else if (this.isReloading) {
              return;
            }
            if (newEntries.length < this.entriesPerCall) {
              this.hasReachedEnd = true;
            }
            this.loadedEntries += newEntries.length;

            let lastGroup = this.entries.length === 0 ? null : this.entries[this.entries.length - 1];
            newEntries.forEach((element) => {
              if (
                lastGroup === null ||
                lastGroup.date.getMonth() !== element.start.getMonth() ||
                lastGroup.date.getFullYear() !== element.start.getFullYear()
              ) {
                lastGroup = {
                  date: new Date(element.start.getFullYear(), element.start.getMonth(), 1),
                  entries: new Array<TimeSheetEntry>(),
                };
                this.entries.push(lastGroup);
              }
              lastGroup.entries.push(element);
            });
          }),
          catchError((err: HttpErrorResponse) => {
            if (err.status !== 401) {
              this.snackbar.open('Loading entries failed', null, {
                panelClass: ['mat-warn'],
              });
            }
            return of(true);
          })
        )
        .subscribe();
    } finally {
      if (isReload) {
        this.isReloading = false;
      }
      this.isLoading = false;
    }
  }

  private updateOvertime(): void {
    this._timeSheetService
      .getOvertime()
      .pipe(
        map((overtime) => {
          this.overtime = overtime;
        }),
        catchError(() => of(true))
      )
      .subscribe();
  }
}
