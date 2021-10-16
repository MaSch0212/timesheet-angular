import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetEntryRowComponent } from './time-sheet-entry-row.component';

describe('TimeSheetEntryRowComponent', () => {
    let component: TimeSheetEntryRowComponent;
    let fixture: ComponentFixture<TimeSheetEntryRowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TimeSheetEntryRowComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TimeSheetEntryRowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
