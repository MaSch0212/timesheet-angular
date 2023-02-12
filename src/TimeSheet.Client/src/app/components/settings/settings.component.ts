import { Component, OnInit } from '@angular/core';
import { Settings } from '../../models/settings.model';
import { SettingsService } from '../../services/settings.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Component({
    selector: 'masch-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    settings: Settings;
    userInfo: User;

    constructor(
        private settingsService: SettingsService,
        private userService: UserService,
        private snackbar: MatSnackBar
    ) {}

    ngOnInit() {
        this.settingsService.getSettings().subscribe(
            s => setTimeout(() => (this.settings = s), 0),
            () =>
                this.snackbar.open('Getting settings failed', null, {
                    panelClass: ['mat-warn']
                })
        );

        this.userService.getUserInfo().subscribe(
            u => setTimeout(() => (this.userInfo = u), 0),
            () =>
                this.snackbar.open('Getting user info failed', null, {
                    panelClass: ['mat-warn']
                })
        );
    }
}
