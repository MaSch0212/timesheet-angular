import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'masch-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
    private _userInfo: User;

    @ViewChild('f', { static: true }) userForm: NgForm;

    @Input()
    get userInfo(): User {
        return this._userInfo;
    }
    set userInfo(value: User) {
        this._userInfo = value;
        setTimeout(() => {
            this.userForm.setValue({
                givenName: this._userInfo.givenName,
                surname: this._userInfo.surname,
                email: this._userInfo.email
            });
        });
    }

    formInvalid: boolean;
    saveFailed: boolean;

    constructor(
        private userService: UserService,
        private snackbar: MatSnackBar
    ) {}

    ngOnInit() {}

    onSubmit(form: NgForm) {
        this.saveFailed = false;
        this.formInvalid = form.invalid;
        if (form.invalid) {
            return;
        }

        const formValue = this.userForm.value;
        this.userService
            .updateUserInfo(
                new User({
                    id: this.userInfo.id,
                    ...formValue
                })
            )
            .subscribe(
                () => this.snackbar.open('User info changes have been saved'),
                error => {
                    this.saveFailed = true;
                    console.error(error);
                }
            );
    }
}
