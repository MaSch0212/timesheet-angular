import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TimeSheetEntryFormComponent } from "./time-sheet-entry-form.component";

describe("TimeSheetEntryFormComponent", () => {
    let component: TimeSheetEntryFormComponent;
    let fixture: ComponentFixture<TimeSheetEntryFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TimeSheetEntryFormComponent],
            teardown: { destroyAfterEach: false },
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TimeSheetEntryFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
