import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconRegistry } from '@angular/material/icon';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './modules/app-routing.module';
import { AngularMaterialModule } from './modules/angular-material.module';
import { HoursPipe } from './directives/hours.pipe';
import { MonthPipe } from './directives/month.pipe';
import { AppComponent } from './components/app.component';
import { LoginComponent } from './components/home/login/login.component';
import { TimeSheetComponent } from './components/time-sheet/time-sheet.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/home/register/register.component';
import { TimeSheetEntryComponent } from './components/time-sheet/time-sheet-entry/time-sheet-entry.component';
import { TimeSheetEntryFormComponent } from './components/time-sheet/time-sheet-entry-form/time-sheet-entry-form.component';
import { DeleteWarningDialogComponent } from './components/dialogs/delete-warning-dialog/delete-warning-dialog.component';
import { CreateApiKeyDialogComponent } from './components/dialogs/create-api-key-dialog/create-api-key-dialog.component';
import { CopyApiKeyDialogComponent } from './components/dialogs/copy-api-key-dialog/copy-api-key-dialog.component';
import { ApiKeysComponent } from './components/settings/api-keys/api-keys.component';
import { UserInfoComponent } from './components/settings/user-info/user-info.component';
import { GeneralSettingsComponent } from './components/settings/general-settings/general-settings.component';
import { EqualValidator } from './directives/equal.validator';
import { ChangePasswordComponent } from './components/settings/change-password/change-password.component';
import { TimeSheetEntryRowComponent } from './components/time-sheet/time-sheet-entry-row/time-sheet-entry-row.component';
import { CreateEntryDialogComponent } from './components/dialogs/create-entry-dialog/create-entry-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        TimeSheetComponent,
        SettingsComponent,
        ErrorPageComponent,
        HomeComponent,
        RegisterComponent,
        TimeSheetEntryComponent,
        HoursPipe,
        MonthPipe,
        EqualValidator,
        TimeSheetEntryFormComponent,
        DeleteWarningDialogComponent,
        CreateApiKeyDialogComponent,
        CopyApiKeyDialogComponent,
        ApiKeysComponent,
        UserInfoComponent,
        GeneralSettingsComponent,
        ChangePasswordComponent,
        TimeSheetEntryRowComponent,
        CreateEntryDialogComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        InfiniteScrollModule,
        AngularMaterialModule
    ],
    entryComponents: [
        DeleteWarningDialogComponent,
        CreateApiKeyDialogComponent,
        CopyApiKeyDialogComponent,
        CreateEntryDialogComponent
    ],
    providers: [
        //{provide: LOCALE_ID, useValue: navigator.language}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
        matIconRegistry.addSvgIconSet(
            domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')
        );
    }
}
