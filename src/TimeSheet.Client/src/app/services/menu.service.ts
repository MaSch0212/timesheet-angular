import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private _refreshRequested = new Subject<void>();
    private _refreshButtonDisplayed = new BehaviorSubject<boolean>(false);
    private _currentScrollContainer = new BehaviorSubject<string>(null);

    get refreshRequested$(): Observable<void> {
        return this._refreshRequested;
    }
    get refreshButtonDisplayed$(): Observable<boolean> {
        return this._refreshButtonDisplayed;
    }
    get currentScrollContainer$(): Observable<string> {
        return this._currentScrollContainer;
    }

    constructor() {}

    requestRefresh() {
        this._refreshRequested.next();
    }

    setRefreshButtonVisibility(visibility: boolean) {
        this._refreshButtonDisplayed.next(visibility);
    }

    setCurrentScrollContainer(elementSelector: string) {
        this._currentScrollContainer.next(elementSelector);
    }
}
