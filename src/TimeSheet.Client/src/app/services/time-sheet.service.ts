import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { TimeSheetEntry } from '../models/time-sheet-entry.model';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TimeSheetService {
    constructor(
        private authService: AuthenticationService,
        private httpClient: HttpClient
    ) {}

    getEntries(skip: number, take: number): Observable<TimeSheetEntry[]> {
        return this.httpClient
            .get<[]>(`api/entries?skip=${skip}&take=${take}&desc=true`, {
                headers: this.authService.httpHeaders
            })
            .pipe(map(x => x.map(y => TimeSheetEntry.fromJSON(y))));
    }

    getOvertime(): Observable<number> {
        return this.httpClient.get<number>('api/entries/overtime', {
            headers: this.authService.httpHeaders
        });
    }

    checkIn(): Observable<Object> {
        return this.httpClient.post('api/entries/checkin', null, {
            headers: this.authService.httpHeaders
        });
    }

    checkOut(): Observable<Object> {
        return this.httpClient.post('api/entries/checkout', null, {
            headers: this.authService.httpHeaders
        });
    }

    deleteEntry(entry: TimeSheetEntry): Observable<Object> {
        return this.httpClient.post('api/entries/delete?id=' + entry.id, null, {
            headers: this.authService.httpHeaders
        });
    }

    addEntry(entry: TimeSheetEntry): Observable<{ entryId: number }> {
        entry.ensureCorrectDates();
        return this.httpClient
            .post<{ entryId: number }>('api/entries/add', entry, {
                headers: this.authService.httpHeaders
            })
            .pipe(
                map(x => {
                    entry.id = x.entryId;
                    return x;
                })
            );
    }

    editEntry(
        oldEntry: TimeSheetEntry,
        newEntry: TimeSheetEntry
    ): Observable<Object> {
        newEntry.ensureCorrectDates();
        return this.httpClient.post('api/entries/edit', newEntry, {
            headers: this.authService.httpHeaders
        });
    }
}
