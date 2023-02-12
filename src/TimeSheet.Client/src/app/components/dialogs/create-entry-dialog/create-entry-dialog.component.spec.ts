import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateEntryDialogComponent } from "./create-entry-dialog.component";

describe("CreateEntryDialogComponent", () => {
    let component: CreateEntryDialogComponent;
    let fixture: ComponentFixture<CreateEntryDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateEntryDialogComponent],
            teardown: { destroyAfterEach: false },
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateEntryDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
