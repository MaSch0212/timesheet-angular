import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GeneralSettingsComponent } from "./general-settings.component";

describe("GeneralSettingsComponent", () => {
    let component: GeneralSettingsComponent;
    let fixture: ComponentFixture<GeneralSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GeneralSettingsComponent],
            teardown: { destroyAfterEach: false },
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GeneralSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
